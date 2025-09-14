const express = require('express');

const port = 8000;

const app = express();

const db = require("./config/db")

const path = require('path')

const Todomodel = require('./models/todomodel')

app.use(express.urlencoded())

app.set('view engine', 'ejs')

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    let todos = await Todomodel.find();
    res.render('showtodo', {
        'alltaskdata': todos
    });
})

app.get('/todo', (req, res) => {
    res.render('todo');
})

app.post('/addtask', Todomodel.uploads, async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
        req.body.image = '/uploads/' + req.file.filename;
    }
    req.body.isbn = Math.floor(Math.random() * 1000000000000);
    await Todomodel.create(req.body);
    return res.redirect('/showtask');
})

app.get('/showtask', async (req, res) => {
    let alltask = await Todomodel.find();
    return res.render('showtodo', { 'alltaskdata': alltask });
});

app.get('/task/:id', async (req, res) => {
    const task = await Todomodel.findById(req.params.id);
    console.log(task);
    res.render('viewbook', {
        task: task
    });
});

app.get('/delete/:id', async (req, res) => {
    await Todomodel.findByIdAndDelete(req.params.id);
    return res.redirect('/showtask');
});

app.get('/edit/:id', async (req, res) => {
    const task = await Todomodel.findById(req.params.id);
    res.render('edittodo', {
        task: task
    });
});

app.post('/update/:id', Todomodel.uploads, async (req, res) => {
    if (req.file) {
        req.body.image = '/uploads/' + req.file.filename;
    }
    await Todomodel.findByIdAndUpdate(req.params.id, req.body);
    return res.redirect('/showtask');
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`server is start on port:${port}`);
})