const express = require("express");
const app = express();
app.use(express.json());
const url = require("url");
const sls = require("serverless-http");

//Fetching model
const companyDetails = require("./model/companyDetails");
const orderDetails = require("./model/orderDetails");

//Database connection information
const db = require("./database");

//Making connection with the database
db.authenticate()
  .then(() => console.log("Connected To Database..."))
  .catch((err) => console.log("Error", err));

//Fetching details of all companies (R)
app.get("/listcompanies", async (req, res) => {
  await companyDetails
    .findAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//Fetching details of a company (R)
app.get("/getcompany", async (req, res) => {
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
    await companyDetails
      .findOne({ where: { C_ID: req.query.cid, Type: req.query.type } })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//Fetching details of all oreders (R)
app.get("/listorders", async (req, res) => {
  await orderDetails
    .findAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//Adding a new company (C)
app.post("/addcompany", async (req, res) => {
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
    search_param.has("cname") === false ||
    search_param.has("type") === false ||
    search_param.has("price") === false ||
    search_param.has("driver") === false
  ) {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else if (
    req.query.cid === "" ||
    req.query.cname === "" ||
    req.query.type === "" ||
    req.query.price === "" ||
    req.query.driver === ""
  ) {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else {
    await companyDetails
      .create({
        C_ID: req.query.cid,
        C_Name: req.query.cname,
        Type: req.query.type,
        Price: req.query.price,
        Driver: req.query.driver,
      })
      .then((result) => {
        res.status(200).json({
          message: "New Company Added Successfully",
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//Adding a new order (C)
app.post("/addorder", async (req, res) => {
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
    await orderDetails
      .create({
        O_ID: req.query.oid,
        Username: req.query.username,
        Email: req.query.email,
        Address: req.query.address,
        C_ID: req.query.cid,
        Type: req.query.type,
      })
      .then((result) => {
        res.status(200).json({
          message: "New Order Added Successfully",
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//Edit driver and rate of service (U)
app.post("/editcompany", async (req, res) => {
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
    search_param.has("price") === false ||
    search_param.has("driver") === false
  ) {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else if (
    req.query.cid === "" ||
    req.query.type === "" ||
    req.query.price === "" ||
    req.query.driver === ""
  ) {
    res.status(404).json({
      message: "Please enter proper parameter",
    });
  } else {
    await companyDetails
      .update(
        {
          Price: req.query.price,
          Driver: req.query.driver,
        },
        {
          where: { C_ID: req.query.cid, Type: req.query.type },
        }
      )
      .then((result) => {
        if (result[0] === 1) {
          res.status(200).json({
            message: "Company Edited Successfully",
          });
        } else {
          res.status(400).json({
            message: "No such value exist",
          });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//Edit driver (U)
app.post("/editdriver", async (req, res) => {
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
    await companyDetails
      .update(
        {
          Driver: req.query.driver,
        },
        {
          where: { C_ID: req.query.cid, Type: req.query.type },
        }
      )
      .then((result) => {
        if (result[0] === 1) {
          res.status(200).json({
            message: "Driver Edited Successfully",
          });
        } else {
          res.status(400).json({
            message: "No such value exist",
          });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

//app.listen(3000, () => console.log(`Listening to port 3000...`));
module.exports.handler = sls(app);
