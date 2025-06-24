import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class CampaignQA extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Defines the self-referencing relationship for parent-child hierarchies (e.g., questions and replies).
      // `CampaignQAModel` is replaced with `this` to refer to the current class.
      this.hasMany(this, {
        foreignKey: {
          name: "parentId",
          allowNull: true,
        },
        as: "children",
        // 'useJunctionTable: false' from v5 is the default behavior for hasMany and not needed in v6.
      });

      // You would also typically define the inverse relationship
      this.belongsTo(this, {
        foreignKey: "parentId",
        as: "parent",
      });
    }
  }

  // Initialize the model with its attributes and options
  CampaignQA.init(
    {
      // --- Attributes Definition ---
      campaignQAId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // The 'parentId' will be automatically added by the self-referencing association
    },
    {
      // --- Model Options ---

      // The Sequelize connection instance
      sequelize,

      // The name of the model
      modelName: "CampaignQA",

      // Explicitly set the table name.
      tableName: "campaignQAs",

      // Enable timestamps (createdAt, updatedAt) and paranoid (deletedAt)
      timestamps: true,
      paranoid: true,
    }
  );

  return CampaignQA;
};
