'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('contribution_types', [{
    id: 1,
    name: 'Author',
  },{
    id: 2,
    name: 'Editor',
  },{
    id: 3,
    name: 'Translator',
  }]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('contribution_types', null, {}),
};