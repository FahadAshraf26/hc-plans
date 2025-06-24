import { Model, DataTypes, Sequelize } from "sequelize";
// import { User } from './User'; // Placeholder for import

// Interface for type-safety on instance attributes
interface UserEventAttributes {
  userEventId: string;
  type: string;
  parentId?: string | null; // Self-referencing foreign key
  userId?: string; // Foreign key
}

// Extend Sequelize's Model class and implement our attributes interface
export class UserEvent
  extends Model<UserEventAttributes>
  implements UserEventAttributes
{
  // --- TYPE DEFINITIONS ---
  public userEventId!: string;
  public type!: string;

  // Foreign keys
  public parentId!: string | null;
  public userId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `UserEventModel` is replaced with `this`, and
    // `UserModel` is updated to its v6 class name.

    // Self-referencing association for parent-child events
    this.belongsTo(this, {
      foreignKey: "parentId",
      as: "parentEvent",
    });
    // It's good practice to also define the inverse hasMany relationship
    this.hasMany(this, {
      foreignKey: "parentId",
      as: "childEvents",
    });

    // Association with User
    models.User.hasMany(this, {
      foreignKey: "userId",
      as: "userEvents",
    });

    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  UserEvent.init(
    {
      // --- RUNTIME DEFINITIONS ---
      userEventId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // The 'parentId' and 'userId' columns will be automatically added by the associations.
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "UserEvent",
      tableName: "userEvents", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return UserEvent;
};
