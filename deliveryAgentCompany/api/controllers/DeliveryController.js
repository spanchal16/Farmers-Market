const axios = require("axios");
const surl =
  "https://4yx65ijz1l.execute-api.us-east-1.amazonaws.com/production";
module.exports = {
  //display all company agents
  list: async function (req, res) {
    await axios({
      method: "get",
      url: `${surl}/listcompanies`,
    })
      .then((response) => {
        if (response.status === 200) {
          return res.view("pages/homepage", { agents: response.data });
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });
  },

  //To create new delivery company
  create: async function (req, res) {
    let temp1 = false;
    let temp2 = false;
    await axios({
      method: "post",
      url: `${surl}/addcompany?cid=${req.body.txtcompanyid}&cname=${req.body.txtcompanyname}&type=Fast&price=${req.body.txtfprice}&driver=${req.body.txtfdriver}`,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          temp1 = true;
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });

    await axios({
      method: "post",
      url: `${surl}/addcompany?cid=${req.body.txtcompanyid}&cname=${req.body.txtcompanyname}&type=Slow&price=${req.body.txtsprice}&driver=${req.body.txtsdriver}`,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          temp2 = true;
        } else {
          return res.view("error", { err: response.data });
        }
      })
      .catch((err) => {
        return res.view("error", { err: err });
      });

    if (temp1 === true && temp2 === true) {
      return res.redirect("/");
    }
  },

  //To fetch existing company
  editcompany: async function (req, res) {
    await axios({
      method: "get",
      url: `${surl}/getcompany?cid=${req.query.cid}&type=${req.query.type}`,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return res.view("pages/editcompany", { agents: response.data });
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },

  //To update company
  update: async function (req, res) {
    await axios({
      method: "post",
      url: `${surl}/editcompany?cid=${req.body.txtcompanyid}&type=${req.body.txttype}&price=${req.body.txtprice}&driver=${req.body.txtdriver}`,
    })
      .then((response) => {
        if (response.status === 200) {
          res.redirect("/");
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },

  //To search company
  search: async function (req, res) {
    await axios({
      method: "get",
      url: `${surl}/getcompany?cid=${req.body.txtcompanyid}&type=${req.body.txttype}`,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data !== null) {
            return res.view("pages/searchcompany", { agents: response.data });
          } else {
            return res.view("pages/searchcompany", { agents: null });
          }
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },

  //To view all companies using(API)
  allcompanies: async function (req, res) {
    await axios({
      method: "get",
      url: `${surl}/listcompanies`,
    })
      .then((response) => {
        if (response.status === 200) {
          return res.status(200).json(response.data);
        } else {
          return res.send(500, { error: response.data });
        }
      })
      .catch((err) => {
        return res.send(500, { error: `Something Went Wrong!\n${err}` });
      });
  },

  //To view a company using (API)
  company: async function (req, res) {
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
      search_param.has("cid") === false ||
      search_param.has("type") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (req.query.cid === "" || req.query.type === "") {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      await axios({
        method: "get",
        url: `${surl}/getcompany?cid=${req.query.cid}&type=${req.query.type}`,
      })
        .then((response) => {
          if (response.status === 200) {
            return res.status(200).json(response.data);
          } else {
            return res.view("error", { err: response.data });
          }
        })
        .catch((err) => {
          return res.view("error", { err: err });
        });
    }
  },

  //To  edit driver using (API)
  updatedriver: async function (req, res) {
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
      search_param.has("cid") === false ||
      search_param.has("type") === false ||
      search_param.has("driver") === false
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else if (
      req.query.cid === "" ||
      req.query.type === "" ||
      req.query.driver === ""
    ) {
      res.status(404).json({
        message: "Please enter proper parameter",
      });
    } else {
      await axios({
        method: "post",
        url: `${surl}/editdriver?cid=${req.query.cid}&type=${req.query.type}&driver=${req.query.driver}`,
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
