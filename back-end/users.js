var express = require('express');
var router = express.Router();
const sha1 = require('sha1');

router.get("/", function(req,res){
    let db = req.db;
    let User = db.get("users");
    User.find().then(data=>{
        let users = data.filter(u => u._id).map(user => {return {username: user.username, id: user._id, photo: user.photo, email:user.email, role: user.role}})
        res.send(users)
    })
})

router.get('/checkSession', function (req, res) {
    // console.log(req.sessionID)
    if (req.session.user) {
        res.send(req.session.user)
    } else {
        res.send({msg: "Not found"});
    }
});

router.get('/signOut', function (req, res) {
    // console.log(req.sessionID)
    if (req.session.user) {
        req.session.destroy();
        res.send(JSON.stringify(null))
    } else {
        res.sendStatus(JSON.stringify(null));
    }
});

router.post('/', function (req, res) {
    let db = req.db;
    let User = db.get("users");
    User.insert({
        username: req.body.username,
        email: req.body.email,
        password: sha1(req.body.password),
        favorites: [],
        read: [],
        wish: [],
        role: "user",
        photo: "https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
    }).then((data) => {
        req.session.user = {
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish,
            photo: data.photo
        }
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish,
            photo: data.photo
        })
    }).catch((err) => {
        if (err.errmsg && err.errmsg.indexOf(req.body.email) !== -1) {
            res.send({
                result: "error",
                key: "email",
                message: "Email address is already used."
            })
        }
        if (err.errmsg && err.errmsg.indexOf(req.body.username) !== -1) {
            res.send({
                result: "error",
                key: "username",
                message: "This username is already taken."
            })
        }
        res.send(err)
    });

})

router.post('/login', function (req, res) {
    let db = req.db;
    let User = db.get("users");
    User.findOne({
        email: req.body.email,
        password: sha1(req.body.password),
    }).then((data) => {
        req.session.user = {
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish,
            photo: data.photo
        }
        req.session.save()
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish,
            photo: data.photo
        })
    }).catch((err) => {
        res.send({
            result: "error",
            message: "User information is incorrect."
        })
    });

})

router.put("/addFavorite/:bookID", (req, res) => {
    let book = req.params.bookID;
    let db = req.db;
    let User = db.get("users");

    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$push": { "favorites": book } }, { "upsert": true, "new": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})

router.put("/removeFavorite/:bookID", (req, res) => {
    let book = req.params.bookID;
    let db = req.db;
    let User = db.get("users");

    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$pull": { "favorites": book } }, { "multi": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})


router.put("/removeWish/:bookID", (req, res) => {
    let book = req.params.bookID;
    let db = req.db;
    let User = db.get("users");
    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$pull": { "wish": book } }, { "multi": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})

router.put("/addRead/:bookID", (req, res) => {
    let book = req.params.bookID;
    let db = req.db;
    let User = db.get("users");

    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$push": { "read": book } }, { "upsert": true, "new": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})

router.put("/removeRead/:bookID", (req, res) => {
    let book = req.params.bookID;

    let db = req.db;
    let User = db.get("users");

    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$pull": { "read": book } }, { "multi": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})

router.put("/addWish/:bookID", (req, res) => {
    let book = req.params.bookID;

    let db = req.db;
    let User = db.get("users");

    User.findOneAndUpdate({
        _id: req.session.user.id
    },
        { "$push": { "wish": book } }, { "upsert": true, "new": true }).then(data => {
            req.session.user = {
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            }
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish,
                photo: data.photo
            })
        }).catch(err => {
            res.send(err);
        })

})

module.exports = {
    router: router
};
