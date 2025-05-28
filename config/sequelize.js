const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('his_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,  // esto imprime en consola las consultas
});

module.exports = sequelize;
