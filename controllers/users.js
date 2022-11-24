const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { cloudinary, storageUsers } = require('../cloudinary')
module.exports.renderRegister = (req, res) => { res.render('users/register'); }

module.exports.renderLogin = (req, res) => { res.render('users/login'); }

module.exports.renderUserUpdate = (req, res) => { res.render('users/update'); }

module.exports.renderProfile = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const usersReviews = await Review.find({author: user._id});
    const reviewsCountByUser = usersReviews.length;
    const usersCamps = await Campground.find({ author: userId });
    const campsCountByUser = usersCamps.length;
    res.render('users/profile', { usersCamps, usersReviews, user, reviewsCountByUser, campsCountByUser });
}


module.exports.userUpdate = async (req, res, next) => {
    const { email, newUsername, newPassword, repeatNewPassword, password, updateProfilePicture, removePicture } = req.body;
    const user = await User.findById(req.user._id);

    const authRes = await user.authenticate(password);

    if (!authRes.user) {
        req.logout(function (err) {
            if (err) return next(err);
            req.flash('error', 'Wrong username or/ and password. Please enter correct credentials.');
            res.redirect('/login');
        });
    } else {
        if (email) {
            user.email = email;
            req.flash('success', 'Email updated successfully.');
        }

        try {
            if (updateProfilePicture === 'on') {
                const { file } = req;
                if (file) {
                    if (user.image) {
                        await cloudinary.uploader.destroy(user.image.filename);
                    }
                    const uploadRes = await cloudinary.uploader.upload(file.path, { ...storageUsers });
                    user.image = {
                        url: uploadRes.secure_url,
                        filename: uploadRes.public_id
                    }
                    req.flash('success', 'Profile picture updated successfully.');
                } else if (removePicture === 'on' && !user.image) {
                    req.flash('error', 'You cannot delete the default user icon.');
                } else if (removePicture === 'on' && user.image) {
                    await cloudinary.uploader.destroy(user.image.filename);
                    user.image = undefined;
                    req.flash('success', 'Profile picture removed successfully.');
                }
            }
        } catch (err) {
            req.flash('error', 'Image cannot be uploaded at this moment. Please try again later.');
        }


        if (newPassword && repeatNewPassword && newPassword === repeatNewPassword) {
            await user.changePassword(password, newPassword);
            req.flash('success', 'Password updated successfylly.');
        }

        if (newUsername) {
            user.username = newUsername;
            await user.save();

            req.login(user, async function (err) {
                if (err) next();
                req.flash('success', 'Username updated successfully.');

                if (newPassword) {
                    req.flash('success', 'Password updated successfully.');
                }
                if (email) {
                    req.flash('success', 'Email updated successfully.');
                }
                if (updateProfilePicture === 'on') {
                    if (removePicture === 'on' && !user.image) {
                        req.flash('error', 'You cannot delete the default user icon.');
                    } else {
                        req.flash('success', 'Profile picture updated successfully.');
                    }
                }
                res.redirect('/userUpdate');
            });
        } else {
            await user.save();
            res.redirect('/userUpdate');
        }
    }
}

module.exports.register = async (req, res) => {
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
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//if passport 0.5.x is used, req.logout is synchronous function
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out.');
        res.redirect('/campgrounds');
    });
}
