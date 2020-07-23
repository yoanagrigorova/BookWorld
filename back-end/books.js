var express = require('express');
var router = express.Router();
const io = require('socket.io')();
io.listen(2325);

router.post('/', function (req, res) {
    if (req.session.user.role === "admin") {
        let db = req.db;
        let Books = db.get("books")
        Books.insert({
            title: req.body.title,
            image: req.body.image,
            authors: req.body.authors,
            description: req.body.description,
            categories: req.body.categories,
            comments: [],
            rating: 0,
            ratings: []
        }).then(data => {
            io.emit("newBook", data)
            res.send(data);
        })
    } else {
        res.sendStatus(401);
    }
})

router.get('/', function (req, res) {
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

router.get('/:bookID', function (req, res) {
    let db = req.db;
    let Books = db.get("books")
    let Comments = db.get("comments")
    Books.find({ _id: req.params.bookID }).then(book => {
        Comments.find({ book: req.params.bookID }).then(comments => {
            book.comments = [...comments];
            res.send({
                book: book,
                comments: comments
            });
        })
    })
})
router.put("/rate/:bookID", function (req, res) {
    let db = req.db;
    let Books = db.get("books");
    Books.findOneAndUpdate({ _id: req.params.bookID }, { $push: { ratings: { user: { username: req.session.user.username, id: req.session.user.id }, stars: req.body.stars } } }).then(book => {
        res.send(book)
    })
})

router.put("/changeRating/:bookID", function (req, res) {
    let db = req.db;
    let Books = db.get("books");
    Books.findOneAndUpdate({ _id: req.params.bookID }, { $set: { rating: req.body.rating } }).then(book => {
        res.send(book)
    })
})

module.exports = router