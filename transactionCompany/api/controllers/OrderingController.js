
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
            //URL TO BE CHANGEDDDDDDDDDDDD
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/getallproducts",
            headers: {},
            data: {}
        })
            .then(function (response) {
               // console.log(response);
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
    
};