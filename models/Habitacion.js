module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Habitacion', {
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'habitaciones',
    timestamps: false
  });
};
