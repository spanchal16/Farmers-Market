module.exports.routes = {
  
  // Retrieve data
  "/": { view: "pages/homepage" },
  "GET /": "ProductsController.viewData",

  // "GET /products/viewDataByID": "ProductsController.viewDataByID",

  //Add a product
  "GET /addProduct": { view: "pages/products/addProduct" },
  "POST /addProduct": "ProductsController.addProduct",

  // Search a product by ID
  "GET /searchProduct": { view: "pages/products/searchProduct" },
  "POST /searchProduct": "ProductsController.searchProduct",


  // Update a product
  "GET /updateProduct/:productID": "ProductsController.editProduct",
  "POST /updateProduct": "ProductsController.updateProduct",

  // Delete a product
  "GET /deleteProduct": { view: "pages/products/deleteProduct" },
  "POST /deleteProduct": "ProductsController.deleteProduct",

  // API routes
  "GET /api/getallProducts": "ProductsController.getallProducts",
  "GET /api/buyProduct/:productID/:product/:amount": "ProductsController.buyProduct",

/*   "GET /api/getDiffJobs": "JobsController.getDiffJobs",
  "GET /api/getOneJobp/:jobName": "JobsController.getOneJobp",
  "POST /api/getOneJob": "JobsController.getOneJob",
  "POST /api/savePartOrders": "PartOrdersController.savePartOrders", */

  "GET /error": { view: "error" },
  "GET /notfound": { view: "notfound" },
};