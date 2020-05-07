const socket = io();

const roomId = document.getElementById('roomId').value;
var username = document.getElementById('username').value;

// Join room
socket.emit('joinRoom', { username, roomId });

// Listening for room users
socket.on('roomUsers', ({ users }) => {
    console.log(users);
    // TODO : Show list of users
});

// Listening for messages
socket.on('message', (message) => {
    console.log(message);
    // TODO : Show message
});

// Listening for admin exits
socket.on('adminExit', () => {
    window.location.href = "http://localhost:3000/";
});

// Send message
// TODO - Listen for send button clicks
// socket.emit('send', { username, roomId, message });

// Send typing event
// TODO - Listen for oninput event
// socket.emit('typing', { username, roomId });

// Stopped typing event
// TODO - Listen for oninput event
// socket.emit('stoppedTyping', { username, roomId });

// Listen for typing events
socket.on('typing', (message) => {
    console.log(message);
    // TODO - Show the message
});