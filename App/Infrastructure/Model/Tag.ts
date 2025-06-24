import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsTo(models.TagCategory, {
        foreignKey: "tagCategoryId",
        as: "category",
      });
    }
  }

  Tag.init(
    {
      // Model attributes are defined here
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
          model: "tagCategories", // table name
          key: "tagCategoryId",
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "Tag", // We need to choose the model name
      tableName: "tags", // optional: explicitly define the table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Tag;
};
