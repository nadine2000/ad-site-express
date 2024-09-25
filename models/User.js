'use strict';

const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
   class User extends Model { }

    User.init({
        login: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,},

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
