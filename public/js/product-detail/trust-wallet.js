export async function getTrustWalletInjectedProvider(
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
        typeof window !== "undefined" && typeof window.ethereum !== "undefined";

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

export async function initiateTrustWallet() {
    // const injectedProvider = await getTrustWalletInjectedProvider();
    const ethersProvider = new window.ethers.providers.Web3Provider(
        window.ethereum
    );
    window.provider = ethersProvider;
    await window.provider.send("eth_requestAccounts", []);

    const signer = ethersProvider.getSigner();
    window.signer = signer;
}
