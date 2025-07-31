'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostInteraction extends Model {
    static associate(models) {
    }
  }
  PostInteraction.init({
    postId: DataTypes.INTEGER,
    interactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostInteraction',
  });
  return PostInteraction;
};
