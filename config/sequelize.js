const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('his_internacion', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Cambiar a true para ver las consultas SQL
});

module.exports = sequelize;
