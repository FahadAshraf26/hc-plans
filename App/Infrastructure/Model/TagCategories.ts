import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class
  class TagCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Define the association here
      // Note: `models.TagModel` is changed to `models.Tag` to match the v6 class naming convention
      this.hasMany(models.Tag, {
        foreignKey: "tagCategoryId",
        as: "tags",
      });
    }
  }

  // Initialize the model with its attributes and options
  TagCategory.init(
    {
      // Define attributes
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
      // Pass the Sequelize instance
      sequelize,
      // Set the model name
      modelName: "TagCategory",
      tableName: "tagCategories",
      timestamps: true,
      paranoid: true,
    }
  );

  return TagCategory;
};
