const mongoose = require('mongoose');

const multer = require('multer');

const imageuploads = '/uploads/blogimages';

const path = require('path');

const todoschema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
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