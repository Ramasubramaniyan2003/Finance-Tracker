const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Category extends Model { }
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('0', '1'), // 0 -INCOME 1-EXPENSE
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Category',
    timestamps: true,
  }, {
    classMethods: {
      associate: function (models) {
        Category.belongsTo(models.User, { foreignKey: 'userId' });
      }
    },
    paranoid: true
  }
  );
  return Category;
};
