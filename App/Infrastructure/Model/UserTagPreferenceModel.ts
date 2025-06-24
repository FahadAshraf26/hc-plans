import { Model, DataTypes, Sequelize } from "sequelize";
// import { User } from './User'; // Placeholder for import
// import { Tag } from './Tag'; // Placeholder for import

// Interface for type-safety on instance attributes
interface UserTagPreferenceAttributes {
  userTagPreferenceId: string;
  userId: string;
  tagId: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class UserTagPreference
  extends Model<UserTagPreferenceAttributes>
  implements UserTagPreferenceAttributes
{
  // --- TYPE DEFINITIONS ---
  public userTagPreferenceId!: string;
  public userId!: string;
  public tagId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `UserTagPreferenceModel` is replaced with `this`, and
    // associated model names are updated to their v6 class names.
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    this.belongsTo(models.Tag, {
      foreignKey: "tagId",
      as: "tag",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  UserTagPreference.init(
    {
      // --- RUNTIME DEFINITIONS ---
      userTagPreferenceId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "userId",
        },
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "tags",
          key: "tagId",
        },
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "UserTagPreference",
      tableName: "userTagPreferences",
      timestamps: true,
      paranoid: true,
      // --- INDEXES ---
      // The indexes array is moved into the options object here.
      // The syntax remains the same.
      indexes: [
        {
          unique: true,
          fields: ["userId", "tagId"], // Prevent duplicate user-tag combinations
        },
        {
          fields: ["userId"], // Index for faster user lookups
        },
        {
          fields: ["tagId"], // Index for faster tag lookups
        },
      ],
    }
  );

  return UserTagPreference;
};
