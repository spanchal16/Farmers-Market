const axios = require("axios");
const surl =
  "https://h99eevtqo5.execute-api.us-east-1.amazonaws.com/production";

module.exports = {
  //To display all orders
  list: async function (req, res) {
    await axios({
      method: "get",
      url: `${surl}/listorders`,
    })
      .then((response) => {
        if (response.status === 200) {
          return res.view("pages/ordersplaced", { orders: response.data });
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });
  },
};
