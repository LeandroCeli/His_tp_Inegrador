module.exports = (sequelize, DataTypes) => {
    const Cama = sequelize.define('Cama', {
      id_cama: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_habitacion: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      estado: {
        type: DataTypes.ENUM('ocupado', 'libre'),
        allowNull: false,
        defaultValue: 'libre'
      },
      higiene: {
        type: DataTypes.ENUM('limpia', 'sucia'),
        allowNull: false,
        defaultValue: 'limpia'
      }
    }, {
      tableName: 'camas',
      timestamps: false
    });
  
    Cama.associate = (models) => {
      Cama.belongsTo(models.Habitacion, {
        foreignKey: 'id_habitacion',
        as: 'habitacion'
      });
    };
  
    return Cama;
  };