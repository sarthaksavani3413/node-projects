const express = require("express");
const port = 9001;
const app = express();
const path = require("path")
const db = require("./config/db")
const adminmodel = require("./models/adminmodel")
const blogmodel = require("./models/blogmodel")
const session = require("express-session")
const flash = require("connect-flash")
const flashmsg = require("./config/middleware/flashmessage")
const passportpage = require("passport");
const passport = require("./config/middleware/localpassport")
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(express.urlencoded())
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'assets')))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(session({
    name: "testing",
    secret: "admin-panel",
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.setauthenticateuser);
app.use(flash());
app.use(flashmsg.setflashmessage);
app.use("/", require("./routes/index"))
app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log("server is runnning on port", port);
})  