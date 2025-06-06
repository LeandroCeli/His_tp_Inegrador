module.exports = (sequelize, DataTypes) => {
  const Habitacion = sequelize.define('Habitacion', {
    id_habitacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'estado_habitacion' 
    },
    id_area:  {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, 
  {
    tableName: 'habitaciones',
    freezeTableName: true,
    timestamps: false
  });

  Habitacion.associate = (models) => {
    Habitacion.belongsTo(models.Area, {
      foreignKey: 'id_area',
      as: 'Area'
    });
    Habitacion.hasMany(models.Cama, {
      foreignKey: 'id_habitacion',
      as: 'Camas' // alias usado luego en el include
    });
    
  };
  return Habitacion;
};
