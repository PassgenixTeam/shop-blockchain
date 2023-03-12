export async function getTrustWalletInjectedProvider(
    { timeout } = { timeout: 3000 }
) {
    const provider = getTrustWalletFromWindow();
    if (provider) provider;

    return listenForTrustWalletInitialized({ timeout });
}

async function listenForTrustWalletInitialized(
    { timeout } = { timeout: 3000 }
) {
    return new Promise((resolve) => {
        const handleInitialization = () => resolve(getTrustWalletFromWindow());

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
    const injectedProviderExist =
        typeof window !== "undefined" && typeof window.ethereum !== "undefined";

    if (!injectedProviderExist) return null;

    if (window.ethereum.isTrust) return window.ethereum;

    if (window.ethereum?.providers)
        return window.ethereum.providers.find(isTrustWallet) ?? null;

    return window["trustwallet"] ?? null;
}

export async function initiateTrustWallet() {
    const injectedProvider = await getTrustWalletInjectedProvider();
    const ethersProvider = new window.ethers.providers.Web3Provider(
        injectedProvider || window.ethereum
    );
    window.provider = ethersProvider;

    if (window.ethereum.isTrust) console.log("Trust Wallet is connected");
    else console.log("Trust Wallet is not connected, using Metamask wallet");

    await window.provider.send("eth_requestAccounts", []);

    const signer = ethersProvider.getSigner();
    window.signer = signer;
}
