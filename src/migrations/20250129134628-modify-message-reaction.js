'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MessageReactions', 'reaction');  // Remove the 'reaction' column
    await queryInterface.addColumn('MessageReactions', 'emojiId', {    // Add 'emojiId' column
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MessageReactions', 'emojiId');  // Rollback 'emojiId'
    await queryInterface.addColumn('MessageReactions', 'reaction', {    // Re-add 'reaction' column
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
