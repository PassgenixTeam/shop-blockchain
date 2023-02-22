<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
            crossorigin="anonymous"
        />
        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossorigin="anonymous"
        ></script>
        <title>Document</title>
        <style>
            .list {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img
                            src="{{ asset($product->image) }}"
                            class="img-fluid rounded-start"
                            alt="..."
                        />
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{{$product->name}}</h5>
                            <p class="card-text">{{$product->description}}</p>
                            <p class="card-text" id="price">
                                $ {{$product->price}}
                            </p>
                            <form
                                action="/order/product/{{$product->id}}"
                                method="post"
                            >
                                @csrf
                                <div class="input-group mb-3">
                                    <span class="input-group-text">Amount</span>
                                    <input
                                        type="number"
                                        value="1"
                                        name="amount"
                                        id="amount"
                                        class="form-control"
                                        aria-label="Dollar amount (with dot and two decimal places)"
                                    />
                                </div>
                                <br />
                                <div class="input-group mb-3">
                                    <select
                                        class="form-select"
                                        aria-label="Default select example"
                                        style="max-width: 100px"
                                    >
                                        <option selected>Coin</option>
                                    </select>
                                    <input
                                        type="text"
                                        value="0"
                                        disabled="disabled"
                                        class="form-control"
                                        id="coin-to-usd"
                                        aria-label="Sizing example input"
                                        aria-describedby="eth"
                                        style="background-color: white"
                                    />
                                    <!-- <span class="input-group-text">$</span> -->
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    Buy
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
    <script>
        function getTokenPrice(price, amount, token) {
            const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
            const apiUrl = `http://127.0.0.1:8000/coin?symbol=${JSON.stringify(
                symbols
            )}`;
            axios
                .get(apiUrl)
                .then((response) => {
                    // console.log(response.data);
                    const data = response.data;
                    const select = document.querySelector(".form-select");
                    data.forEach((element) => {
                        const opt = document.createElement("option");
                        opt.value = element.price;
                        opt.innerHTML = element.symbol.split("USDT")[0];
                        select.appendChild(opt);
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        getTokenPrice();

        //
        const price = Number(
            document.getElementById("price").innerHTML.match(/\d+/)[0]
        );
        const amount = document.getElementById("amount");
        const formSelect = document.querySelector(".form-select");
        const inputCoin = document.getElementById("coin-to-usd");

        amount.addEventListener("change", function () {
            calculateCoinValue();
        });

        formSelect.addEventListener("change", function () {
            calculateCoinValue();
        });

        function calculateCoinValue() {
            const coin = document.querySelector(".form-select");
            const coinPrice = coin.value;
            const currencyExchange =
                (Number(price) * Number(amount.value)) / Number(coinPrice);
            inputCoin.value = currencyExchange;
        }
    </script>
    <!--  -->
    <script type="module">
        import {
            ethers,
            BigNumber,
        } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";
        window.ethers = ethers;
        window.BigNumber = BigNumber;
    </script>
    <script>
        async function listenForTrustWalletInitialized(
            { timeout } = { timeout: 2000 }
        ) {
            return new Promise((resolve) => {
                const handleInitialization = () => {
                    resolve(getTrustWalletFromWindow());
                };

                window.addEventListener(
                    "trustwallet#initialized",
                    handleInitialization,
                    {
                        once: true,
                    }
                );

                setTimeout(() => {
                    window.removeEventListener(
                        "trustwallet#initialized",
                        handleInitialization,
                        { once: true }
                    );
                    resolve(null);
                }, timeout);
            });
        }

        async function getTrustWalletInjectedProvider(
            { timeout } = { timeout: 3000 }
        ) {
            const provider = getTrustWalletFromWindow();

            if (provider) {
                return provider;
            }

            return listenForTrustWalletInitialized({ timeout });
        }

        async function listenForTrustWalletInitialized(
            { timeout } = { timeout: 3000 }
        ) {
            return new Promise((resolve) => {
                const handleInitialization = () => {
                    resolve(getTrustWalletFromWindow());
                };

                window.addEventListener(
                    "trustwallet#initialized",
                    handleInitialization,
                    {
                        once: true,
                    }
                );

                setTimeout(() => {
                    window.removeEventListener(
                        "trustwallet#initialized",
                        handleInitialization,
                        { once: true }
                    );
                    resolve(null);
                }, timeout);
            });
        }

        function getTrustWalletFromWindow() {
            const isTrustWallet = (ethereum) => {
                const trustWallet = !!ethereum.isTrust;

                return trustWallet;
            };

            const injectedProviderExist =
                typeof window !== "undefined" &&
                typeof window.ethereum !== "undefined";

            if (!injectedProviderExist) {
                return null;
            }

            if (isTrustWallet(window.ethereum)) {
                return window.ethereum;
            }

            if (window.ethereum?.providers) {
                return window.ethereum.providers.find(isTrustWallet) ?? null;
            }

            return window["trustwallet"] ?? null;
        }

        async function getAbi(type) {
            try {
                const res = await axios.get("http://127.0.0.1:8000/abi-shop", {
                    params: {
                        type,
                    },
                });
                return res.data;
            } catch (e) {
                console.log(e);
            }
        }
    </script>

    <script>
        async function connectWallet() {
            try {
                const injectedProvider = await getTrustWalletInjectedProvider();
                const accounts = await injectedProvider.request({
                    method: "eth_requestAccounts",
                });

                console.log(accounts);
            } catch (e) {
                console.log(e);
                if (e.code === 4001) {
                    console.error("User denied connection.");
                }
            }
        }

        function initiateTrustWallet() {
            const ethersProvider =
                new window.ethers.providers.JsonRpcProvider();
            window.provider = ethersProvider;

            const signer = ethersProvider.getSigner();
            window.signer = signer;
        }

        async function createContractInstances() {
            const [shopAbi, tokenERC20Abi] = await Promise.all([
                getAbi("shop"),
                getAbi("token"),
            ]);

            const ShopContract = new window.ethers.Contract(
                "0x37F40F714c7a07a05032c733311602fA03de8458",
                shopAbi
            );
            window.ShopContract = ShopContract;

            const ShopContractWithSigner = ShopContract.connect(window.signer);
            window.ShopContractWithSigner = ShopContractWithSigner;

            const USDCContract = new window.ethers.Contract(
                "0x9039D761C753cCB01f1aCD531b76317DfdC59b93",
                tokenERC20Abi
            );
            window.USDCContract = USDCContract;

            const USDCContractWithSigner = USDCContract.connect(signer);
            window.USDCContractWithSigner = USDCContractWithSigner;
        }

        async function checkAllowance(price) {
            const allowance =
                await window.USDCContractWithSigner.functions.allowance(
                    await signer.getAddress(),
                    ShopContract.address
                );

            if (allowance[0].gte(price)) return;

            const approveTransaction =
                await window.USDCContractWithSigner.functions.approve(
                    ShopContract.address,
                    window.ethers.constants.MaxUint256
                );

            await approveTransaction.wait();
        }

        async function createOrderTxMessage(cigarInfo, price) {
            return window.ShopContractWithSigner.generateTxMessage(
                await window.signer.getAddress(),
                window.USDCContractWithSigner.address,
                price,
                cigarInfo
            );
        }

        async function signOrderTxMessage(orderTxMessage) {
            const shopContractSignerAddress =
                await window.ShopContractWithSigner.functions.signer();

            shopContractSignerWallet = new window.ethers.Wallet(
                "0xac050c7af9ac948e8bdfc322810b733323af37c900c18b94256e8b8acf22facb",
                window.provider
            );

            return shopContractSignerWallet.signMessage(
                ethers.utils.arrayify(orderTxMessage)
            );
        }

        async function checkPermittedToken(tokenAddress) {
            console.log(
                await window.ShopContractWithSigner.functions.permittedTokens(
                    tokenAddress
                )
            );
        }

        async function setPermittedToken(tokenAddress) {
            const shopContractOwnerAddress =
                await window.ShopContractWithSigner.functions.owner();

            shopContractOwnerWallet = new window.ethers.Wallet(
                "0x6377e95ecd6a200b68e583a6b0b46b10be0187d8621301096b323c739f62e369",
                window.provider
            );

            await window.ShopContract.connect(
                shopContractOwnerWallet
            ).functions.setPermittedToken(tokenAddress, true);
        }

        async function getTokenBalance(address) {
            console.log(
                await window.USDCContractWithSigner.functions.balanceOf(address)
            );
        }

        async function createOrder(txMessage, signature, price, data) {
            const order =
                await window.ShopContractWithSigner.functions.makeOrder(
                    txMessage,
                    signature,
                    window.USDCContractWithSigner.address,
                    price,
                    data
                );

            return order.wait();
        }

        async function main() {
            // Prepare contracts
            await connectWallet();
            await initiateTrustWallet();
            await createContractInstances();

            // Make order with USDC
            const price = ethers.utils.parseEther("0.00001"); // Replace with price of cigar
            const data = JSON.stringify({
                name: "Cigar1",
                amount: 2, // Replace with amount of cigars
                date: 123123,
            });

            await checkAllowance(price);
            const orderTxMessage = await createOrderTxMessage(data, price);
            // TODO: create API POST create order

            // BE sign transaction
            const signedOrderTxMessage = await signOrderTxMessage(
                orderTxMessage
            );

            // FE create order
            const order = await createOrder(
                orderTxMessage,
                signedOrderTxMessage,
                price,
                data
            );
            // TODO: create API PUT update order

            console.log(order);
        }

        window.onload = function () {
            main();
        };
    </script>
</html>
