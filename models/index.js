const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const SolicitudRegistro = require('./SolicitudRegistro')(sequelize, DataTypes);
const Habitacion = require('./Habitacion')(sequelize, DataTypes);
const Especialidad = require('./Especialidad')(sequelize, DataTypes);
const TipoUsuario = require('./TipoUsuario')(sequelize, DataTypes);
const UsuarioEspecialidad = require('./UsuarioEspecialidad')(sequelize, DataTypes);

const db = {
  sequelize,
  Usuario,
  SolicitudRegistro,
  Habitacion,
  Especialidad,
  TipoUsuario,
  UsuarioEspecialidad
};

// Ejecutar asociaciones entre modelos
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
