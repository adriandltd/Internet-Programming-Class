/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Album', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    artist_name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'Album',
    timestamps: false
  });
};
