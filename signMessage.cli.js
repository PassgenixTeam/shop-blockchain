import { ethers } from "ethers";
import doetenv from "dotenv";

const args = process.argv.slice(2);
const [orderTxMessage] = args;

doetenv.config({
    path: ".env",
});

(async () => {
    const ethersProvider = new ethers.JsonRpcProvider(
        process.env.ETHEREUM_HTTP_PROVIDER
    );

    const signerWallet = new ethers.Wallet(
        "0x63df86a8be65663b5e59180c749d7cd0c2237f146919ec5827630373d75ad0df",
        ethersProvider
    );

    const signature = await signerWallet.signMessage(
        ethers.getBytes(orderTxMessage)
    );

    console.log(signature);
})();
