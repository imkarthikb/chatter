const messages = [];

const createMessage = (username, room, body) => {
    const newMessage = {
        user: username,
        body: body,
        room: room,
        timestamp: new Date(Date.now()).toUTCString()
    };

    messages.push(newMessage);
    return newMessage;
};

module.exports = { createMessage }