const Sequelize = require("sequelize");
const { sequelize } = require('../config/db');


module.exports = (sequelize, DataTypes) => {
	const Transaction = sequelize.define('Transaction', {
	  // model definition here
	  id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	  },
	  amount: {
		type: DataTypes.DECIMAL(10, 2),
		allowNull: false,
	  },
	  type: {
		type: DataTypes.ENUM('0', '1'), // 0- income, 1- expense
		allowNull: false,
	  },
	  notes: {
		type: DataTypes.TEXT,
		allowNull: true,
	  },
	  date: {
		type: DataTypes.DATE,
		allowNull: false,
	  },
	  userId: {
		type: DataTypes.INTEGER,
		references: {
		  model: 'Users',
		  key: 'id',
		},
	  },
	  categoryId: {
		type: DataTypes.INTEGER,
		references: {
			model: 'Categories',
			key: 'id',
		  },
	  },
	},{
    paranoid: true
	});

	Transaction.associate = (models) => {
        Transaction.belongsTo(models.Category, { foreignKey: 'categoryId' });
		models.User.hasMany(Transaction, { foreignKey: 'userId' });
		Transaction.belongsTo(models.User, { foreignKey: 'userId' });
	}
	
	return Transaction;
  };
