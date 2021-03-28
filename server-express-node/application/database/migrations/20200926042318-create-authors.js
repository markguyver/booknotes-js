'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authors', {
      id: {
          primaryKey: true,
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
      },
      first_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: 'uniqueFullName',
      },
      middle_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: 'uniqueFullName',
      },
      last_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: 'uniqueFullName',
      },
      parent_author_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: 'authors',
            key: 'id'
          }
      },
      deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
    });
    await queryInterface.addIndex('authors', {
      name: 'unique_full_name_index',
      unique: true,
      fields: [{
          name: 'last_name',
          order: 'ASC',
      }, {
          name: 'first_name',
          order: 'ASC',
      }, {
          name: 'middle_name',
          order: 'ASC',
      }],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authors');
  }
};