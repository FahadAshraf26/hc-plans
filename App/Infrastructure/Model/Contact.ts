export default (sequelize, DataTypes) => {
  const ContactModel = sequelize.define(
    'contact',
    {
      contactId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  ContactModel.associate = (models) => {
    models.IssuerModel.hasMany(ContactModel, {
      foreignKey: 'issuerId',
    });

    ContactModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });
  };

  return ContactModel;
};
