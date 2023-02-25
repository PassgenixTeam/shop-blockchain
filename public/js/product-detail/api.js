export async function postOrderProduct(id, productData) {
    try {
        const res = await axios.post(`/order/product/${id}`, productData);

        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function updateOrderProduct(id, productData) {
    try {
        const res = await axios.put(`/order/product/${id}`, productData);

        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function signOrder(txMessage) {
    try {
        const res = await axios.post("/ethereum", {
            txMessage,
        });

        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getAbi(type) {
    try {
        const res = await axios.get("http://127.0.0.1:8000/abi-shop", {
            params: {
                type,
            },
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export function getTokenPrice(symbols) {
    const apiUrl = `http://127.0.0.1:8000/coin?symbol=${JSON.stringify(
        symbols
    )}`;
    axios
        .get(apiUrl)
        .then((response) => {
            // console.log(response.data);
            const data = response.data;
            window.coins = data;
        })
        .catch((error) => {
            console.error(error);
        });
}
