const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongo = require('mongodb').MongoClient
const mongoURI = "mongodb://yoana.grigorova:magic123@ds135089.mlab.com:35089/bookworld";

mongoose.connect(
    mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const schema = {
    text: { type: String, required: true },
    username: { type: String, required: true },
    book: { type: String, required: true }
};
const collectionName = "comments";
const commentSchema = mongoose.Schema(schema);
const Comments = mongoose.model(collectionName, commentSchema);

router.post('/create', function (req, res) {
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
    router: router,
    Comments: Comments
};