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
        process.env.ETHEREUM_SIGNER_PRIVATE_KEY,
        ethersProvider
    );

    const signature = await signerWallet.signMessage(
        ethers.getBytes(orderTxMessage)
    );

    console.log(signature);
})();
