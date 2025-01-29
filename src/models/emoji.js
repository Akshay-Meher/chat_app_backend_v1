'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emoji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Emoji.hasMany(models.MessageReaction, { foreignKey: "emojiId", as: "reactions" });
    }
  }
  Emoji.init({
    unicode: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Emoji',
  });
  return Emoji;
};