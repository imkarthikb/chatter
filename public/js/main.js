const socket = io();

const roomId = document.getElementById('roomId').value;
const username = document.getElementById('username').value;
const messageField = document.getElementById('msg');
const msgForm = document.getElementById('chat-form');
const usersList = document.getElementById('users');
const typing = document.getElementById('typing');

// Join room
socket.emit('joinRoom', { username, roomId });

// Listening for room users
socket.on('roomUsers', ({ users }) => {
    outputUsers(users);
});

// Listening for messages
socket.on('message', (message) => {
    outputMessage(message);
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
    socket.emit('stoppedTyping', { username, roomId });
    outputMessage({
        user: username, room: roomId, body: msg,
        timestamp: new Date(Date.now()).toUTCString()
    });

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
        outputIsTypingMessage(``);
    } else {
        // Checking if the same user exists in the list
        const userIndex = typingUsers.findIndex(typingUser => typingUser === username);
        if (userIndex != -1) {
            // The current user also exists in the list
            typingUsers.splice(userIndex, 1);
        }

        if (typingUsers.length == 0) {
            outputIsTypingMessage(``);
        } else if (typingUsers.length == 1) {
            outputIsTypingMessage(`${typingUsers[0]} is typing...`);
        } else {
            outputIsTypingMessage(`${typingUsers.length} people are typing...`);
        }
    }
});

// Add users to DOM
function outputUsers(users) {
    usersList.innerHTML = `
      ${users.map(user => `<li>${user.name}</li>`).join('')}
    `;
}

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.user} <span>${message.timestamp}</span></p>
    <p class="text">
      ${message.body}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output is typing message to DOM
function outputIsTypingMessage(message) {
    typing.innerText = message;
}