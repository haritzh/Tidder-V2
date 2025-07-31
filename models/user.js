'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: 'userId',
        as: 'profile'
      });
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });
      User.hasMany(models.Interaction, {
        foreignKey: 'userId',
        as: 'interactions'
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
