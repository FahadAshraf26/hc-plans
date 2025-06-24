import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface AdminRoleAttributes {
  adminRoleId: string;
  name: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class AdminRole
  extends Model<AdminRoleAttributes>
  implements AdminRoleAttributes
{
  // --- TYPE DEFINITIONS (The Update) ---
  // These properties are explicitly declared for TypeScript's benefit.
  public adminRoleId!: string;
  public name!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // This model has no associations, so the static 'associate' method is not needed.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  AdminRole.init(
    {
      // --- RUNTIME DEFINITIONS ---
      adminRoleId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "AdminRole",
      tableName: "adminRoles",
      timestamps: true,
      // paranoid: false is the default
    }
  );

  return AdminRole;
};
