// import the models
const { User, if_eq } = require('./models');

const express = require('express');
const path = require('path');
var Handlebars = require('express-handlebars');
const session = require('express-session');
const bcrypt = require('bcrypt');

app = express();
app.set('port', 3002);

// setup handlebars and the view engine for res.render calls
// (more standard to use an extension like 'hbs' rather than
//  'html', but the Universiry server doesn't like other extensions)


app.engine('html', Handlebars({
    extname: 'html',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
        if_eq: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
    }
}));
app.set('view engine', 'html');


// setup body parsing for form data
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up session (in-memory storage by default)
app.use(session({ secret: "This is a big long secret lama string." }));

// setup static file service
app.use(express.static(path.join(__dirname, 'static')));

//////////////////////////////////////////////////////////////////
// main entry point (index)
//
// case 1: they have an active session with a valid User in it
// outcome: render the home view with that User in context
//
// case 2: they don't have an active session with a valid User in it
// outcome: render the home view with a guest User in context
//  (using a User object with the assumption that you might have more
//   about a guest than just a username)

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user })
    }
    else {
        res.render('home', { user: new User({ username: "Filthy, Filthy Guest" }) })
    }
});

//////////////////////////////////////////////////////////////////
// the user wants to either login or sign up
//
// case 1: they already have an active session, with a valid User in it
//         no point in logging in or signing up unless they logout first
// outcome: redirect to the home route
//
// case 2: they don't have an active session with a valid userid in it
// outcome: render the login/register form

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        res.render("login_register");
    }
});

//////////////////////////////////////////////////////////////////
// attempt to login or register
//
// case 1: login: the username/password match what's in the db
// outcome: store the user in session and redirect to the home route
//
// case 2: login: the username/password don't match what's in the db
// outcome: render the login/register form with error messages and
//          a user object with persistent values (e.g. username) set
//
// case 3: register: the form values meet all criteria
// outcome: create a user, store in db, store in session, and redirect
//          to the home route
//
// case 4: register: the form values do not meet all criteria
// outcome: render the login/register form with error messages and
//          a user object with persistent values (e.g. username) set

app.post('/lr', (req, res) => {

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
                        res.render("home", { user: req.session.user });
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

                //redirect to home route
                res.render("home", { user: req.session.user });
                return;
            });
        });
    }


});

//////////////////////////////////////////////////////////////////
// a sample content page
//
// case 1: they have an active session, with a valid User in it
// outcome: render the content view with that User
//
// case 2: they don't have an active session with a valid User in it
// outcome: render the noaccess view

app.get('/content', (req, res) => {
    if (req.session.user) {
        User.findOne({
            where: { username: req.session.user.username.trim() }
        }).then(user => {
            if (user) {
                res.render("content", { user: req.session.user });
            }
            else {
                // User doesn't exists...
                res.render("noaccess");
            }
        });
    }
    else {
        res.render("noaccess");
    }
});

//////////////////////////////////////////////////////////////////
// logout
//
// remove the user from session and redirect to the home route
//

app.get('/logout', (req, res) => {
    // remove user from session
    delete req.session.user;
    res.redirect('/login');
});

var server = app.listen(app.get('port'), function () {
    console.log("Server started...")
});
