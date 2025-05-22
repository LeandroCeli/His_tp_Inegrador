// models/Especialidad.js
module.exports = (sequelize, DataTypes) => {
    const Especialidad = sequelize.define('Especialidad', {
      id_especialidad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_especialidad: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING
      }
    }, {
      tableName: 'Especialidad',
      timestamps: false
    });
  
    Especialidad.associate = (models) => {
      Especialidad.belongsToMany(models.Usuario, {
        through: models.UsuarioEspecialidad,
        foreignKey: 'id_especialidad',
        as: 'usuarios'
      });
    };
  
    return Especialidad;
  };
  