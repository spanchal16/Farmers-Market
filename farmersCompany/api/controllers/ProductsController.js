const axios = require('axios');

function showError(code, message, res) {
    let error = {
        code: code,
        message: message
    }
    res.view("pages/error", { error: error });
}

function showErrorPart(partId, res) {
    let code = "400";
    let message = "partId: " + partId + " does not exist.";
    showError(code, message, res);
}

module.exports = {
    // GET ALL
    viewData: function (req, res) {
        const sqlSelectAll = `SELECT product, price FROM products`
        sails.sendNativeQuery(sqlSelectAll, function (err, rawResult) {
            console.log(rawResult.rows);
            return res.json(rawResult.rows);
/*             let jobs = [];
            for (let [key, value] of Object.entries(rawResult.rows)) {
                let job = {};
                for (let [k, v] of Object.entries(value)) {
                    job[k] = v;
                }
                jobs.push(job);
            }
            if (!jobs) {
                res.send("Cannot find anything to show!")
            }
            if (jobs) {
                res.view("pages/homepage", { jobs: jobs })
            } */
        }); 
    },
    // GET ONE BY ID
    viewDataByID: async function (req, res) {
        const jobName = req.param('jobName');
        const partId = parseInt(req.param('partId'));
        const sqlSelectOne = `SELECT * FROM jobs WHERE jobName = $1 AND partId = $2`;

        await sails.sendNativeQuery(sqlSelectOne, [jobName, partId], function (err, rawResult) {
            var length = rawResult.rows.length;
            if (length == 0) {
                let code = "400";
                let message = "jobName: " + jobName + " with " + "partId: " + partId + " do not exist, can't retrieve data.";
                showError(code, message, res);
            } else {
                var job = {};
                for (let [key, value] of Object.entries(rawResult.rows)) {
                    for (let [k, v] of Object.entries(value)) {
                        job[k] = v;
                    }
                }
                res.view("pages/jobs/viewDataByID", { job: job });
            }
        });
    },

    getallProducts: async function (req, res) {

        const sql = `SELECT productID, product FROM products`;
        try {
            var data = await sails.sendNativeQuery(sql);
        } catch (err) {
            switch (err.name) {
                case 'UsageError': return res.json({ status: 'unsuccess' });
            }
        }

        sails.log(data.rows);
        return res.json(data.rows);
    },
    
    buyProduct: async function (req, res) {
        console.log(req.params);
        const productID = parseInt(req.params.productID);
        const product = req.params.product;
        const amount = parseInt(req.params.amount);

        const sql = `SELECT stock FROM products WHERE productID = $1 AND product = $2`;
        await sails.sendNativeQuery(sql, [productID, product], async function (err, rawResult) {
            var length = rawResult.rows.length;
            
            if (length != 0) {
                stock = rawResult.rows[0].stock
                console.log(amount)
                console.log(stock)
                if(amount <= stock){
                    newStock= stock - amount;
                    const sqlUpdate = `UPDATE products SET stock= $1 WHERE productID = $2 AND product = $3`;
                    try {
                        await sails.sendNativeQuery(sqlUpdate, [newStock, productID, product]);
                        sails.log("stock updated");
                        return res.json({status: 'success'});

                    } catch (err) {
                        sails.log("not able to add update stock in products");
                        return res.json({status: 'unsuccessful'});

                    }

                }
                else{
                    return res.json({status: 'not enough stock'})
                }
            
            } else {
                return res.json({status: 'unsuccessful'})

            }
        });
    }
}