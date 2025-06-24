'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    await queryInterface.sequelize.transaction(async (t) => {
      // 1) Add column (nullable)
      await queryInterface.addColumn(
        'users',
        'kycProvider',
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t }
      );

      // 2) Backfill existing verified users
      await queryInterface.bulkUpdate(
        'users',
        { kycProvider: 'Idology' },
        {
          isVerified: { [Op.ne]: null },
          isVerified: { [Op.ne]: '' }
        },
        { transaction: t }
      );

      // 3) (Optional) Add index for faster lookups
      await queryInterface.addIndex('users', ['kycProvider'], {
        name: 'idx_users_kycProvider',
        transaction: t
      });

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Tear down in reverse order
      await queryInterface.removeIndex('users', 'idx_users_kycProvider', { transaction: t });
      await queryInterface.removeColumn('users', 'kycProvider', { transaction: t });
    });
  }
};
