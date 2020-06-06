const redirectHome = (req, res, next) => {
    if (!req.session.user)
        next();
    else
        res.redirect('/home');
};

module.exports = redirectHome;