const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const SolicitudRegistro = require('./SolicitudRegistro')(sequelize, DataTypes);
const Habitacion = require('./Habitacion')(sequelize, DataTypes);
const Especialidad = require('./Especialidad')(sequelize, DataTypes);
const TipoUsuario = require('./TipoUsuario')(sequelize, DataTypes);
const UsuarioEspecialidad = require('./UsuarioEspecialidad')(sequelize, DataTypes);
const area=require('./area')(sequelize, DataTypes);

const db = {
  sequelize,
  Usuario,
  SolicitudRegistro,
  Habitacion,
  Especialidad,
  TipoUsuario,
  UsuarioEspecialidad,
  area
};


// Ejecutar asociaciones entre modelos
Object.values(db).forEach(model => {
  //console.log('Procesando modelo:', model);
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
