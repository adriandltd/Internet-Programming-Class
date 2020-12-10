/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('critters', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'critters',
    timestamps: false
  });
};
