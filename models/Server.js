const { DataTypes } = require("sequelize");
const db = require("../db");

const Server = db.define("Server", {
    serverId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: "Server",
    tableName: "servers",
    timestamps: false
});

Server.sync()

module.exports = Server;