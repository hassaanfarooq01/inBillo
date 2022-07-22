export default (Sequelize: any, DataTypes: any) => {
  const Acccounts = Sequelize.define("accounts", {
    account_balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });

  return Acccounts;
};
