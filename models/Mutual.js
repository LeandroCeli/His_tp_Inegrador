module.exports = (sequelize, DataTypes) => {
    const Mutual = sequelize.define('Mutual', {
      id_mutual: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'mutuales',
      timestamps: false
    });
  
    Mutual.associate = function(models) {
      Mutual.hasMany(models.Paciente, {
        foreignKey: 'id_mutual',
        as: 'pacientes'
      });
    };
  
    return Mutual;
  };
  