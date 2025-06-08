// models/emergencia.js
module.exports = (sequelize, DataTypes) => {
    const Emergencia = sequelize.define('Emergencia', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      genero: {
        type: DataTypes.STRING(1), // M, F, X
        allowNull: false
      },
      tipo_emergencia: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      tableName: 'emergencias',
      timestamps: false
    });
  
    return Emergencia;
  };
  