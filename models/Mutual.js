module.exports = (sequelize, DataTypes) => {
    const Mutual = sequelize.define('Mutual', {
      id_mutual: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_mutual: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'mutuales',
      timestamps: false
    });
  
    Mutual.associate = models => {
      Mutual.belongsToMany(models.Paciente, {
        through: models.PacienteMutual,
        foreignKey: 'id_mutual',
        otherKey: 'id_paciente'
      });
    };
  
    return Mutual;
  };
  