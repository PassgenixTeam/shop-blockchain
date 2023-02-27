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
        "0x27da660f98301f8d50f55022d54559d38c674ec466c331d416f85ee32d0b60a7",
        ethersProvider
    );

    const signature = await signerWallet.signMessage(
        ethers.getBytes(orderTxMessage)
    );

    console.log(signature);
})();
