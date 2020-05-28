var express = require('express');
var router = express.Router();

router.get('/all', function (req, res) {
    let db = req.db;
    let Books = db.get("books")
    Books.find().then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });

})

router.get('/favorites', function (req, res) {
    let db = req.db;
    let Books = db.get("books");
    let User = db.get("users");
    User.find({ _id: req.session.user.id }).then(user => {
        Books.find({ _id: { $in: user[0].favorites } }).then(books => {
            res.send(books);
        })
    })
})

router.get('/wish', function (req, res) {
    let db = req.db;
    let Books = db.get("books")
    let User = db.get("users")
    User.find({ _id: req.session.user.id }).then(user => {
        Books.find({ _id: { $in: user[0].wish } }).then(books => {
            res.send(books);
        })
    })
})

router.get('/read', function (req, res) {
    let db = req.db;
    let Books = db.get("books")
    let User = db.get("users")
    User.find({ _id: req.session.user.id }).then(user => {
        Books.find({ _id: { $in: user[0].read } }).then(books => {
            res.send(books);
        })
    })
})

router.get('/book', function (req, res) {
    let db = req.db;
    let Books = db.get("books")
    let Comments = db.get("comments")
    Books.find({ _id: req.query.bookID }).then(book => {
        Comments.find({ book: req.query.bookID }).then(comments => {
            book.comments = [...comments];
            res.send({
                book: book,
                comments: comments
            });
        })
    })
})
router.put("/rating", function (req, res) {
    let db = req.db;
    let Books = db.get("books");
    Books.findOneAndUpdate({ _id: req.body.bookID }, {$push: {ratings: {user: {username: req.session.user.username, id: req.session.user.id}, stars: req.body.stars} }}).then(book => {
        res.send(book)
    })
})

router.put("/changeRating", function (req, res) {
    let db = req.db;
    let Books = db.get("books");
    Books.findOneAndUpdate({ _id: req.body.bookID }, {$set: {rating: req.body.rating}}).then(book => {
        res.send(book)
    })
})

module.exports = router