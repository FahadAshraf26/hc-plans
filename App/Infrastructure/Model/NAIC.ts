export default (sequelize, DataTypes) => {
  const NaicModel = sequelize.define(
    'naic',
    {
      naicId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: DataTypes.STRING,
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    },
  );

  return NaicModel;
};
