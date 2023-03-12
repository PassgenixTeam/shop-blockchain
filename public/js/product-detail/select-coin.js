import { getTokenPrice } from "./api.js";
import config from "./config.js";
import { getBalance, getOwner } from "./contract.js";

const symbols = Object.keys(config.coinAddress);
const coinAddresses = config.coinAddress;

// set option value coin
const select = document.querySelector(".form-select");
symbols.forEach((symbol) => {
    const opt = document.createElement("option");
    opt.value = symbol;
    opt.innerHTML = symbol.split("USDT")[0] || "USDT";
    select.appendChild(opt);
});

// getTokenPrice(symbols);

//
const priceInput = Number(
    document.getElementById("price").innerHTML.match(/\d+/)[0]
);
const amount = document.getElementById("amount");
const formSelect = document.querySelector(".form-select");
const inputCoin = document.getElementById("coin-to-usd");

amount.addEventListener("change", function () {
    calculateCoinValue();
});

formSelect.addEventListener("change", function () {
    window.coinAddress = coinAddresses[formSelect.value];
    calculateCoinValue();
});

function calculateCoinValue() {
    const selectedCoin = document.querySelector(".form-select");
    // const coinPrice = window.coins.find(
    //     (coin) => coin.symbol === selectedCoin.value
    // ).price;
    const currencyExchange = Number(priceInput) * Number(amount.value);
    inputCoin.value = currencyExchange;
}

export async function viewUserBalances() {
    const balanceHtml = (
        await Promise.all(
            Object.keys(coinAddresses).map(async (symbol) => {
                const tokenAddress = coinAddresses[symbol];

                const balance = await getBalance(
                    tokenAddress,
                    await window.signer.getAddress()
                );
                return `<strong>${symbol.replace(
                    "USDT",
                    ""
                )}:</strong> ${window.ethers.utils.formatEther(balance)}<br/>`;
            })
        )
    ).join("");

    const balanceElement = document.getElementById("userBalance");
    balanceElement.innerHTML = balanceHtml;
}

export async function viewOwnerBalances() {
    const balanceHtml = (
        await Promise.all(
            Object.keys(coinAddresses).map(async (symbol) => {
                const tokenAddress = coinAddresses[symbol];

                const balance = await getBalance(
                    tokenAddress,
                    await getOwner()
                );
                return `<strong>${symbol.replace(
                    "USDT",
                    ""
                )}:</strong> ${window.ethers.utils.formatEther(balance)}<br/>`;
            })
        )
    ).join("");

    const balanceElement = document.getElementById("ownerBalance");
    balanceElement.innerHTML = balanceHtml;
}

export async function viewContractBalances() {
    const balanceHtml = (
        await Promise.all(
            Object.keys(coinAddresses).map(async (symbol) => {
                const tokenAddress = coinAddresses[symbol];

                const balance = await getBalance(
                    tokenAddress,
                    await window.ShopContractWithSigner.address
                );
                return `<strong>${symbol.replace(
                    "USDT",
                    ""
                )}:</strong> ${window.ethers.utils.formatEther(balance)}<br/>`;
            })
        )
    ).join("");

    const balanceElement = document.getElementById("contractBalance");
    balanceElement.innerHTML = balanceHtml;
}
