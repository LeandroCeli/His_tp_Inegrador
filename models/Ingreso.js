// models/Ingresos.js
module.exports = (sequelize, DataTypes) => {
    const Ingreso = sequelize.define('Ingreso', {
      id_ingreso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'ingresos',
      timestamps: false
    });
  
    Ingreso.associate = (models) => {
      Ingreso.hasMany(models.Internacion, {
        foreignKey: 'id_ingreso'
      });
    };
  
    return Ingreso;
  };
  