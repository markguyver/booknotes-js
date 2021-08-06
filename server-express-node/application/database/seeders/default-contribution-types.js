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
  },{
    id: 4,
    name: 'Foreword',
  },{
    id: 5,
    name: 'Introduction',
  }]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('contribution_types', null, {}),
};