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
      allowNull: false,
      references: {
        model: 'habitaciones', 
        key: 'id_habitacion'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    higiene: {
      type: DataTypes.ENUM('limpia', 'sucia'),
      allowNull: false,
      defaultValue: 'limpia'
    },
    genero_ocupante: {
      type: DataTypes.ENUM('masculino', 'femenino'),
      allowNull: true,
      defaultValue: null
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
