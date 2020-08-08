const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const companyDetails = sequelize.define(
  "companyDetails",
  {
    C_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    C_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Driver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = companyDetails;
