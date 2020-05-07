const user = require('./models/user');
const message = require('./models/message');

const botName = 'Admin';
let io;
let typingStats = [];

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

        socket.on('send', ({ username, roomId, msg }) => {
            console.log(username, roomId, msg);

            // Broadcast the message to other users
            socket.broadcast
                .to(roomId)
                .emit(
                    'message',
                    message.createMessage(username, roomId, msg)
                );
        });

        socket.on('typing', ({ username, roomId }) => {
            // Adding the user to typing users list
            const typingItem = typingStats.find(typingItem => typingItem.room === roomId);
            if (typingItem) {
                // Typing room already exists
                // Assuming users exist in that room else would have been removed
                if (typingItem.users) {
                    const typingUser = typingItem.users.find(userName => userName === username);
                    if (typingUser) {
                        // The typing user already exists in the typing users list
                    } else {
                        typingItem.users.push(username);
                    }
                } else {
                    typingItem.users = [username];
                }
            } else {
                // Typing room doesnt exist
                typingStats.push({
                    users: [username],
                    room: roomId
                })
            }

            // Fetching the room
            const room = typingStats.find(typingItem => typingItem.room === roomId);

            // Broadcast the message to other users
            socket.broadcast
                .to(roomId)
                .emit(
                    'typing',
                    room.users
                );
        });

        socket.on('stoppedTyping', ({ username, roomId }) => {
            // Removing the user to typing users list
            const typingItem = typingStats.find(typingItem => typingItem.room === roomId);
            const typingItemIndex = typingStats.findIndex(typingItem => typingItem.room === roomId);
            if (typingItem) {
                // Typing room already exists
                // Assuming users exist in that room else would have been removed
                if (typingItem.users) {
                    const typingUserIndex = typingItem.users.findIndex(userName => userName === username);
                    if (typingUserIndex != -1) {
                        // The typing user exists in the typing users list
                        typingItem.users.splice(typingUserIndex, 1);

                        // Checking if the typing users is empty
                        if (typingItem.users.length == 0) {
                            // Removing from the typing stats
                            typingStats.splice(typingItemIndex, 1);
                        }
                    }
                }
            } else {
                // Typing room doesnt exist
            }

            // Fetching the room 
            const room = typingStats.find(typingUser => typingUser.room === roomId);

            // Broadcast the message to other users
            socket.broadcast
                .to(roomId)
                .emit(
                    'typing',
                    (room) ? room.users : [],
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