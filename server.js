const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, '/public')));

// Able to parse request body
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'room.html'));
});


app.listen(3000);