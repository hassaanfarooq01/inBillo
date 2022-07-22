export default (Sequelize: any, DataTypes: any) => {
  const Transactions = Sequelize.define("transaction", {
    senderAccount: {
      type: DataTypes.INTEGER,
    },
    receiverAccount: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  });
  return Transactions;
};
