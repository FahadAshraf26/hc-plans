export default (sequelize, DataTypes) => {
  const UsaEpayWebhookModel = sequelize.define(
    'usaEpayWebhook',
    {
      webhookId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      webhookType: DataTypes.STRING,
      status: DataTypes.STRING,
      payload: DataTypes.JSON,
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return UsaEpayWebhookModel;
};