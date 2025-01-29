'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Messages', 'file_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filename', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filetype', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filesize', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Messages', 'file_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filename', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filetype', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Messages', 'filesize', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  }
};
