
const axios = require('axios')

module.exports = {
    searchProduct: async function (req, res) {
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {

            let pName = req.body.txtproduct;
            await axios({
                method: 'get',
                url: "https://farmersmarketcompany.azurewebsites.net/api/getallProducts",
                headers: {},
                data: {}
            })
                .then(function (response) {
                    // console.log(response);
                    console.log(response)
                    allData = response["data"];
                })
                .catch(function (error) {
                    return res.json({ status: 'unsuccessful' });
                });
            //        console.log(products);
            let products = [];
            for (let prod of allData) {
                if (prod.product.includes(pName, 0)) {
                    products.push(prod);
                }
            }
            console.log(products);
            if (products.length < 1) {
                products = null;
            }
            res.view('pages/searchProduct', { products })
        }

    },

    goSearch: async function (req, res) {
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {
            req.session.currentProductID = null;
            req.session.currentProduct = null;
            req.session.priceEach = null;
            req.session.currentQty = null;
            res.view('pages/searchProduct');
        }
    },


    buyProduct: async function (req, res) {
        //    console.log("hereeeeee");
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {
            // res.view('pages/searchProduct');
            const url = require("url");
            const custom_url = new URL(
                req.protocol + "://" + req.get("host") + req.originalUrl
            );
            // console.log(custom_url);
            const search_param = custom_url.searchParams;
            if (JSON.stringify(req.query) === "{}") {
                res.redirect('/userHome');
            }
            else if (
                search_param.has("productID") === false ||
                search_param.has("product") === false
            ) {
                res.redirect('/userHome');
            }
            else if (
                req.query.productID === "" ||
                req.query.product === "") {
                res.redirect('/userHome');
            }
            else {
                console.log(req.query.productID);
                console.log(req.query.product);
                let productID = req.query.productID;
                let product = req.query.product;
                let priceDetail = null;
                await axios({
                    method: 'get',
                    url: "https://farmersmarketcompany.azurewebsites.net/api/getPrice/" + req.query.productID +
                        "/" + req.query.product,
                    headers: {},
                    data: {}
                })
                    .then(function (response) {
                        // console.log(response);
                        console.log("priceeee-->" + response.data)
                        priceDetail = response;
                    })
                    .catch(function (error) {
                        return res.json({ status: 'unsuccessful' });
                    });
                let prc = 0;
                for (let pr of priceDetail.data) {
                    console.log(pr);
                    prc = pr.price
                }
                if (req.query.error != undefined) {
                    let error = req.query.error;
                    res.view('pages/buyProduct', { productID, product, prc, error });
                }
                else {
                    req.session.priceEach = prc;
                    req.session.currentProductID = req.query.productID;
                    req.session.currentProduct = req.query.product;
                    res.view('pages/buyProduct', { productID, product, prc });

                }
            }
        }
    },

    checkAvailability: async function (req, res) {
        let qty = req.body.txtquantity;
        let st = null;
        await axios({
            method: 'get',
            url: "https://farmersmarketcompany.azurewebsites.net/api/enoughStock/" + req.body.txtproductid +
                "/" + req.body.txtproduct + "/" + qty,
            headers: {},
            data: {}
        })
            .then(function (response) {
                // console.log(response);
                console.log("sts-->" + response.data)
                st = response;
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
            });
        let status = st.data["status"];
        if (status === "yes") {
            res.redirect("/selectDelivery?productID=" + req.body.txtproductid +
                "&product=" + req.body.txtproduct + "&qty=" + qty + "&peach=" + req.body.txtprice);
        }
        else {
            req.session.priceEach = null;
            res.redirect("/buyProduct?productID=" + req.body.txtproductid +
                "&product=" + req.body.txtproduct + "&error= Not sufficient Quantity");
        }
    },

    selectDelivery: async function (req, res) {
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {
            const url = require("url");
            const custom_url = new URL(
                req.protocol + "://" + req.get("host") + req.originalUrl
            );
            // console.log(custom_url);
            const search_param = custom_url.searchParams;
            if (JSON.stringify(req.query) === "{}") {
                res.redirect('/userHome');
            }
            else if (
                search_param.has("productID") === false ||
                search_param.has("product") === false ||
                search_param.has("qty") === false
            ) {
                res.redirect('/userHome');
            }
            else if (
                req.query.productID === "" ||
                req.query.product === "" ||
                req.query.qty === "") {
                res.redirect('/userHome');
            }
            else {
                let productID = req.query.productID;
                let product = req.query.product;
                let quantity = req.query.qty;
                let peach = req.query.peach;

                await axios({
                    method: 'get',
                    url: "http://deliveryagent-env.eba-vnnr4erm.us-east-1.elasticbeanstalk.com/api/allcompanies",
                    headers: {},
                    data: {}
                })
                    .then(function (response) {
                        // console.log(response);
                        console.log("Check this now-->")
                        console.log(response);
                        console.log(response.data);
                        let allData = response;
                        req.session.currentProductID = productID;
                        req.session.currentProduct = product;
                        req.session.currentQty = quantity;
                        req.session.priceEach = peach;
                        res.view("pages/selectDelivery", { allData, quantity })

                        console.log("Setting sessions: " + req.session.currentProduct)

                    })
                    .catch(function (error) {
                        return res.json({ status: 'unsuccessful' });
                    });

            }
        }
    },

    checkDelivery: async function (req, res) {
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {
            const url = require("url");
            const custom_url = new URL(
                req.protocol + "://" + req.get("host") + req.originalUrl
            );
            // console.log(custom_url);
            const search_param = custom_url.searchParams;
            if (JSON.stringify(req.query) === "{}") {
                res.redirect('/userHome');
            }
            else if (
                search_param.has("cID") === false ||
                search_param.has("ctype") === false
            ) {
                res.redirect('/userHome');
            }
            else if (
                req.query.cID === "" ||
                req.query.ctype === "") {
                res.redirect('/userHome');
            }
            else {
                await axios({
                    method: 'get',
                    url: "http://deliveryagent-env.eba-vnnr4erm.us-east-1.elasticbeanstalk.com/api/company?cid=" + req.query.cID
                        + "&type=" + req.query.ctype,
                    headers: {},
                    data: {}
                })
                    .then(function (response) {
                        console.log("jlkkm" + response.data["Driver"]);

                        if (parseInt(response.data["Driver"], 10) > 0) {
                            console.log("driver available")
                            console.log("Accessing sessions: " + req.session.currentProduct)
                            console.log(response.data["Price"]);
                            let driverCost = parseInt(response.data["Price"], 10)
                            let deliveryCompany = response.data["C_Name"]
                            let deliveryType = response.data["Type"]
                            let deliveryCompanyId = response.data["C_ID"]
                            let productId = req.session.currentProductID;
                            let prod = req.session.currentProduct;
                            let priceEach = req.session.priceEach;
                            let quant = req.query.qty;
                            let address = req.session.address;
                            let productCost = Number((parseFloat(quant + "") * parseFloat(priceEach + "")).toFixed(2));
                            let total = Number((driverCost + (parseFloat(quant + "") * parseFloat(priceEach + ""))).toFixed(2));
                            res.view("pages/orderSummary", {
                                driverCost, deliveryCompany, deliveryCompanyId, deliveryType, productId,
                                prod, productCost, priceEach, quant, address, total
                            });
                        }
                        else {
                            console.log("driver unavailable")
                            res.redirect("/userHome?error= All delivery persons are busy. Please try again with a different company!");
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                        return res.json({ status: 'unsuccessful' });
                    });

            }
        }
    },
    placeOrder: async function (req, res) {

        //Get date and time
            //Get date and time
    let date_time = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // current year
    let year = date_time.getFullYear();

    // current hours
    let hours = date_time.getHours();

    // current minutes
    let minutes = date_time.getMinutes();

    // current seconds
    let seconds = date_time.getSeconds();

    let dateCurrent = year + "-" + month + "-" + date

    // prints date in YYYY-MM-DD format

    let timeCurrent = hours + ":" + minutes + ":" + seconds

        //Getting all the data
        let driverCost = req.body.txtdeliverycost;
        let deliveryCompany = req.body.txtcompany;
        let deliveryType = req.body.txtdeliverytype;
        let deliveryCompanyId = req.body.txtcompanyid;
        let productId = req.body.txtproductid;
        let prod = req.body.txtproduct;
        let priceEach = req.body.txtprice;
        let quant = req.body.txtquantity;
        let address = req.body.txtaddress;
        let productCost = req.body.txtproductcost;
        let totalCost = req.body.txttotal;
        let userName = req.session.name;
        let emailId = req.session.emailId;
        let currentTime = dateCurrent + " " + timeCurrent;
        let dt = currentTime.split(" ");
        let orderId = emailId + "_"+ year + month + date+"_"+hours + minutes + seconds;
        let isProductAvailable = false;
        let isdeliveryPersonAvailable = false;


        console.log(orderId)

        //Check avail of prod
        let st = null;
        await axios({
            method: 'get',
            url: "https://farmersmarketcompany.azurewebsites.net/api/enoughStock/" + productId +
                "/" + prod + "/" + quant,
            headers: {},
            data: {}
        })
            .then(function (response) {
                // console.log(response);
                st = response;
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
            });
        let status = st.data["status"];
        if (status === "yes") {
            isProductAvailable = true;
        }
        else {
            isProductAvailable = false;
        }
        //Check avail of driver
        let availableDrivers = 0;
        await axios({
            method: 'get',
            url: "http://deliveryagent-env.eba-vnnr4erm.us-east-1.elasticbeanstalk.com/api/company?cid=" + deliveryCompanyId
                + "&type=" + deliveryType,
            headers: {},
            data: {}
        })
            .then(function (response) {
                console.log("Drivers" + response.data["Driver"]);
                availableDrivers = parseInt(response.data["Driver"], 10);
                if (parseInt(response.data["Driver"], 10) > 0) {
                    isdeliveryPersonAvailable = true
                }
                else {
                    isdeliveryPersonAvailable = false;
                }
            })
            .catch(function (error) {
                console.log(error)
                return res.json({ status: 'unsuccessful' });
            });

        if(isProductAvailable && isdeliveryPersonAvailable){
        //checking XA trasaction

        let sql_statement = "XA START 'xatest'";

            await sails.sendNativeQuery(sql_statement, async function (err, results) {
                if (err) {
                    console.log(err);
                    
                }
                else {
                    console.log("XA began");
                    let insert_statement = "";
                    //UpdateX
                    await sails.sendNativeQuery(insert_statement, async function (err, results) {
                        if (err) {
                            console.log(err);
                            
                        }
                        else {
                            console.log("Insert Stataement running...");
                            //UpdateY

                        }
                    });

                }
            });
        }
        else if(isdeliveryPersonAvailable && !isProductAvailable){
            let error_message = "The product you were odering has just gone out of stock. We are working hard to re-stock!"+
            " Please check back again in few days!";
            res.redirect("/orderResult?error=" + error_message);
        }
        else{
            let error_message = "Oops! looks like the delivery company is running short of delivery drivers. Please try again with a different company";
            res.redirect("/orderResult?error=" + error_message);
        }
        
        
        //UpdateZ

        let success_message = "Your order has been placed successfully. Your order id is " + orderId;
        res.redirect("/orderResult?success=" + success_message);

    },

    orderResult: async function (req, res) {
        if (req.session.authenticated != true) {
            res.redirect('/?error=You need to login first!');
        }
        else {
            const url = require("url");
            const custom_url = new URL(
                req.protocol + "://" + req.get("host") + req.originalUrl
            );
            const search_param = custom_url.searchParams;
            if (JSON.stringify(req.query) === "{}") {
                res.redirect('/userHome');
            }
            else if (
                search_param.has("error") === false &&
                search_param.has("success") === false) {
                res.redirect('/userHome');
            }
            else if (
                search_param.has("error") === true &&
                search_param.has("success") === false) {
                let error = req.query.error;
                res.view("pages/orderResult", { error });
            }
            else if (
                search_param.has("error") === false &&
                search_param.has("success") === true) {
                let success = req.query.success;
                res.view("pages/orderResult", { success });
            }
        }
    },
};