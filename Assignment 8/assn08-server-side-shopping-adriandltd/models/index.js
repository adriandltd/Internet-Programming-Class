// this file makes the database connection, collects all the models
// and sets the associations
// other files can use this for database access by requiring it and
// assigning the exports

// assuming that this file (index.js) is in a subdirectory called models:
//  const models = require('./models');

// or (using deconstruction):
//  const { Critters, Coordinates } = require('./models');

'use strict';

// database connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'shopping.sqlite'
});

// import models
const Item = sequelize.import("./items.js");
const Review = sequelize.import("./reviews.js");

// associations
Item.hasMany(Review);
Review.belongsTo(Item);

module.exports = {
  Review, Item
};