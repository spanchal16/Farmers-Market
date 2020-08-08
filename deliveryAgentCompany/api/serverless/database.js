const { Sequelize } = require("sequelize"); // Sequelize is used as ORM

//Making connection to the database
module.exports = new Sequelize("deliveryagent", "companyy", "cloudproject", {
  host: "cloudinstance.cej3byrweji9.us-east-1.rds.amazonaws.com",
  dialect: "mysql",
});
