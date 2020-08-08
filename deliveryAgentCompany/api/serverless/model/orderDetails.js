const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const orderDetails = sequelize.define(
  "orderDetails",
  {
    O_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    C_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = orderDetails;
