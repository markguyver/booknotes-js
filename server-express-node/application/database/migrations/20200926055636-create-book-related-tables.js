'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('book_authors', {
      book_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      author_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'authors',
          key: 'id',
        },
      },
      contribution_type_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'contribution_types',
          key: 'id',
        },
      },
      order: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('book_authors');
  }
};