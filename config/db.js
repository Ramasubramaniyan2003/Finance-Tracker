const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('template1', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

// Function to test the connection
const connection = async () => {
    try {
        await sequelize.authenticate();  // Authenticate the connection
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);  // Handle any connection errors
    }
};

module.exports = { sequelize, connection, Op };