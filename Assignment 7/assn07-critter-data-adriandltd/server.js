// import the models
const { Coordinate, Critter } = require('./models');
// use express to serve up data through a set of HTTP URLs
const express = require('express')
const path = require('path')

app = express()
app.set('port', 3002)

// static route for files that aren't processed on the server-side (html, css, client-side js, images, etc)
app.use(express.static(path.join(__dirname, 'static')))



//route to retrieve all critter data (id and name)
app.get('/retrievecritters', (req, res) => {
	Critter.findAll().then(critter => {
		res.json(critter);
	});
});

//route to retrieve all coordinate data
app.get('/retrievecoords/:id', (req, res) => {
	Coordinate.findAll({where: {
		critterId: req.params.id
	  }}).then(coords => {
		res.json(coords);
	});
});


// start up the server
var server = app.listen(app.get('port'), function () {
	console.log("Server started...")
})