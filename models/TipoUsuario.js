// models/TipoUsuario.js
module.exports = (sequelize, DataTypes) => {
    const TipoUsuario = sequelize.define('TipoUsuario', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_tipo: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'Tipo_Usuarios',
      timestamps: false
    });
  
    TipoUsuario.associate = (models) => {
      TipoUsuario.hasMany(models.Usuario, {
        foreignKey: 'tipo_usuario_id',
        as: 'usuarios'
      });
    };
  
    return TipoUsuario;
  };
  