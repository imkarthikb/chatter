const socket = io();

const roomId = document.getElementById('roomId').value;
const username = document.getElementById('username').value;
const messageField = document.getElementById('msg');
const msgForm = document.getElementById('chat-form');

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
msgForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    const msg = messageField.value;

    // Emit message to server
    socket.emit('send', { username, roomId, msg });

    // Clear input
    messageField.value = '';
    messageField.focus();

});

// Send typing event
messageField.addEventListener('input', e => {
    const msgLength = messageField.value.length;
    if (msgLength == 1) {
        socket.emit('typing', { username, roomId });
    } else if (msgLength == 0) {
        socket.emit('stoppedTyping', { username, roomId });
    }

});

// Listen for typing events
socket.on('typing', (typingUsers) => {
    // TODO - Show the message

    if (typingUsers.length == 0) {
        console.log('none are typing...');
    } else {
        // Checking if the same user exists in the list
        const userIndex = typingUsers.findIndex(typingUser => typingUser === username);
        if (userIndex != -1) {
            // The current user also exists in the list
            typingUsers.splice(userIndex, 1);
        }
        
        if (typingUsers.length == 0) {
            console.log('none are typing...');
        } else if (typingUsers.length == 1) {
            console.log(typingUsers[0], ' is typing...');
        } else {
            console.log(typingUsers.length, ' people are typing...');
        }
    }
});