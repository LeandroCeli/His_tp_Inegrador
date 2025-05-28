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
      type: DataTypes.STRING,
      allowNull: false,
      field: 'estado_habitacion'  // <- corregir aquí el nombre de la columna
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
  };
  return Habitacion;
};
