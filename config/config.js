require('dotenv').config(); // To load the .env file

module.exports = {
  // development: {
  //   username: 'postgres',
  //   password: 'postgres',
  //   database: 'template1',
  //   host: 'localhost',
  //   dialect: 'postgres',
  // },
  production: {
    use_env_variable: "DATABASE_URL", // Use environment variable in production
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Ensure SSL is used for production
        rejectUnauthorized: false
      }
    }
  }
};
