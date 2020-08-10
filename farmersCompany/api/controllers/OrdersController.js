const axios = require('axios');

function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("error", { err: error });
}

module.exports = {
    // GET ALL
    viewData: async function (req, res) {
        try {
            var orders = await axios.get("https://kei3ipx56h.execute-api.us-east-1.amazonaws.com/test/getallorders");
            if (!orders.data) {
                let code = "400";
                let message = "No data in database";
                showError(code, message, res);
            }
            if (orders.data) {
                return res.view("pages/orders/viewOrders", { orders: orders.data })
            }
        } catch (err) {
            return res.view("error", { err: err });
        }
    }
}