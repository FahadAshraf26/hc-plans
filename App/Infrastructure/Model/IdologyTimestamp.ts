import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class IdologyTimestamp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `IdologyTimestampModel` is replaced with `this`, and
      // `UserModel` is updated to its v6 class name.

      // Defines the relationship from the perspective of the other model
      models.User.hasMany(this, {
        foreignKey: "userId",
        as: "idologyTimestamps",
      });

      // Defines the relationship from this model's perspective
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  // Initialize the model with its attributes and options
  IdologyTimestamp.init(
    {
      // --- Attributes Definition ---
      idologyTimestampId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idologyIdNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idologyScanUrl: {
        type: DataTypes.STRING,
      },
      idologyScanUrlExpirationTime: {
        type: DataTypes.DATE,
      },
      isResultMatched: {
        type: DataTypes.BOOLEAN,
      },
      badActorFlagged: {
        type: DataTypes.BOOLEAN,
      },
      ncResponse: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "IdologyTimestamp",
      tableName: "idologyTimestamps", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return IdologyTimestamp;
};
