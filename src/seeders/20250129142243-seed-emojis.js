'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * 
    */

    const emojis = [
      { unicode: "😂", imageUrl: "https://example.com/laugh.png", description: "Laughing Face" },
      { unicode: "👍", imageUrl: "https://example.com/thumbsup.png", description: "Thumbs Up" },
      { unicode: "❤️", imageUrl: "https://example.com/heart.png", description: "Red Heart" },
      { unicode: "🔥", imageUrl: "https://example.com/fire.png", description: "Fire" },
      { unicode: "🥳", imageUrl: "https://example.com/party.png", description: "Party Face" },
    ];

    // Check for existing emojis to prevent duplicates
    const existingEmojis = await queryInterface.sequelize.query(
      'SELECT unicode FROM "Emojis";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingUnicode = existingEmojis.map(emoji => emoji.unicode);

    // Filter out emojis that are already in the table
    const newEmojis = emojis.filter(emoji => !existingUnicode.includes(emoji.unicode));

    // Add createdAt and updatedAt to each emoji object
    const emojisWithTimestamps = newEmojis.map(emoji => ({
      ...emoji,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert only the new emojis
    if (emojisWithTimestamps.length > 0) {
      await queryInterface.bulkInsert("Emojis", emojisWithTimestamps);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Emojis", null, {});
  }
};
