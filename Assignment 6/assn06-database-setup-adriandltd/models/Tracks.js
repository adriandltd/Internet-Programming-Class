/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tracks', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Album',
        key: 'id'
      }
    },
    sequence_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    song_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    runtime: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Tracks',
    timestamps: false
  });
};
