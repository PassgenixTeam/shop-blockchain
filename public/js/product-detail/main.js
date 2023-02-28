import {
    ethers,
    BigNumber,
} from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";
import "./select-coin.js";

import {
    connectWallet,
    createContractInstances,
    createOrderTxMessage,
    signOrderTxMessage,
    checkAllowance,
    createOrder,
    withdraw,
    getOwner,
} from "./contract.js";
import { initiateTrustWallet } from "./trust-wallet.js";
import { updateOrderProduct, signOrder, postOrderProduct } from "./api.js";
import {
    viewContractBalances,
    viewOwnerBalances,
    viewUserBalances,
} from "./select-coin.js";

window.ethers = ethers;
window.BigNumber = BigNumber;

async function buyProduct(productData) {
    try {
        // Make order with USDC
        const newOrder = await postOrderProduct(productData.id, productData);

        const price = window.ethers.utils.parseEther(
            newOrder.total_price.toString()
        );
        const data = JSON.stringify({
            name: productData.name,
            amount: productData.amount, // Replace with amount of cigars
            date: new Date().toISOString(),
        });

        await createContractInstances();
        await checkAllowance(price);
        const orderTxMessage = await createOrderTxMessage(data, price);

        const updatedOrder = await updateOrderProduct(newOrder.id, {
            tx_message: orderTxMessage,
        });

        // BE sign transaction

        const signedOrderTxMessage = await signOrder(orderTxMessage);
        console.log(signedOrderTxMessage);

        // const signedOrderTxMessage2 = await signOrderTxMessage(orderTxMessage);
        // console.log(signedOrderTxMessage2);

        // FE create order
        try {
            const order = await createOrder(
                orderTxMessage,
                signedOrderTxMessage,
                price,
                data
            );
        } catch (error) {
            throw new Error(error.reason);
        }

        await updateOrderProduct(newOrder.id, {
            order_status: "paid",
        });

        console.log("done");
        viewBalances();
    } catch (error) {
        // throw error;
        alert(error.message);
    }
}

async function handleWithdraw() {
    const button = document.getElementById("withdraw");

    button.addEventListener("click", async () => {
        await withdraw(window.coinAddress);
        viewBalances();
    });
}

async function viewIsOwner() {
    const owner = await getOwner();

    const withdrawBtn = document.getElementById("withdraw");
    const isOwnerElement = document.getElementById("isOwner");

    if (
        owner.toLowerCase() === (await window.signer.getAddress()).toLowerCase()
    ) {
        isOwnerElement.innerHTML = "You are the owner";
        withdrawBtn.classList.remove("disabled");
    } else {
        isOwnerElement.innerHTML = "You are not the owner";
        withdrawBtn.classList.add("disabled");
    }
}

function viewBalances() {
    viewUserBalances();
    viewOwnerBalances();
    viewContractBalances();
    viewIsOwner();
}

async function main() {
    // Prepare contracts
    // await connectWallet();
    await initiateTrustWallet();
    await createContractInstances();
    viewBalances();
}

const orderForm = document.getElementById("order-form");
orderForm.onsubmit = async (e) => {
    e.preventDefault();
    // await buyProduct();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    buyProduct(formProps);
};

window.onload = function () {
    main();
    handleWithdraw();
};
