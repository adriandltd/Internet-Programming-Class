/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coordinates', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    critterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'critters',
        key: 'id'
      }
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'coordinates',
    timestamps: false
  });
};
