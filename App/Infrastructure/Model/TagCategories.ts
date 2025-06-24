export default (sequelize, DataTypes) => {
  const TagCategoriesModel = sequelize.define(
    'tagCategory',
    {
      tagCategoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  TagCategoriesModel.associate = (models) => {
    TagCategoriesModel.hasMany(models.TagModel, {
      foreignKey: 'tagCategoryId',
      as: 'tags',
    });
  };

  return TagCategoriesModel;
};
