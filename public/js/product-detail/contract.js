import { getTrustWalletInjectedProvider } from "./trust-wallet.js";
import { getAbi } from "./api.js";

export async function connectWallet() {
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

export async function createContractInstances() {
    const [shopAbi, tokenERC20Abi] = await Promise.all([
        getAbi("shop"),
        getAbi("token"),
    ]);

    const ShopContract = new window.ethers.Contract(
        "0xD6d437d485DA2B2684E413CE2F416d8021Fa906F",
        shopAbi
    );
    window.ShopContract = ShopContract;

    const ShopContractWithSigner = ShopContract.connect(window.signer);
    window.ShopContractWithSigner = ShopContractWithSigner;

    const USDCContract = new window.ethers.Contract(
        "0xCe95B81F8A995891B4CF84D1dc511aFEb6300E70",
        tokenERC20Abi
    );
    window.USDCContract = USDCContract;

    const USDCContractWithSigner = USDCContract.connect(signer);
    window.USDCContractWithSigner = USDCContractWithSigner;
}

export async function checkAllowance(price) {
    const allowance = await window.USDCContractWithSigner.functions.allowance(
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

export async function createOrderTxMessage(cigarInfo, price) {
    return window.ShopContractWithSigner.generateTxMessage(
        await window.signer.getAddress(),
        window.USDCContractWithSigner.address,
        price,
        cigarInfo
    );
}

export async function signOrderTxMessage(orderTxMessage) {
    const shopContractSignerAddress =
        await window.ShopContractWithSigner.functions.signer();

    const shopContractSignerWallet = new window.ethers.Wallet(
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

    const shopContractOwnerWallet = new window.ethers.Wallet(
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

export async function createOrder(txMessage, signature, price, data) {
    const order = await window.ShopContractWithSigner.functions.makeOrder(
        txMessage,
        signature,
        window.USDCContractWithSigner.address,
        price,
        data
    );

    return order.wait();
}
