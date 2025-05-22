// models/UsuarioEspecialidad.js
module.exports = (sequelize, DataTypes) => {
    const UsuarioEspecialidad = sequelize.define('UsuarioEspecialidad', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuarios: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_especialidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'usuarios_especialidad',
      timestamps: false
    });
  
    return UsuarioEspecialidad;
  };
  