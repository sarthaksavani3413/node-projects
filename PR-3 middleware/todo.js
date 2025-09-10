const express = require('express');

const port = 5000;

const app = express();

app.use(express.urlencoded());

let TodoList = [
    { id: 1, task: 'Buy milk', }
]

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('add')
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})