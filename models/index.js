// models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


// Importar y definir modelos
const Usuario = require('./Usuario')(sequelize, DataTypes);
const SolicitudRegistro = require('./SolicitudRegistro')(sequelize, DataTypes);
const Habitacion = require('./Habitacion')(sequelize, DataTypes);

// Exportar todos los modelos y la conexión
module.exports = {
  sequelize,
  Usuario,
  SolicitudRegistro,
  Habitacion
};
