const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

const router = express.Router({ mergeParams: true });

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, function (err) {
            if (err) return next();
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

// if passport 0.5.x is used keepSessionInfo option not needed 
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, failureMessage: true, keepSessionInfo: true }),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    });

//if passport 0.5.x is used, req.logout is synchronous function
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out. Bye!');
        res.redirect('/campgrounds');
    });
});


module.exports = router;
