const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const roomRoutes = require('./routes/room')

const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Able to parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Templating engine setup
app.set('view engine', 'jade');
app.set('views', 'views');

app.use(roomRoutes);

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});


app.listen(3000);