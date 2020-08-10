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
            var products = await axios.get("https://kei3ipx56h.execute-api.us-east-1.amazonaws.com/test/getallproducts");
            if (!products.data) {
                let code = "400";
                let message = "No data in database";
                showError(code, message, res);
            }
            if (products.data) {
                return res.view("pages/homepage", { products: products.data })
            }
        } catch (err) {
            return res.view("error", { err: err });
        }
    },
    // Search product by ID
    searchProduct: async function (req, res) {
        const productID = req.body.productID;

        try {
            var result = await axios.get("https://kei3ipx56h.execute-api.us-east-1.amazonaws.com/test/getoneproduct?productID=" + productID);
            if (result.data) {
                res.view("pages/products/searchProduct", { product: result.data });
            } else if (!result.data) {
                res.view("pages/products/searchProduct", { product: null });
            }
        } catch (err) {
            return res.view("error", { err: err });
        }
    },
    // Add a product
    addProduct: async function (req, res) {
        const productID = parseInt(req.body.productID);
        const productName = req.body.productName;
        const stock = parseInt(req.body.stock);
        const price = parseFloat(req.body.price);

        try {
            const sqlSelectOne = `SELECT * FROM products WHERE productID = $1`;
            await sails.sendNativeQuery(sqlSelectOne, [productID], async function (err, rawResult) {
                var length = rawResult.rows.length;
                if (length != 0) {
                    let code = "400";
                    let message = "Product ID: " + productID + " already exist, can't add a product";
                    showError(code, message, res);
                } else {
                    const sqlInsert = `INSERT INTO products VALUES ($1, $2, $3, $4)`;
                    await sails.sendNativeQuery(sqlInsert, [productID, productName, stock, price]);
                    res.redirect("/");
                }
            })
        } catch (err) {
            return res.view("error", { err: err });
        }
    },
    // Fetch existing product
    editProduct: async function (req, res) {
        const productID = req.params.productID;

        try {
            var result = await axios.get("https://kei3ipx56h.execute-api.us-east-1.amazonaws.com/test/getoneproduct?productID=" + productID);
            if (result.data) {
                return res.view("pages/products/updateProduct", { product: result.data });
            } else if (!result.data) {
                let code = "400";
                let message = "No data in database";
                showError(code, message, res);
            }
        } catch (err) {
            return res.view("error", { err: err });
        }
    },

    // Update product
    updateProduct: async function (req, res) {
        const productID = parseInt(req.body.productID);
        const productName = req.body.productName;
        const stock = parseInt(req.body.stock);
        const price = parseFloat(req.body.price);

        const data = { "productID": productID, "productName": productName, "stock": stock, "price": price };

        try {
            var result = await axios.post("https://kei3ipx56h.execute-api.us-east-1.amazonaws.com/test/updateproduct", data)
                .then(async function (res) {
                    return res;
                });
            if (result.data.status == "success") {
                res.redirect("/");
            } else if (result.data.status == "unsuccess") {
                showError(result.data.code, result.data.message, res);
            }
        } catch (err) {
            return res.view("error", { err: err });
        }
    },

    // DELETE DATA
    deleteProduct: async function (req, res) {
        const productID = parseInt(req.body.productID);
        const productName = req.body.productName;
        try {
            const sqlSelectOne = `SELECT * FROM products WHERE productID = $1 AND product = $2`;
            sails.sendNativeQuery(sqlSelectOne, [productID, productName], async function (err, rawResult) {
                var length = rawResult.rows.length;
                if (length != 0) {
                    const sqlDelete = `DELETE FROM products WHERE productID = $1 AND product = $2`;
                    await sails.sendNativeQuery(sqlDelete, [productID, productName]);
                    return res.redirect("/");
                } else {
                    let code = "400";
                    let message = "Product ID: " + productID + " do not exist, can't delete data";
                    showError(code, message, res);
                }
            })
        } catch (err) {
            return res.view("error", { err: err });
        }
    },

    // API
    getallProducts: async function (req, res) {

        await axios({
            method: 'get',
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/getallproducts",
            headers: {},
            data: {}
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
        });
    },

    getPrice: async function (req, res) {
        console.log(req.params);
        const productID = parseInt(req.params.productID);
        const product = req.params.product;

        await axios({
            method: 'post',
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/getprice",
            headers: {},
            data: {               
                productID: productID,
                product: product
            }
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
        });
    },

    enoughStock: async function (req, res) {
        console.log(req.params);
        const productID = parseInt(req.params.productID);
        const product = req.params.product;
        const amount = parseInt(req.params.amount);

        // 
        await axios({
            method: 'post',
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/enoughstock",
            headers: {},
            data: {
                productID: productID,
                product: product,
                amount: amount
            }
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
        });
    },
    
    buyProduct: async function (req, res) {
        console.log(req.params);
        const productID = parseInt(req.params.productID);
        const product = req.params.product;
        const amount = parseInt(req.params.amount);

        // 
        await axios({
            method: 'post',
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/buyproduct",
            headers: {},
            data: {
                productID: productID,
                product: product,
                amount: amount
            }
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
            });
    },

    addOrder: async function (req, res) {
        console.log(req.body);
        const orderId = req.body.orderId;
        const quantity = parseInt(req.body.quantity);
        const deliveryAgent = req.body.deliveryAgent;
        const dateTime = req.body.dateTime;

        // 
        await axios({
            method: 'post',
            url: "https://4ra1a2g84e.execute-api.us-east-1.amazonaws.com/production/addorder",
            headers: {},
            data: {
                orderId: orderId,
                quantity: quantity,
                deliveryAgent: deliveryAgent,
                dateTime: dateTime
            }
        })
            .then(function (response) {
                //console.log(response);
                return res.json(response["data"]);
            })
            .catch(function (error) {
                return res.json({ status: 'unsuccessful' });
            });
    },
}