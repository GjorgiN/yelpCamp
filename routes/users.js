const express = require('express');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');

const router = express.Router({ mergeParams: true });

const multer = require('multer');
// const { storageUsers, cloudinary } = require('../cloudinary');
const upload = multer({
    storage: multer.diskStorage({})
});



router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/userUpdate')
    .get(isLoggedIn, users.renderUserUpdate)
    .post(isLoggedIn, upload.single('userImage'), catchAsync(users.userUpdate));

router.route('/user/:id')
    .get(isLoggedIn, users.renderProfile)

router.route('/login')
    .get(users.renderLogin)
    // if passport 0.5.x is used keepSessionInfo option not needed 
    .post(
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
            failureMessage: true,
            keepSessionInfo: true
        }),
        users.login
    );

router.get('/logout', users.logout);

module.exports = router;
