export default (sequelize, DataTypes) => {
  const DwollaWebhookModel = sequelize.define(
    'dwollaWebhook',
    {
      dwollaWebhookId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );
  return DwollaWebhookModel;
};
