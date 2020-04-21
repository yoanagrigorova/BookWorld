var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const mongoURI = "mongodb://yoana.grigorova:magic123@ds135089.mlab.com:35089/bookworld";
const bodyParser = require('body-parser');
const sha1 = require('sha1')
var cors = require('cors')
const users = require('./users')
const User = users.User;
const comment = require('./comment')
const Comments = comment.Comments;
const async = require('async')

mongoose.connect(
    mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
);

const schemaBooks = {
    title: { type: mongoose.SchemaTypes.String, required: true },
    description: { type: mongoose.SchemaTypes.String, required: true },
    image: { type: mongoose.SchemaTypes.String, required: true },
    authors: { type: [mongoose.SchemaTypes.String], required: true },
    categories: { type: [mongoose.SchemaTypes.String], required: true },
    comments: [mongoose.SchemaTypes.Object],
    rating: { type: mongoose.SchemaTypes.Number }
};
const collectionBooks = "books";
const bookSchema = mongoose.Schema(schemaBooks);
const Books = mongoose.model(collectionBooks, bookSchema);

router.get('/all', function (req, res) {
    Books.find().then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });

})

router.post('/favorites', function (req, res) {
    User.findById(req.body.userID).then(user => {
        Books.find({ _id: { $in: user.favorites } }).then(books => {
            res.send(books);
        })
    })
})

router.post('/wish', function (req, res) {
    User.findById(req.body.userID).then(user => {
        Books.find({ _id: { $in: user.wish } }).then(books => {
            res.send(books);
        })
    })
})

router.post('/read', function (req, res) {
    User.findById(req.body.userID).then(user => {
        Books.find({ _id: { $in: user.read } }).then(books => {
            res.send(books);
        })
    })
})

router.post('/book', function (req, res) {
    Books.find({ _id: req.body.bookID}).then(book => {
        Comments.find({book: req.body.bookID}).then(comments => {
            console.log(comments)
            book.comments = [...comments];
            res.send({
                book: book,
                comments: comments
            });
        })
    })
})

module.exports = router