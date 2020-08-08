const DeliveryController = require("../api/controllers/DeliveryController");
const OrderPlacedController = require("../api/controllers/OrderPlacedController");

module.exports.routes = {
  //list all companies
  "/": { view: "pages/homepage" },
  "GET /": DeliveryController.list,

  //Add new delivery company
  "GET /addcompany": { view: "pages/addcompany" },
  "POST /addcompany": DeliveryController.create,

  //Edit delivery company (UI)
  "GET /editcompany": DeliveryController.editcompany,
  "POST /editcompany": DeliveryController.update,

  //Search particular company (UI)
  "GET /searchcompany": { view: "pages/searchcompany" },
  "POST /searchcompany": DeliveryController.search,

  //List all orderedParts using (UI)
  "/ordersplaced": { view: "pages/ordersplaced" },
  "GET /ordersplaced": OrderPlacedController.list,

  //Get all companies using (API)
  "GET /api/allcompanies": DeliveryController.allcompanies,

  //Get a company using (API)
  "GET /api/company": DeliveryController.company,

  //Update driver using (API)
  "POST /api/updatedriver": DeliveryController.updatedriver,

  //Add new order (API)
  "POST /api/addorder": OrderPlacedController.addorder,

  "GET /error": { view: "error" },
  "GET /notfound": { view: "pages/notfound" },
};
