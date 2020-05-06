const rooms = [];

const getUniqueRoomId = () => {
    while (true) {
        let randomRoomId = Math.floor(1000 + Math.random() * 9000);
        let alreadyExistingRoom = rooms.find(room => room.id === randomRoomId);
        if (!alreadyExistingRoom) {
            return randomRoomId;
        }
    }
};

const createRoom = (id, password, admin) => {
    const room = {
        id: id,
        password: password,
        admin: admin
    }
    rooms.push(room);
    return id;
};

const deleteRoom = (id) => {
    const index = rooms.findIndex(room => room.id === id);

    if (index != -1) {
        rooms.splice(index, 1);
    }
};

const getRoom = (id) => {
    return rooms.find(room => room.id === id);
};


module.exports = {
    getUniqueRoomId,
    createRoom,
    deleteRoom,
    getRoom
}