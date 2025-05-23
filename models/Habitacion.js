module.exports = (sequelize, DataTypes) => {
  const Habitacion = sequelize.define('Habitacion', {
    numero_habitacion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado_habitacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_area:  {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {
    tableName: 'habitaciones',
    timestamps: false
  });

  Habitacion.associate = (models) => {
    Habitacion.belongsTo(models.area, {
      foreignKey: 'id_area',
      as: 'area'
    });
  };
  return Habitacion;
};
