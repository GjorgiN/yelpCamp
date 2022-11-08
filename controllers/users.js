const User = require('../models/user');
const { cloudinary, storageUsers } = require('../cloudinary')
module.exports.renderRegister = (req, res) => { res.render('users/register'); }

module.exports.renderLogin = (req, res) => { res.render('users/login'); }

module.exports.renderUserUpdate = (req, res) => { res.render('users/update'); }


module.exports.userUpdate = async (req, res) => {
    console.log('req.body: ', req.body);
    console.log('req.user:', req.user);
    console.log('req.file:', req.file);
    console.log('req.login:', req.login);
    const { email, username, newPassword, repeatNewPassword, currentPassword } = req.body;
    console.log(email, username, newPassword, repeatNewPassword, currentPassword);
    const user = await User.findById(req.user._id);
    console.log(user);
    let flashMessageSuccess = '';


    if (email) {
        user.email = email;
        flashMessageSuccess += 'Email updated successfully.'
    }

    if (username) {
        user.username = username;
        flashMessageSuccess += ' Username updated successfully.'
    }

    await user.save();

    if (newPassword && repeatNewPassword && currentPassword && newPassword === repeatNewPassword) {
        await user.changePassword(currentPassword, newPassword);
        flashMessageSuccess += ' Password updated successfully.'
    }

    // TODO: save file to cloudinary and file url and filename to db

    // const uploadRes = await cloudinary.uploader.upload(req.file.path, { ...storageUsers })
    // const userImageFilename = uploadRes.public_id;
    // const userImageUrl = uploadRes.secure_url;


    req.login(user, function (err) {
        if (err) return next();
        req.flash('success', flashMessageSuccess)
        res.redirect('/userUpdate');
    });
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
        req.flash('success', 'Successfully logged out. Bye!');
        res.redirect('/campgrounds');
    });
}
