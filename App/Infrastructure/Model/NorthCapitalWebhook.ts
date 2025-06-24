export default (sequelize, DataTypes) => {
  const NorthCapitalWebhookModel = sequelize.define('northCapitalWebhook', {
    webhookId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    webhookType: DataTypes.STRING,
    status: DataTypes.STRING,
    payload: DataTypes.JSON,
  });

  return NorthCapitalWebhookModel;
};
