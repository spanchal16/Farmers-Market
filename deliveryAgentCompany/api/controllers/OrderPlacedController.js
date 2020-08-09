const axios = require("axios");
const surl =
  "https://4yx65ijz1l.execute-api.us-east-1.amazonaws.com/production";

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

  //Add order (API)
  addorder: async function (req, res) {
    const url = require("url");
    const custom_url = new URL(
      req.protocol + "://" + req.get("host") + req.originalUrl
    );
    const search_param = custom_url.searchParams;
    if (JSON.stringify(req.query) === "{}") {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      search_param.has("oid") === false ||
      search_param.has("username") === false ||
      search_param.has("email") === false ||
      search_param.has("address") === false ||
      search_param.has("cid") === false ||
      search_param.has("type") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      req.query.oid === "" ||
      req.query.username === "" ||
      req.query.email === "" ||
      req.query.address === "" ||
      req.query.cid === "" ||
      req.query.type === ""
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      await axios({
        method: "post",
        url: `${surl}/addorder?oid=${req.query.oid}&username=${req.query.username}&email=${req.query.email}&address=${req.query.address}&cid=${req.query.cid}&type=${req.query.type}`,
      })
        .then((response) => {
          if (response.status === 200) {
            return res.ok();
          } else {
            return res.view("error", { err: response.data });
          }
        })
        .catch((err) => {
          return res.view("error", { err: err });
        });
    }
  },
};
