'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interaction extends Model {
    static associate(models) {
      Interaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Interaction.belongsToMany(models.Post, {
        through: models.PostInteraction,
        foreignKey: 'interactionId',
        otherKey: 'postId',
        as: 'posts'
      });
    }
  }
  Interaction.init({
    type: DataTypes.STRING, // 'comment', 'upvote', 'downvote'
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Interaction',
  });
  return Interaction;
};
