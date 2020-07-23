const cors = require('cors')

const usersRouter = require('./users.js');
const users = usersRouter.router;

const commentsRouter = require('./comment.js');
const comments = commentsRouter.router;

const notificationsRouter = require('./notifications.js');
const notifications = notificationsRouter.router;

const books = require('./books.js');
const port = 5000;


const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodb = require('mongodb');
const monk = require('monk');
const db = monk('mongodb://yoana.grigorova:magic123@ds135089.mlab.com:35089/bookworld');
const app = express();
const MongoStore = require('connect-mongo')(session);
let router = express.Router();

app.use(function (req, res, next) {
    req.db = db;
    next();
});


app.use(bodyParser.json())
const corsOptions = {
    origin: "http://localhost:3000", //the port my react app is running on.
    credentials: true,
};
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'Shh, its a secret!', maxAge: 600000000, resave: true, saveUninitialized: false,
    cookie: { secure: false, httpOnly: false, maxAge: 600000000 },
    store: new MongoStore({ url: 'mongodb://yoana.grigorova:magic123@ds135089.mlab.com:35089/bookworld', autoRemove: 'native', ttl: 1 * 1 * 5 * 60 })
}));
app.use(router);
app.use('/api/users', users);
app.use('/api/books', books);
app.use('/api/comments', comments);
app.use('/api/notifications', notifications);

server.listen(port, () => {
    console.log(`app started on port ${port}`);
});
