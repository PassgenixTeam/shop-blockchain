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
        "0xF0E6C8733494a895E2848D60215C1799535f1E01",
        shopAbi
    );
    window.ShopContract = ShopContract;

    const ShopContractWithSigner = ShopContract.connect(window.signer);
    window.ShopContractWithSigner = ShopContractWithSigner;

    if (window.coinAddress) {
        const USDCContract = new window.ethers.Contract(
            window.coinAddress,
            tokenERC20Abi
        );
        window.USDCContract = USDCContract;

        const USDCContractWithSigner = USDCContract.connect(signer);
        window.USDCContractWithSigner = USDCContractWithSigner;
    }
}

export async function getBalance(tokenAddress, address) {
    const tokenERC20Abi = await getAbi("token");
    const USDCContract = new window.ethers.Contract(
        tokenAddress,
        tokenERC20Abi
    );

    const balance = await USDCContract.connect(signer).balanceOf(address);
    return balance;
}

export async function checkAllowance(price) {
    const allowance = await window.USDCContractWithSigner.allowance(
        await signer.getAddress(),
        ShopContract.address
    );

    if (allowance.gte(price)) return;

    const approveTransaction = await window.USDCContractWithSigner.approve(
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
    const shopContractSignerWallet = new window.ethers.Wallet(
        "0x27da660f98301f8d50f55022d54559d38c674ec466c331d416f85ee32d0b60a7",
        window.provider
    );

    return shopContractSignerWallet.signMessage(
        ethers.utils.arrayify(orderTxMessage)
    );
}

async function checkPermittedToken(tokenAddress) {
    console.log(
        await window.ShopContractWithSigner.permittedTokens(tokenAddress)
    );
}

async function setPermittedToken(tokenAddress) {
    const shopContractOwnerAddress =
        await window.ShopContractWithSigner.owner();

    const shopContractOwnerWallet = new window.ethers.Wallet(
        "0x6377e95ecd6a200b68e583a6b0b46b10be0187d8621301096b323c739f62e369",
        window.provider
    );

    await window.ShopContract.connect(
        shopContractOwnerWallet
    ).setPermittedToken(tokenAddress, true);
}

export async function withdraw(tokenAddress) {
    const transaction = await window.ShopContractWithSigner.withdraw(
        await window.signer.getAddress(),
        tokenAddress
    );
    await transaction.wait();
}

export async function getOwner() {
    return await window.ShopContractWithSigner.owner();
}

export async function createOrder(txMessage, signature, price, data) {
    const order = await window.ShopContractWithSigner.makeOrder(
        txMessage,
        signature,
        window.USDCContractWithSigner.address,
        price,
        data
    );

    return order.wait();
}
