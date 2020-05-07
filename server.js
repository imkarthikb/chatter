const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');

const roomRoutes = require('./routes/room')
const socketService = require('./socket-service')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialise session
app.use(session({ secret: 'chatter', resave: false, saveUninitialized: false }));

// Able to parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Templating engine setup
app.set('view engine', 'pug');
app.set('views', 'views');

// Redirections
app.use(roomRoutes);
app.use('/', (req, res, next) => {
    res.render('index');
});

// Init socket service
socketService.init(io);

server.listen(3000);
