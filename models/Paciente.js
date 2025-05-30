module.exports = (sequelize, DataTypes) => {
    const Paciente = sequelize.define('Paciente', {
      id_paciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      telefono: {
        type: DataTypes.STRING
      },
      telefono_emergencia: {
        type: DataTypes.STRING
      },
      domicilio: {
        type: DataTypes.STRING
      },
      nacionalidad: {
        type: DataTypes.STRING
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY
      },
      genero: {
        type: DataTypes.STRING
      },
      grupo_sanguineo: {
        type: DataTypes.STRING
      },
      id_mutual: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Mutuales',
          key: 'id_mutual'
        }
      }
    }, {
      tableName: 'pacientes',
      timestamps: false
    });
  
    Paciente.associate = function(models) {
      Paciente.belongsTo(models.Mutual, {
        foreignKey: 'id_mutual',
        as: 'mutual'
      });
    };
  
    return Paciente;
  };
  