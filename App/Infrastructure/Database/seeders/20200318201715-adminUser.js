'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('adminUsers', [
      {
        adminUserId: '4e7da960-5ef8-11ea-af90-1f8d60771164',
        name: 'Admin',
        email: 'admin@carbonteq.com',
        password: '$2b$08$kABtUoWk0ZaBDUSDB/tzyuBETxn4oOQPqgYfh7lpJTsEyDdmbyRXu',
        createdAt: '2020-03-18 19:18:25',
        updatedAt: '2020-03-18 19:18:25',
        adminRoleId: '6a77a30c-cf73-4da7-accd-396b9798f2fa',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('adminUsers', null, {});
  },
};
