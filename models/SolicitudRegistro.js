// models/SolicitudRegistro.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SolicitudRegistro', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rolDeseado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'solicitudes_registro',
    timestamps: false
  });
};
