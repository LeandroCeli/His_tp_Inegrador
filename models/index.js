const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const SolicitudRegistro = require('./SolicitudRegistro')(sequelize, DataTypes);
const Habitacion = require('./Habitacion')(sequelize, DataTypes);
const Especialidad = require('./Especialidad')(sequelize, DataTypes);
const TipoUsuario = require('./TipoUsuario')(sequelize, DataTypes);
const UsuarioEspecialidad = require('./UsuarioEspecialidad')(sequelize, DataTypes);
const Area=require('./Area')(sequelize, DataTypes);
const Cama=require('./Cama')(sequelize, DataTypes);
const Mutual= require('./Mutual')(sequelize, DataTypes);
const Paciente= require('./Paciente')(sequelize, DataTypes);

const db = {
  sequelize,
  Usuario,
  SolicitudRegistro,
  Habitacion,
  Especialidad,
  TipoUsuario,
  UsuarioEspecialidad,
  Area,
  Cama,
  Mutual,
  Paciente
};


// Ejecutar asociaciones entre modelos
Object.values(db).forEach(model => {
  //console.log('Procesando modelo:', model);
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
