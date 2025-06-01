// models/Registros.js
module.exports = (sequelize, DataTypes) => {
    const Registro = sequelize.define('Registro', {
      id_registro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fechaIngreso: {
        type: DataTypes.DATE,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_tipo_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'registros',
      timestamps: false
    });
  
    Registro.associate = (models) => {
      Registro.belongsTo(models.Paciente, {
        foreignKey: 'id_paciente'
      });
      Registro.belongsTo(models.Ingresos, {
        foreignKey: 'id_tipo_ingreso'
      });
    };
  
    return Registro;
  };
  