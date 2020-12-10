// import the models
const { Item, Review } = require('./models');

const express = require('express');
const path = require('path');
var hbs = require('express-handlebars');

app = express();
app.set('port', 3002);

// setup handlebars and the view engine for res.render calls
// (more standard to use an extension like 'hbs' rather than
//  'html', but the Universiry server doesn't like other extensions)
app.engine('html', hbs({
	extname: 'html',
	defaultView: 'default',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'html');

// setup static file service
app.use(express.static(path.join(__dirname, '/static')));

// /items route to render the mocked up items.html page as a handlebars view.
// view route to show all people
app.get('/items', function (req, res, next) {
	Item.findAll().then(item => {
		res.render("item", { item: item });
	});
});

// view route to show a specific item
app.get('/items/:id', function (req, res, next) {
	Item.findByPk(req.params.id, {
		include: [{ model: Review }]
	}).then(item => {
		Review.findAll().then(review => {
			var reviewFiltered = [];
			review.forEach(element => {
				if (element.dataValues.itemId == req.params.id) {
					reviewFiltered.push(element);
				}
			});
			res.render("item_view", { item: item, review: reviewFiltered});
		});
	});
});

app.post('sortitemsbyprice/',function (req, res, next) {
	
});

app.post('sortitemsbyname/',function (req, res, next) {
	
});

var server = app.listen(app.get('port'), function() {
	console.log("Server started...")
});