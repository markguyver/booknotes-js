'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('author_tags', {
      author_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'authors',
          key: 'id',
        },
      },
      tag_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
    });
    await queryInterface.createTable('book_tags', {
      book_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id',
        },
      },
      tag_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
    });
    await queryInterface.createTable('note_tags', {
      note_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'notes',
          key: 'id',
        },
      },
      tag_id: {
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('author_tags');
    await queryInterface.dropTable('book_tags');
    await queryInterface.dropTable('note_tags');
  }
};