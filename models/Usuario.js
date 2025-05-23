// models/Usuario.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
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
      telefono: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipo_usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activo: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }
    }, {
      tableName: 'Usuarios',
      timestamps: false
    });
  
    Usuario.associate = (models) => {
      Usuario.belongsTo(models.TipoUsuario, {
        foreignKey: 'tipo_usuario_id',
        as: 'tipoUsuario'
      });
  
      Usuario.belongsToMany(models.Especialidad, {
        through: models.UsuarioEspecialidad,
        foreignKey: 'id_usuario',
        as: 'especialidades'
      });
    };
  
    return Usuario;
  };
  