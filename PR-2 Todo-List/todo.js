const express = require('express');

const port = 2000;

const app = express();

app.use(express.urlencoded());

app.set('view engine', 'ejs');

let TodoList = [
    { id: 1, name: 'Jay', email: 'jay@example.com', password: '1234' },
    { id: 2, name: 'Ajay', email: 'ajay@example.com', password: 'abcd' },
    { id: 3, name: 'Vijay', email: 'vijay@example.com', password: 'xyz' }      
]

app.get('/', (req, res) => {
    res.render('view', {
        todolist: TodoList
    });
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/addtodo', (req, res) => {
    const { name, email, password } = req.body
    const obj = {
        id: TodoList.length + 1,
        name, email, password
    }
    TodoList.push(obj);
    console.log("Todo added");
    res.redirect('/');
})

app.get('/deleteuser', (req, res) => {
    const id = req.query.id;
    TodoList = TodoList.filter(item => item.id != id);
    console.log("User deleted");
    res.redirect('/');
});

app.get('/edituser', (req, res) => {
    const id = req.query.id;
    const user = TodoList.find(item => item.id == id);
    res.render('edit', {
        user: user
    })
});

app.post('/updateuser', (req, res) => {
    const id = req.body.id;
    const { name, email, password } = req.body;
    const user = TodoList.find(item => item.id == id);
    user.name = name;
    user.email = email;
    user.password = password;
    console.log("User updated");
    res.redirect('/');
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})