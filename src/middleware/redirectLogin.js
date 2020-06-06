const User = require('../models/userModel');

const redirectLogin = async(req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            req.user = user;
            next();
        } catch (e) {
            res.redirect('/login');
        }
    }
};

module.exports = redirectLogin;