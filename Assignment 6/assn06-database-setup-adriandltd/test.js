// import the library as a class
const Sequelize = require('sequelize');

// instantiate the library for use, connecting to the sqlite database file
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'music.sqlite'
});
// authenticate to see if the modules are properly installed
sequelize.authenticate()
.then(() => {
  console.log("Good");
})
.catch(err => {
  console.log("Bad: " + err);
});
const Tracks = sequelize.import("./models/Tracks.js");

Tracks.findAll().then(track => {
  console.log("All the tracks: ", JSON.stringify(track, null, 4));
});