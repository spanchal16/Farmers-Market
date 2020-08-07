module.exports.routes = {
  
  "/": { view: "pages/homepage" },

  // Retrieve data
  "GET /products/viewData": "ProductsController.viewData",
  "GET /jobs/viewDataByID": "ProductsController.viewDataByID",

  // API routes
  "GET /api/getallProducts": "ProductsController.getallProducts",
  "GET /api/buyProduct/:productID/:product/:amount": "ProductsController.buyProduct",

/*   "GET /api/getDiffJobs": "JobsController.getDiffJobs",
  "GET /api/getOneJobp/:jobName": "JobsController.getOneJobp",
  "POST /api/getOneJob": "JobsController.getOneJob",
  "POST /api/savePartOrders": "PartOrdersController.savePartOrders", */

};