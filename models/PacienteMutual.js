module.exports = (sequelize, DataTypes) => {
    const PacienteMutual = sequelize.define('PacienteMutual', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_mutual: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      numeroAfiliado: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'pacienteMutuals', 
      timestamps: false 
    });
  
    PacienteMutual.associate = models => {
      PacienteMutual.belongsTo(models.Paciente, { foreignKey: 'id_paciente' });
      PacienteMutual.belongsTo(models.Mutual, { foreignKey: 'id_mutual' });
    };
  
    return PacienteMutual;
  };
  