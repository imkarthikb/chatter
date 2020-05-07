const user = require('./models/user');
const message = require('./models/message');

const botName = 'Admin';
let io;
let typingUsers = [];

const init = (socketIo) => {
    io = socketIo;
    // Run when client connects
    io.on('connection', socket => {
        socket.on('joinRoom', ({ username, roomId }) => {
            // Assigning the client socket wuth the username
            socket.username = username;
            socket.roomId = roomId;

            console.log('Connected - ', socket.username);

            socket.join(roomId);

            // Welcome current user
            socket.emit('message', message.createMessage(botName, roomId, 'Welcome to Chatter!'));

            // Broadcast when a user connects
            socket.broadcast
                .to(roomId)
                .emit(
                    'message',
                    message.createMessage(botName, roomId, `${username} has joined the chat`)
                );

            // Send users and room info
            io.to(roomId).emit('roomUsers', {
                users: user.fetchRoomUsers(roomId)
            });

        });

        socket.on('send', ({ username, room, message }) => {
            // Broadcast the message to other users
            socket.broadcast
                .to(room)
                .emit(
                    'message',
                    message.createMessage(botName, room, `${username} has joined the chat`)
                );
        });

        socket.on('typing', ({ username, room }) => {
            // Adding the user to typing users list
            typingUsers.push({
                username: username,
                room: room
            });

            // Fetching the length of typing users of the room 
            const noOfUsersTypingInTheRoom = typingUsers.filter(typingUser => typingUser.room === room).length;

            // Forming appropriate message based on number of typing users of room
            let message = '';
            if (noOfUsersTypingInTheRoom == 1) {
                message = `${username} is typing...`
            } else {
                message = `${noOfUsersTypingInTheRoom} people are typing...`
            }

            // Broadcast the message to other users
            socket.broadcast
                .to(room)
                .emit(
                    'typing',
                    message
                );
        });

        socket.on('stoppedTyping', ({ username, room }) => {
            // Filtering all the users except the user who stopped typing
            // Replacing the typing users with that filtered list
            typingUsers = typingUsers.filter(typingUser => typingUser.username !== username);

            // Fetching the length of typing users of the room 
            const noOfUsersTypingInTheRoom = typingUsers.filter(typingUser => typingUser.room === room).length;

            // Forming appropriate message based on number of typing users of room
            let message = '';
            if (noOfUsersTypingInTheRoom == 1) {
                message = `${username} is typing...`
            } else {
                message = `${noOfUsersTypingInTheRoom} people are typing...`
            }

            // Broadcast the message to other users
            socket.broadcast
                .to(room)
                .emit(
                    'typing',
                    message
                );
        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            console.log('Disconnected - ', socket.username);
            socket.broadcast
                .to(socket.roomId)
                .emit(
                    'message',
                    message.createMessage(botName, socket.roomId, `${socket.username} has left the chat`)
                );
        });
    });
};
const adminExit = (admin, roomId) => {
    socket.broadcast.to(roomId).emit('adminExit');
};

module.exports = { init, adminExit };