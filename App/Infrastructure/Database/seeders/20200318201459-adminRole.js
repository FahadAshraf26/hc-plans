'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('adminRoles', [
      {
        adminRoleId: '6a77a30c-cf73-4da7-accd-396b9798f2fa',
        name: 'Super Admin',
        createdAt: '2020-03-18 18:59:46',
        updatedAt: '2020-03-18 18:59:46',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('adminRoles', null, {});
  },
};
