const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase');

const db = mongoose.connection;

db.on ('connected', (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log('Database connected successfully');
})

module.exports = db;