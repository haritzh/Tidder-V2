'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

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

    static async authenticate(email, password) {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;

      const validPassword = bcrypt.compareSync(password, user.password);
      return validPassword ? user : null;
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Username is required' },
        notNull: { msg: 'Username is required' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email is already used' },
      validate: {
        notEmpty: { msg: 'Email is required' },
        notNull: { msg: 'Email is required' },
        isEmail: { msg: 'Email must be a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        notNull: { msg: 'Password is required' },
        len: {
          args: [8],
          msg: 'Password must be at least 8 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user, options) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
};
