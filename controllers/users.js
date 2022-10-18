const User = require('../models/user');

module.exports.renderRegister = (req, res) => { res.render('users/register'); }

module.exports.renderLogin = (req, res) => { res.render('users/login'); }

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