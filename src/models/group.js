'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // A group can have many messages
      Group.hasMany(models.Message, { foreignKey: 'group_id' });
      // A group belongs to one admin user
      Group.belongsTo(models.User, { as: 'Admin', foreignKey: 'admin_id' });

      Group.belongsToMany(models.User, { through: 'GroupUsers', as: 'Users', foreignKey: 'group_id', });

    }
  }
  Group.init({
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_ids: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profile_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};