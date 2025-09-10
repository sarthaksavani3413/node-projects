const express = require('express');

const port = 1000;

const db = require('./config/db');

const app = express();

app.set('view engine', 'ejs');

const path = require('path');

app.use('/public', express.static(path.join(__dirname, 'public')));

const checkage = (req, res, next) => {
    let age = req.query.age;
    if (age >= 18) {
        next();
    } else {
        return res.redirect('/');
    }
}

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about',checkage, (req, res) => {
    res.render('about');
})

app.get('/product',checkage, (req, res) => {
    res.render('product');
})

app.get('/blog',checkage, (req, res) => {
    res.render('blog');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})