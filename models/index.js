const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
//const Ingreso = require('./Ingreso');
//const Registro = require('./Registro');

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
const Ingreso= require('./Ingreso')(sequelize, DataTypes);
//const Registro= require('./Ingreso')(sequelize, DataTypes);
const Internacion = require('./Internacion')(sequelize, DataTypes);
const PacienteMutual = require('./PacienteMutual')(sequelize, DataTypes);

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
  Paciente, 
  Ingreso,
  Internacion,
  PacienteMutual
};


// Ejecutar asociaciones entre modelos
Object.values(db).forEach(model => {
  //console.log('Procesando modelo:', model);
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
