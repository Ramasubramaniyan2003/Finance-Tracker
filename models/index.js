const { sequelize } = require('../config/db');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// Dynamically import all model files
fs
  .readdirSync(__dirname) // Read all files in the models folder
  .filter(file => {
    // Filter out non-JS files and the index.js file itself
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import each model file and add to the db object
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// If any model has associations, initialize them
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize instance and the db object containing all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync()  // This syncs all the models with the database
  .then(() => {
    console.log('Tables created!');
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });


module.exports = db;
