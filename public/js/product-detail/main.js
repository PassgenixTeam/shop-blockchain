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
} from "./contract.js";
import { initiateTrustWallet } from "./trust-wallet.js";
import { updateOrderProduct, signOrder, postOrderProduct } from "./api.js";

window.ethers = ethers;
window.BigNumber = BigNumber;

async function buyProduct(productData) {
    // Make order with USDC
    const newOrder = await postOrderProduct(productData.id, productData);

    const price = window.ethers.utils.parseEther(
        newOrder.total_price.toString()
    );
    const data = JSON.stringify({
        name: "{{ $product->name }}",
        amount: productData.amount, // Replace with amount of cigars
        date: new Date().toISOString(),
    });

    await checkAllowance(price);
    const orderTxMessage = await createOrderTxMessage(data, price);

    const updatedOrder = await updateOrderProduct(newOrder.id, {
        tx_message: orderTxMessage,
    });

    // BE sign transaction

    const signedOrderTxMessage = await signOrder(orderTxMessage);

    const signedOrderTxMessage2 = await signOrderTxMessage(orderTxMessage);

    // FE create order
    const order = await createOrder(
        orderTxMessage,
        window.BigNumber.from(signedOrderTxMessage).add(27).toHexString(),
        price,
        data
    );

    await updateOrderProduct(newOrder.id, {
        order_status: "paid",
    });

    console.log("done");
}

async function main() {
    // Prepare contracts
    await connectWallet();
    await initiateTrustWallet();
    await createContractInstances();
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
};
