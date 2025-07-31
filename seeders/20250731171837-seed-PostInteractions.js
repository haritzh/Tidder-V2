'use strict';
const fs = require('fs/promises');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = await fs.readFile('./data/postInteractions.json', 'utf-8');
    const items = JSON.parse(data).map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert('PostInteractions', items);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PostInteractions', null, {});
  }
};
