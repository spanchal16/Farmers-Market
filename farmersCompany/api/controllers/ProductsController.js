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
    viewData: function (req, res) {
        const sqlSelectAll = `SELECT product, price, productID FROM products`;
        try {
            sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
                if (!rawResult.rows) {
                    let code = "400";
                    let message = "No data in database";
                    showError(code, message, res);
                }
                if (rawResult.rows) {
                    return res.view("pages/homepage", { products: rawResult.rows })
                }
            })
        } catch (err) {
            return res.view("error", { err: err });
        }
    },
    // Search product by ID
    searchProduct: async function (req, res) {
        const productID = parseInt(req.body.productID);

        try {
            const sqlSelectOne = `SELECT * FROM products WHERE productID = $1`;
            await sails.sendNativeQuery(sqlSelectOne, [productID], function (err, rawResult) {
                var length = rawResult.rows.length;
                if (length == 0) {
                    // let code = "400";
                    // let message = "Product ID: " + productID + partId + " do not exist, can't retrieve data.";
                    // showError(code, message, res);
                    res.view("pages/products/searchProduct", { product: null });
                } else {
                    var product = {};
                    for (let [key, value] of Object.entries(rawResult.rows)) {
                        for (let [k, v] of Object.entries(value)) {
                            product[k] = v;
                        }
                    }
                    res.view("pages/products/searchProduct", { product: product });
                }
            })
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
        const sqlSelectOne = `SELECT * FROM products WHERE productID = $1`;

        try {
            await sails.sendNativeQuery(sqlSelectOne, [productID], function (err, rawResult) {
                console.log(rawResult.rows);
                var length = rawResult.rows.length;
                if (length == 0) {
                    let code = "400";
                    let message = "Product ID: " + productID + " do not exist, can't retrieve data.";
                    showError(code, message, res);
                } else {
                    var product = {};
                    for (let [key, value] of Object.entries(rawResult.rows)) {
                        for (let [k, v] of Object.entries(value)) {
                            product[k] = v;
                        }
                    }
                    return res.view("pages/products/updateProduct", { product: product });
                }
            })
        } catch (err) {
            return res.view("error", { err: err });
        }
    },

    // Update product
    updateProduct: function (req, res) {
        const productID = parseInt(req.body.productID);
        const productName = req.body.productName;
        const stock = parseInt(req.body.stock);
        const price = parseFloat(req.body.price);

        const sqlSelectOne = `SELECT * FROM products WHERE productID = $1`;

        try {
            sails.sendNativeQuery(sqlSelectOne, [productID], async function (err, rawResult) {
                var length = rawResult.rows.length;
                if (length != 0) {
                    const sqlUpdate = `UPDATE products SET product = $1, stock = $2, price = $3 WHERE productID = $4`;
                    await sails.sendNativeQuery(sqlUpdate, [productName, stock, price, productID]);
                    return res.redirect("/");

                } else {
                    let code = "400";
                    let message = "Product ID: " + productID + " do not exist, can't update data";
                    showError(code, message, res);
                }
            })
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
}