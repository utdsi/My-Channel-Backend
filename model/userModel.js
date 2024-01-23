
const { sequelize } = require("../config/db")

const { DataTypes, DATE } = require("sequelize")

const UserModel = sequelize.define("users", {

    User_Id: {

        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    user_name: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    created_at: {

        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_at: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    profile_status: {

        type: DataTypes.ENUM("0", "1", "2"),
        defaultValue: "1"
    }

})


module.exports = { UserModel }