const axios = require("axios");
const surl =
  "https://h99eevtqo5.execute-api.us-east-1.amazonaws.com/production";
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
};
