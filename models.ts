import users from "./models/users";
import accounts from "./models/accounts";
import transactions from "./models/transactions";

const Sequelize = require("sequelize");

const sequelize: typeof Sequelize = new Sequelize(
  "inBillo-database",
  "user",
  "pass",
  {
    dialect: "sqlite",
    host: "./dev.sqlite",
  }
);

const models: any = {
  User: users(sequelize, Sequelize.DataTypes),
  Accounts: accounts(sequelize, Sequelize.DataTypes),
  Transactions: transactions(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
