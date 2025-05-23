module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define('Area', {
      id_area: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre_area: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: true // Puede ser opcional, ajusta según tus necesidades
      }
    }, {
      tableName: 'areas',
      timestamps: false
    });
  
    Area.associate = (models) => {
      Area.hasMany(models.Habitacion, {
        foreignKey: 'id_area',
        as: 'habitaciones'
      });
    };
  
    return Area;
  };