const express = require("express");
const port = 7001;
const app = express();
const path = require("path")
const db = require("./config/db")
const adminmodel = require("./models/adminmodel")
const blogmodel = require("./models/blogmodel")
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(express.urlencoded())
app.set("view engine", "ejs")
app.use("/", require("./routes/index"))
app.use(express.static(path.join(__dirname, 'assets')))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log("server is runnning on port", port);
})  