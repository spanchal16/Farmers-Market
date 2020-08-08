const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const orderDetails = sequelize.define(
  "orderDetails",
  {
    O_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
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
