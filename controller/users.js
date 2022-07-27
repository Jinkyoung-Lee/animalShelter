const User = require('../models/user');

// Register user route ================================================
// (Form rendering)
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};
// (Cretae user)
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, passwordConfirm } = req.body;
        if (password === passwordConfirm) {
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash('success', "Welcome to AniShelter");
                res.redirect('/shelters');
            });
        } else {
            req.flash('error', "Password not matching");
            res.redirect('/register');
        };
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

// Login route ========================================================
// (Form rendering)
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

// (Login)
module.exports.login = (req, res) => {
    req.flash('success', "Welcome back!");
    const redirectUrl = req.session.returnTo || '/shelters';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// Logout route =======================================================
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err) };
        req.flash('success', 'Logged you out! Good bye!');
        res.redirect('/shelters');
    });
};