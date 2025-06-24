export default (sequelize, DataTypes) => {
  const PromotionTextModel = sequelize.define(
    'promotionTexts',
    {
      promotionTextId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      configuration: {
        type: DataTypes.JSON,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return PromotionTextModel;
}; 