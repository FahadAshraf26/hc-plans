const { Sequelize } = require('sequelize');

const tableName = 'issuers';

const customQueries = ['alter table issuers add constraint UNIQUE (email);'];

const reverseQueries = [];

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all(
          customQueries.map((query) => queryInterface.sequelize.query(query)),
        );
      });
    });
  },
  down: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all(
          reverseQueries.map((query) => queryInterface.sequelize.query(query)),
        );
      });
    });
  },
};
