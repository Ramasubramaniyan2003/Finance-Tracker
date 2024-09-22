const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    financialGoals: {
      type: DataTypes.JSONB, // Store user's financial goals in a JSONB format
      defaultValue: {},
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
  });
  return User;
};
