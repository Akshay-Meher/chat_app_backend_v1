'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      // A reaction belongs to one message
      MessageReaction.belongsTo(models.Message, { foreignKey: 'message_id', as: "message" });
      // A reaction belongs to one user
      MessageReaction.belongsTo(models.User, { foreignKey: 'user_id', as: "user" });
      // MessageReaction.belongsTo(models.User, { foreignKey: "user_id",  });
      // MessageReaction.belongsTo(models.Message, { foreignKey: "message_id", });
      MessageReaction.belongsTo(models.Emoji, { foreignKey: "emojiId", as: "emoji" });

    }
  }
  MessageReaction.init({
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emojiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'MessageReaction',
  });
  return MessageReaction;
};