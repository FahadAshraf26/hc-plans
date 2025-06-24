export default (sequelize, DataTypes) => {
  const IssueModel = sequelize.define(
    'issue',
    {
      issueId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      issueType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resourceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issueInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );

  IssueModel.associate = (models) => {
    IssueModel.belongsTo(models.UserModel, {
      foreignKey: 'reportedBy',
    });

    models.UserModel.hasMany(IssueModel, {
      foreignKey: 'reportedBy',
      as: 'userIssues',
    });
  };

  return IssueModel;
};
