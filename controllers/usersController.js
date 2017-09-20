const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://localhost:27017/userDatabase');
let User = require('../models/userDataModel')
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;


exports.index = function(req, res, next) {
        User.getAllUsers(req, res, renderIndex)
    
}


exports.employed = function(req, res, next) {
    console.log("employed function called")
    User.getEmployedUsers(req, res, renderIndex)

}

exports.unemployed = function(req, res, next) {
    User.getUnemployedUsers(req, res, renderIndex)

}

function renderIndex(req, res, data) {
    console.log("render index--")
    // console.log(data)
    if(req.user) {
        let newData = data.map((user) => {
            if(user.username === req.user.username) {
                user.editButton = true
                return user
            } else {
                user.editButton = false
                return user
            }
        })

        res.render("index", {data: newData, loggedIn: true, currentUser: req.user.username})
    } else {
        res.render("index", {data: data, loggedIn: false, currentUser: false})
    }
}

exports.show = function(req, res, next) {
    console.log(req.params.username)
    User.getUserByUsername(req.params.username, (err, data) => {
        console.log("--------------------")
        console.log(data)
        let profileData = {}
        profileData = {"profileData": data}
        res.render("profile", profileData)
    })
}

exports.logout = function(req, res, next) {
    console.log(req.params.username)
    req.session.destroy();
    res.redirect('/');

}

exports.edit = function(req, res, next) {
    console.log(req.params.username)
    if(req.user && (req.user.username === req.params.username)) {
        User.getUserByUsername(req.params.username, (err, data) => {
            console.log("--------------------")
            console.log(data)
            let profileData = {}
            profileData = {"profileData": data}
            res.render("edit", profileData)
        })
    } else {
        res.redirect('/');
    }
    
}

exports.update = function(req, res, next) {
        console.log("got to update")
        let avatar = req.body.avatar;
    
        let name = req.body.name;
        let job = req.body.job;
        let company = req.body.company;
        let city = req.body.city;
        let country = req.body.country;
        let email = req.body.email;
        let phone = req.body.phone;
        let university = req.body.university;
        let username = req.body.username;
        let skill1 = req.body.skill1;
        let skill2 = req.body.skill2;
        let skill3 = req.body.skill3;
    
        let errors = req.validationErrors();
        if(errors){
            res.render('edit',{
                errors:errors
            });
        } else {
            var userData = {
                name: name,
                job: job,
                company: company,
                city: city,
                country: country,
                email:email,
                phone: phone,
                university: university,
                username: username,
                skills: [
                    skill1,
                    skill2,
                    skill3
                ]
            };
    
            User.updateUser(userData, function(err, user){
                if(err) throw err;
                console.log(user);
            });
    
            req.flash('success_msg', 'user updated');
    
            res.redirect('/');
        }
}

exports.new = function(req, res, next) {
    res.render("register")
}

exports.create = function(req, res, next) {
    let avatar = req.body.avatar;

    let name = req.body.name;
    let job = req.body.job;
    let company = req.body.company;
    let city = req.body.city;
    let country = req.body.country;
    let email = req.body.email;
    let phone = req.body.phone;
    let university = req.body.university;
	let username = req.body.username;
	let password = req.body.password;
    let password2 = req.body.password2;
    let skill1 = req.body.skill1;
    let skill2 = req.body.skill2;
    let skill3 = req.body.skill3;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
            name: name,
            job: job,
            company: company,
            city: city,
            country: country,
            email:email,
            phone: phone,
            university: university,
			username: username,
            password: password,
            skills: [
                skill1,
                skill2,
                skill3
            ]
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/login');
	}
}

exports.loginForm = function(req, res, next) {
    res.render("login")
}


passport.use(new LocalStrategy(
  function(username, password, done) {
   console.log("local strategy")
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  })
})


exports.login = function(req, res, next) {
    console.log("got here")
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true})(req, res, next),
    function(req, res) {
        console.log("got past auth")
        res.redirect('/');
    }
}

exports.delete = function(req, res, next) {
    res.render("index")
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		
		res.redirect('/login');
	}
}