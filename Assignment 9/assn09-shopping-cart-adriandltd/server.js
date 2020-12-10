// import the models
const { Item, Review } = require('./models');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var hbs = require('express-handlebars');
const session = require('express-session');
//const cookieParser = require('cookie-parser');

app = express();
app.set('port', 3002);

// add middleware to expose and manipulate cookie data in
//  the request/response
//app.use(cookieParser());

// setup body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up session (in-memory storage by default)
app.use(session({ secret: "mysupersecret" }));

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
app.get('/items', function (req, res) {
	Item.findAll().then(item => {
		res.render("item", { item: item });
	});
});

// view route to show a specific item
app.get('/items/:id', function (req, res) {
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
			res.render("item_view", { item: item, review: reviewFiltered });
		});
	});
});

//renders shopping cart but checks if its empty first
app.get('/shopping_cart', function (req, res) {
	if (!req.session.cart || req.session.cart.items.length == 0) {
		res.render("shopping_cart_empty", { title: "Empty Shopping Cart"});
		return;
	}
	res.render("shopping_cart", { title: "Shopping Cart", item: req.session.cart.items, cart: req.session.cart });
});

//route to delete specific item
app.get('/delete-from-cart/:id', function (req, res) {
	var itemId = req.params.id;
		for (var i = 0; i < req.session.cart.items.length;i++) {
			if(req.session.cart.items[i].id == itemId){
				req.session.cart.items.splice(i, 1);
			}
		}
		req.session.cart.totalCost = 0;
		for (var i = 0; i < req.session.cart.items.length;i++) {
			req.session.cart.totalCost += req.session.cart.items[i].cost;
		}
		//console.log(req.session.cart.items);
		res.redirect('/shopping_cart');
});

//route to add specific item
app.get("/add-to-cart/:id", (req, res) => {
	var itemId = req.params.id;

	//adds new item to shopping cart
	Item.findByPk(itemId, {
	}).then(item => {
		var cart = new Cart(req.session.cart ? req.session.cart : { items: [] });
		cart.addItem(item);
		req.session.cart = cart;
		for (var i = 0; i < cart.items.length;i++) {
			cart.totalCost += cart.items[i].cost;
		}
		//console.log(req.session.cart);
		res.redirect('/shopping_cart');
	});
});

//function used to manage cart updating
function Cart(oldCart) {
	this.items = oldCart.items || [];
	this.totalCost = 0;
	
	this.addItem = function (item) {
		var storedItem = this.item;

		//for new item that isnt listed in shopping cart already
		if (!storedItem) {
			storedItem = this.item = { id : item.id, name : item.name, qty : 1, cost : item.cost };
		}

		//checks for duplicate items to add up quatity attribute and compute new cost
		for (var i = 0; i < this.items.length;i++) {
			if(this.items[i].name == storedItem.name){
				storedItem = this.item = { id : item.id, name : item.name, qty : this.items[i].qty, cost : item.cost };
				storedItem.qty++;
				storedItem.cost = storedItem.cost * storedItem.qty;
				//delte old item object from items array
				this.items.splice(i, 1);
			}
		}
		//push new item to items array in session.cart
		this.items.push(storedItem);
	};
}

var server = app.listen(app.get('port'), function () {
	console.log("Server started...")
});