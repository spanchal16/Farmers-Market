module.exports.routes = {
  
  // Retrieve products
  "/": { view: "pages/homepage" },
  "GET /": "ProductsController.viewData",

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

  // Retrieve orders
  "/viewOrders": { view: "pages/orders/viewOrders" },
  "GET /viewOrders": "OrdersController.viewData",

  // API routes
  "GET /api/getallProducts": "ProductsController.getallProducts",
  "GET /api/getPrice/:productID/:product": "ProductsController.getPrice",
  "GET /api/enoughStock/:productID/:product/:amount": "ProductsController.enoughStock",
  "POST /api/buyProduct/:productID/:product/:amount": "ProductsController.buyProduct",
  "POST /api/addOrder": "ProductsController.addOrder",


  "GET /error": { view: "error" },
  "GET /notfound": { view: "notfound" },
};