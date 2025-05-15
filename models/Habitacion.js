const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Habitacion = sequelize.define('Habitacion', {
  numero: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('simple', 'doble', 'emergencia'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'mantenimiento'),
    allowNull: false
  }
}, {
  tableName: 'habitaciones',
  timestamps: false
});

module.exports = Habitacion;
