const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const SolicitudRegistro = require('./SolicitudRegistro')(sequelize, DataTypes);
const Habitacion = require('./Habitacion')(sequelize, DataTypes);
const Especialidad = require('./Especialidad')(sequelize, DataTypes);
const TipoUsuario = require('./TipoUsuario')(sequelize, DataTypes);
const UsuarioEspecialidad = require('./UsuarioEspecialidad')(sequelize, DataTypes);
const Mutual= require('./Mutual')(sequelize, DataTypes);
const Paciente= require('./Paciente')(sequelize, DataTypes);
const Ingreso= require('./Ingreso')(sequelize, DataTypes);
const Internacion = require('./Internacion')(sequelize, DataTypes);
const PacienteMutual = require('./PacienteMutual')(sequelize, DataTypes);
const Area = require('./areaModels')(sequelize, DataTypes);
const Cama = require('./camaModels')(sequelize, DataTypes);


const db = {
  sequelize,
  Usuario,
  SolicitudRegistro,
  Habitacion,
  Especialidad,
  TipoUsuario,
  UsuarioEspecialidad,
  Mutual,
  Paciente, 
  Ingreso,
  Internacion,
  PacienteMutual,
  Cama,
  Area
};


// Ejecutar asociaciones entre modelos
Object.values(db).forEach(model => {
  //console.log('Procesando modelo:', model);
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
