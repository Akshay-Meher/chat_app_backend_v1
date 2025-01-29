const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {

      Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'sender_id' });

      // A message can belong to one receiver
      Message.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiver_id' });

      // A message can belong to one group
      Message.belongsTo(models.Group, { foreignKey: 'group_id' });

      // A message can have many reactions
      Message.hasMany(models.MessageReaction, { foreignKey: 'message_id', as: "reactions" });

      // A message can reference a parent message (reply)
      Message.belongsTo(models.Message, { as: 'ParentMessage', foreignKey: 'reply_to_message_id' });

      // A message can have multiple replies (child messages)
      Message.hasMany(models.Message, { as: 'Replies', foreignKey: 'reply_to_message_id' });

      Message.belongsTo(Message, { as: 'replyToMessage', foreignKey: 'reply_to_message_id' });
    }
  }

  Message.init(
    {
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reply_to_message_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filetype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filesize: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Message'
    }
  );

  return Message;
};
