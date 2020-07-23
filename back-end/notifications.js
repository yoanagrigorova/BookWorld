var express = require('express');
var router = express.Router();
const io = require('socket.io')();
io.listen(2323);

router.post("/:userID", function (req, res) {
    let db = req.db;
    let Notifications = db.get("notifications")
    Notifications.insert({
        sender: req.session.user,
        reciever: req.params.userID,
        book: req.body.book,
        read: false,
        created_at: new Date()
    }).then(data => {
        io.emit("notification", data)
        res.send({
            msg: "Created"
        });
    })
})

router.get('/', function (req, res) {
    let db = req.db;
    let Notifications = db.get("notifications")
    Notifications.find({reciever: req.session.user.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });

})

router.put('/markAsRead/:id', function (req, res) {
    let db = req.db;
    let Notifications = db.get("notifications")
    Notifications.findOneAndUpdate({_id: req.params.id}, {$set: {read:true}}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    });
})


module.exports = {
    router: router
};