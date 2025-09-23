const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todolist");

const db = mongoose.connection;

db.once('open', (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log("db is connected");
})
module.exports = db; 