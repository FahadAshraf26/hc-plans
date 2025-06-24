export default (sequelize, DataTypes) => {
  const TagModel = sequelize.define(
    'tag',
    {
      tagId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tagCategoryId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'tagCategories',
          key: 'tagCategoryId',
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  TagModel.associate = (models) => {
    TagModel.belongsTo(models.TagCategoryModel, {
      foreignKey: 'tagCategoryId',
      as: 'category',
    });
  };

  return TagModel;
};
