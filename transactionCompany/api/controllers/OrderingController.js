
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
                        console.log("priceeee-->"+response)
                        priceDetail = response;
                    })
                    .catch(function (error) {
                        return res.json({ status: 'unsuccessful' });
                });
                let price = null;
                for (let pr of priceDetail) {
                    price = pr
                }
                let prc = price["price"];
                res.view('pages/buyProduct',{productID, product, prc});
            }      
        }
        },
        
};