const mongoose = require('mongoose');

const multer = require('multer');

const imageuploads = '/uploads';

const path = require('path');

const todoschema = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    isbn : {
        type: String,
        required: true
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imageuploads));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

todoschema.statics.uploads = multer({ storage: storage }).single('image');

const Todo = mongoose.model('Todo', todoschema);

module.exports = Todo;