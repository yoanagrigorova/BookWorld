const express = require('express');
const router = express.Router();
const io = require('socket.io')();
io.listen(2324);

router.post('/', function (req, res) {
    let db = req.db;
    let Comments = db.get("comments")
    Comments.insert({
        username: req.body.username,
        book: req.body.book,
        text: req.body.text
    }).then((data) => {
        io.emit("newComment", data)
        res.send({
            result: "success",
            _id: data._id,
            username: data.username,
            book: data.book,
            text: data.text
        })
    }).catch((err) => {
        res.send(err)
    });

})

router.delete('/:id', function (req, res) {
    let db = req.db;
    let Comments = db.get("comments")
    if (req.session.user.role === "admin") {
        Comments.findOneAndDelete({
            _id: req.params.id
        }).then((data) => {
            io.emit("deletedComment", data)
            res.status(200).json({"msg": "Success"})
        }).catch((err) => {
            res.status(404).json(err)
        });
    }else{
        res.sendStatus(401);
    }


})

module.exports = {
    router: router
};