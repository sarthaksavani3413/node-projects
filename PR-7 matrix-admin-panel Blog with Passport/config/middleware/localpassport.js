const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Admin = require("../../models/adminmodel");

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, cb) => {
    let adminrecord = await Admin.findOne({ email: email});
    if(adminrecord) {
        const match = await bcrypt.compare(password, adminrecord.password);
        if(match) {
            return cb(null, adminrecord);
        } else {
            return cb(null, false);
        }
    } else {
        return cb(null, false);
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    let adminrecord = await Admin.findById(id);
    if(adminrecord) {
        cb(null, adminrecord);
    } else {
        cb(null, false);
    }
});

passport.checkadmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        return res.redirect("/");
    }
}

passport.setauthenticateuser = (req, res, next) => {
    if(req.user) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;