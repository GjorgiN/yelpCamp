const express = require('express');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

const users = require('../controllers/users');

const router = express.Router({ mergeParams: true });

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

// if passport 0.5.x is used keepSessionInfo option not needed 
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, failureMessage: true, keepSessionInfo: true }),
    users.login
    );

router.get('/logout', users.logout);

module.exports = router;
