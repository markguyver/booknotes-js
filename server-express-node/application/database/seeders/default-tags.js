'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('tags', [{
    id: 1,
    name: 'Non-Fiction',
  },{
    id: 2,
    name: 'Fiction',
  },{
    id: 3,
    name: 'Essay',
  },{
    id: 4,
    name: 'Treatise',
  },{
    id: 5,
    name: 'White Paper',
  },{
    id: 4,
    name: 'Book',
  }]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('tags', null, {}),
};