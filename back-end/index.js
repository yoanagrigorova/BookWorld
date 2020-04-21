const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
var cookieParser = require('cookie-parser');
var session = require('express-session');

const usersRouter = require('./users.js');
const users = usersRouter.router;

const commentsRouter = require('./comment.js');
const comments = commentsRouter.router;

const books = require('./books.js');

const app = express();
const port = 5000;

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use('/users', users);
app.use('/books', books);
app.use('/comments', comments);

app.listen(port, () => {
    console.log(`app started on port ${port}`);
});
