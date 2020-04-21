const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongo = require('mongodb').MongoClient
const mongoURI = "mongodb://yoana.grigorova:magic123@ds135089.mlab.com:35089/bookworld";
const sha1 = require('sha1')

mongoose.connect(
    mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const schema = {
    // firstName: { type: mongoose.SchemaTypes.String },
    // lastName: { type: mongoose.SchemaTypes.String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        select: false
    },
    favorites: { type: [String], index: true },
    read: { type: [String], index: true },
    wish: { type: [String], index: true },
    role: String
};
const collectionName = "users";
const userSchema = mongoose.Schema(schema);
const User = mongoose.model(collectionName, userSchema);

router.post('/create', function (req, res) {
    let sess = req.session
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: sha1(req.body.password),
        favorites: [],
        read: [],
        wish: [],
        role: "user"
    }).then((data) => {
        sess.user = {
            username: data.username,
            email: data.email,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        }
        res.send({
            result: "success",
            username: data.username,
            email: data.email,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
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
    let sess = req.session
    User.findOne({
        email: req.body.email,
        password: sha1(req.body.password),
    }).then((data) => {
        sess.user = {
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        }
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        })
    }).catch((err) => {
        res.send({
            result: "error",
            message: "User information is incorrect."
        })
    });

})

router.post("/addFavorite", (req, res) => {
    let email = req.body.email;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        email: email
    },
        { "$push": { "favorites": book } }, { "upsert": true, "new": true }).then(data => {
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish
            })
        }).catch(err => {
            res.send(err);
        })

})

router.post("/removeFavorite", (req, res) => {
    let user = req.body.userID;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        _id: user
    },
    {"$pull" : {"favorites":  book}}, { "multi": true }).then(data => {
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        })
    }).catch(err => {
        res.send(err);
    })

})


router.post("/removeWish", (req, res) => {
    let user = req.body.userID;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        _id: user
    },
    {"$pull" : {"wish":  book}}, { "multi": true }).then(data => {
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        })
    }).catch(err => {
        res.send(err);
    })

})

router.post("/addRead", (req, res) => {
    let user = req.body.userID;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        _id: user
    },
        { "$push": { "read": book } }, { "upsert": true, "new": true }).then(data => {
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish
            })
        }).catch(err => {
            res.send(err);
        })

})

router.post("/removeRead", (req, res) => {
    let user = req.body.userID;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        _id: user
    },
    {"$pull" : {"read":  book}}, { "multi": true }).then(data => {
        res.send({
            result: "success",
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role,
            favorites: data.favorites,
            read: data.read,
            wish: data.wish
        })
    }).catch(err => {
        res.send(err);
    })

})

router.post("/addWish", (req, res) => {
    let user = req.body.userID;
    let book = req.body.bookID;

    User.findOneAndUpdate({
        _id: user
    },
        { "$push": { "wish": book } }, { "upsert": true, "new": true }).then(data => {
            res.send({
                result: "success",
                id: data._id,
                email: data.email,
                username: data.username,
                role: data.role,
                favorites: data.favorites,
                read: data.read,
                wish: data.wish
            })
        }).catch(err => {
            res.send(err);
        })

})

module.exports = {
    router: router,
    User: User
};
