const { DataTypes } = require("sequelize");
const db = require("../db");

const Help = db.define("Help", {
    error: {
        type: DataTypes.STRING,
        allowNull: false
    },   
    help: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: "Help",
    tableName: "helps",
    timestamps: false
});

Help.sync()

module.exports = Help;