// models/UsuarioEspecialidad.js
module.exports = (sequelize, DataTypes) => {
  const UsuarioEspecialidad = sequelize.define('UsuarioEspecialidad', {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numeroMatricula: {  
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'usuarios_especialidad',
    timestamps: false
  });

  return UsuarioEspecialidad;
};
