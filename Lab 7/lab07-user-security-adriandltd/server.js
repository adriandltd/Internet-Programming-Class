const { User } = require('./models');

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
var hbs = require('express-handlebars');
const Sequelize = require('sequelize');

app = express();
app.set('port', 3002);

// setup body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up session (in-memory storage by default)
app.use(session({ secret: "mysupersecret" }));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(express.static(path.join(__dirname, 'static')))
// setup handlebars and the view engine for res.render calls
// (more standard to use an extension like 'hbs' rather than
//  'html', but the Universiry server doesn't like other extensions)
app.set('view engine', 'html');
app.engine('html', hbs({
    extname: 'html',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

// setup static file service
app.use(express.static(path.join(__dirname, 'static')));


app.get("/index", (req, res) => {
    res.render("login_register");
});

app.post("/lr", (req, res) => {

    //register new user
    // if statement for register button pressed
    if (req.body.reg_btn != null) {
        //get the form data
        var _username = req.body.username;
        var _password = req.body.pw;

        //check for errors
        var errors = [];

        //blank username
        if (_username.trim().length == 0) {
            errors.push({ msg: "Usernames cannot be blank" });
        }

        //short password
        if (_password.trim().length < 4) {
            errors.push({ msg: "Password is too short" });
        }

        //check for duplicate
        User.findOne({
            where: { username: _username }
        }).then((user) => {
            if (user) {
                // User already exists...
                errors.push({ msg: "Username already exists" });
            }
            //if error, back to LR page
            if (errors.length > 0) {
                res.render("login_register", {
                    errors: errors,
                    propogate_username: _username.trim()
                });
                return;
            }

            ////otherwise, save new User
            //turn password into hash
            bcrypt.hash(_password, 10, (err, hash) => {
                //create new user in db
                User.create({
                    username: _username,
                    password_hash: hash,
                    admin: 0
                });

                //save user to session
                req.session.user = user;

                //redirectt to home route
                res.render("home", {user: req.session.user});
                return;
            });
        });
    }


    //login button pressed
    if (req.body.login_btn != null) {
        //get the form data
        var _username = req.body.username;
        var _password = req.body.pw;

        //check for errors
        var errors = [];

        if (_username.trim().length == 0) {
            errors.push({ msg: 'Username is empty' })
        }
        //short password
        if (_password.trim().length == 0) {
            errors.push({ msg: "Password is empty" });
        }

        //the compare method takes the salt from the stored hash instead of generating
        //a new one, so the resulting hash will match
        //compare user password in database

        User.findOne({
            where: { username: _username.trim() }
        }).then(user => {
            if (user) {
                //checks password
                bcrypt.compare(_password, user.password_hash, (err, match) => {
                    if (match) {
                        req.session.user = user;
                        //redirectt to home route
                        res.render("home", {user: req.session.user});
                        return;
                    } else {
                        errors.push({ msg: 'Invalid Credentials' });
                        res.render("login_register", {
                            errors: errors,
                            propogate_username: _username.trim()
                        });
                        return;
                    }
                });
            }
            else {
                // User doesn't exists...
                errors.push({ msg: "Username doesn't exists" });
            }
            //if error, back to lr page
            if (errors.length > 0) {
                res.render("login_register", {
                    errors: errors,
                    propagate_username: _username.trim()
                });
                return;
            }
        });
    }
});



var server = app.listen(app.get('port'), function () {
    console.log("Server started...")
});