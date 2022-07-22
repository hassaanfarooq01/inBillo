export default (Sequelize: any, DataTypes: any) => {
  const User = Sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  });
  return User;
};
