const users = [];

const getUser = (name) => {
    return users.find(user => user.name === name);
};

const createUser = (name, room) => {
    const user = {
        name: name,
        room: room
    }
    users.push(user);
    return name;
};

const deleteUser = (name) => {
    const index = users.findIndex(user => user.name === name);

    if (index != -1) {
        users.splice(index, 1);
    }
};

const fetchRoomUsers = (roomId) => {
    return users.filter(user => user.room === roomId);
};


module.exports = {
    getUser,
    createUser,
    deleteUser,
    fetchRoomUsers
}