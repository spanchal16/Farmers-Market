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
};
