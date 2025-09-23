const express = require('express');

const port = 3000;

const app = express();

const db = require("./config/db")

const path = require('path')

const Todomodel = require('./models/todomodel')

app.use(express.urlencoded())

app.set('view engine', 'ejs')

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get("/", async (req, res) => {
    let alltask = await Todomodel.find();
    return res.render('showtodo', { alltaskdata: alltask });
});

app.get("/addtask", (req, res) => {
    return res.render('todo');
});

app.post("/addtask", Todomodel.uploads, async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
        req.body.image = '/images/' + req.file.filename;
    }
    await Todomodel.create(req.body);
    return res.redirect("/showtask");
});

app.get("/showtask", async (req, res) => {
    let alltask = await Todomodel.find();
    return res.render('showtodo', { alltaskdata: alltask });
});

app.get("/task/:id", async (req, res) => {
    const task = await Todomodel.findById(req.params.id);
    console.log(task);
    res.render("blog", {
        task: task
    });
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`server is start on port:${port}`);
})