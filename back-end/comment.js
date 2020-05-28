const express = require('express');
const router = express.Router();

router.post('/create', function (req, res) {
    let db = req.db;
    let Comments = db.get("comments")
    Comments.create({
        username: req.body.username,
        book: req.body.book,
        text: req.body.text
    }).then((data) => {
        res.send({
            result: "success",
            username: data.username,
            book: data.book,
            text: data.text
        })
    }).catch((err) => {
        res.send(err)
    });

})

module.exports = {
    router: router
};