import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "../Database/mysqlConnection";
import fs from "fs";
import path from "path";

interface Db {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: Db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};

// Load all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) && // Exclude the current file
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
    );
  })
  .forEach((file) => {
    // The model definition function is imported and executed
    const modelDefinition = require(path.join(__dirname, file)).default;

    // 2. Now, modelDefinition is the actual function, which you can execute.
    const model = modelDefinition(sequelize, DataTypes);
    console.log(model.name);
    db[model.name] = model;
    // console.log(db);
    model.sync();
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
