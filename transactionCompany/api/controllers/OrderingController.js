
const axios = require('axios')
module.exports = {
    searchProduct: async function (req, res) {
        if(req.session.authenticated != true ){
            res.redirect('/?error=You need to login first!');
        }
        else{

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
            if(prod.product.includes(pName,0)){
                products.push(prod);
            }
        }
        console.log(products);
        if(products.length < 1){
            products = null;
        }
        res.view('pages/searchProduct', { products })
        }
        
      },

      goSearch: async function (req, res) {
        if(req.session.authenticated != true ){
            res.redirect('/?error=You need to login first!');
        }
        else{
            res.view('pages/searchProduct');
        }
        },
        

        buyProduct: async function (req, res) {
        //    console.log("hereeeeee");
        if(req.session.authenticated != true ){
            res.redirect('/?error=You need to login first!');
        }
        else{
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
                    url: "https://farmersmarketcompany.azurewebsites.net/api/getPrice/"+req.query.productID+
                    "/"+req.query.product,
                    headers: {},
                    data: {}
                })
                    .then(function (response) {
                       // console.log(response);
                        console.log("priceeee-->"+ response.data)
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
                if(req.query.error != undefined){
                    let error = req.query.error;
                    res.view('pages/buyProduct',{productID, product, prc, error});
                }
                else{
                res.view('pages/buyProduct',{productID, product, prc});
            }
            }      
        }
        },

        checkAvailability: async function (req, res) {
            let qty = req.body.txtquantity;
            let st = null;
            await axios({
                method: 'get',
                url: "https://farmersmarketcompany.azurewebsites.net/api/enoughStock/"+req.body.txtproductid+
                "/"+req.body.txtproduct+"/"+qty,
                headers: {},
                data: {}
            })
                .then(function (response) {
                   // console.log(response);
                    console.log("sts-->"+ response.data)
                    st = response;
                })
                .catch(function (error) {
                    return res.json({ status: 'unsuccessful' });
            });
            let status = st.data["status"];
            if(status === "yes"){
                res.redirect("/selectDelivery?productID="+req.body.txtproductid+
                "&product="+req.body.txtproduct+"&qty="+qty);
            }
            else{
                res.redirect("/buyProduct?productID="+req.body.txtproductid+
                "&product="+req.body.txtproduct+"&error= Not sufficient Quantity");
            }
        },
        
        selectDelivery: async function (req, res) {
            if(req.session.authenticated != true ){
                res.redirect('/?error=You need to login first!');
            }
            else{
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
                           res.view("pages/selectDelivery", {allData})
                           req.session.currentProductID = productID;
                           req.session.currentProduct = product;
                           req.session.currentQty = quantity;

                        })
                        .catch(function (error) {
                            return res.json({ status: 'unsuccessful' });
                    });

                }    
            }
        },

            checkDelivery: async function (req, res) {
            if(req.session.authenticated != true ){
                res.redirect('/?error=You need to login first!');
            }
            else{
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
                  req.query.ctype === "") 
                  {
                    res.redirect('/userHome');
                }
                else {
                    await axios({
                        method: 'get',
                        url: "http://deliveryagent-env.eba-vnnr4erm.us-east-1.elasticbeanstalk.com/api/company?cid="+req.query.cID 
                        +"&type="+req.query.ctype,
                        headers: {},
                        data: {}
                    })
                        .then(function (response) {
                            console.log("jlkkm"+response.data["Driver"]);
                            
                            if(parseInt(response.data["Driver"],10) > 0){
                                console.log("driver available")
                            }
                            else{
                                console.log("driver unavailable")
                                //res.redirect()
                            } 
                        })
                        .catch(function (error) {
                            console.log(error)
                            return res.json({ status: 'unsuccessful' });
                    });

                }
            }
            },
};