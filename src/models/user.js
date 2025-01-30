'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Message, { as: 'SentMessages', foreignKey: 'sender_id' });

      // A user can receive many messages
      User.hasMany(models.Message, { as: 'ReceivedMessages', foreignKey: 'receiver_id' });

      // A user can create many groups
      User.hasMany(models.Group, { as: 'CreatedGroups', foreignKey: 'admin_id' });

      // A user can have many message reactions
      User.hasMany(models.MessageReaction, { foreignKey: 'user_id', as: 'reactions' });
      User.belongsToMany(models.Group, { through: 'GroupUsers', as: 'Groups', foreignKey: 'user_id' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};