import { getTokenPrice } from "./api.js";

const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];
// set option value coin
const select = document.querySelector(".form-select");
symbols.forEach((symbol) => {
    const opt = document.createElement("option");
    opt.value = symbol;
    opt.innerHTML = symbol.split("USDT")[0];
    select.appendChild(opt);
});

getTokenPrice(symbols);

//
const priceInput = Number(
    document.getElementById("price").innerHTML.match(/\d+/)[0]
);
const amount = document.getElementById("amount");
const formSelect = document.querySelector(".form-select");
const inputCoin = document.getElementById("coin-to-usd");

amount.addEventListener("keypress", function () {
    calculateCoinValue();
});

formSelect.addEventListener("change", function () {
    calculateCoinValue();
});

function calculateCoinValue() {
    const selectedCoin = document.querySelector(".form-select");
    const coinPrice = window.coins.find(
        (coin) => coin.symbol === selectedCoin.value
    ).price;
    const currencyExchange =
        (Number(priceInput) * Number(amount.value)) / Number(coinPrice);
    inputCoin.value = currencyExchange;
}
