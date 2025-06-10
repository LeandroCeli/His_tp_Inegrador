// models/Internacion.js

module.exports = (sequelize, DataTypes) => {
    const Internacion = sequelize.define('Internacion', {
      id_internacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_cama: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_ingreso: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      medico_solicitante: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_alta: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    }, {
      tableName: 'internaciones',
      timestamps: false,
    });
  
    
    Internacion.associate = function(models) {
      Internacion.belongsTo(models.Paciente, { 
        foreignKey: 'id_paciente',
        as: 'paciente'
      });
      Internacion.belongsTo(models.Cama, { 
        foreignKey: 'id_cama',
        as: 'cama' 
      });
      Internacion.belongsTo(models.Ingreso, { 
        foreignKey: 'id_ingreso',
        as: 'ingreso'
      });
    };
  
    return Internacion;
  };
  