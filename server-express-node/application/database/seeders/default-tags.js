'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('tags', [{
    id: 1,
    tag: 'Non-Fiction',
  },{
    id: 2,
    tag: 'Fiction',
  },{
    id: 3,
    tag: 'Essay',
  },{
    id: 4,
    tag: 'Treatise',
  },{
    id: 5,
    tag: 'White Paper',
  },{
    id: 6,
    tag: 'Book',
  }]),

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('tags', null, {}),
};