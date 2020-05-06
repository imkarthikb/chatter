const room = require('../models/room');
const user = require('../models/user');

exports.getJoinRoom = (req, res, next) => {
    res.render('join-room', {
        roomId: '',
        userNameAlreadyTaken: false,
        inCorrectPassword: false,
        roomDoesntExist: false,
        userName: '',
        password: ''
    });
};

exports.postJoinRoom = (req, res, next) => {
    // Fetching roomId, roomPassword from the request
    const roomId = req.body.roomId;
    const roomPassword = req.body.roomPassword;
    const username = req.body.username;

    // Fetching the appropiate room
    const fetchedRoom = room.getRoom(roomId);
    console.log(fetchedRoom);
    console.log(roomPassword);

    if (fetchedRoom) {
        if ((fetchedRoom.password || '') === roomPassword) {
            // User has entered correct password

            // Check if username is already taken
            const fetchedUser = user.getUser(username);

            if (!fetchedUser) {
                // User doesnt exist

                // Creating new user
                user.createUser(username, roomId);

                // Redirecting user
                res.redirect('enter-room');
            } else {
                // User already exists
                res.render('join-room', {
                    roomId: roomId,
                    userNameAlreadyTaken: true,
                    inCorrectPassword: false,
                    roomDoesntExist: false,
                    userName: username,
                    password: roomPassword
                });
            }
        } else {
            // User has entered incorrect password
            res.render('join-room', {
                roomId: roomId,
                userNameAlreadyTaken: false,
                inCorrectPassword: true,
                roomDoesntExist: false,
                userName: username,
                password: roomPassword
            });
        }
    } else {
        // Room doesnt exist
        console.log('Room doesnt exist');
        res.render('join-room', {
            roomId: roomId,
            userNameAlreadyTaken: false,
            inCorrectPassword: false,
            roomDoesntExist: true,
            userName: username,
            password: roomPassword
        });
    }
};

exports.getCreateRoom = (req, res, next) => {
    // Fetching unique room id
    const uniqueRoomId = room.getUniqueRoomId();

    res.render('create-room', {
        roomId: uniqueRoomId,
        userNameAlreadyTaken: false,
        userName: '',
        password: ''
    });
};

exports.postCreateRoom = (req, res, next) => {
    // Fetching the roomId and roomPassword
    const roomId = req.body.roomId;
    const roomPassword = req.body.roomPassword;
    const username = req.body.username;

    // Check if username is already taken
    const fetchedUser = user.getUser(username);

    if (!fetchedUser) {
        // User doesnt exist

        // Creating new user
        user.createUser(username, roomId);

        // Creating the room
        room.createRoom(roomId, roomPassword, username);

        // Redirecting user
        res.redirect('enter-room');
    } else {
        // User already exists
        res.render('create-room', {
            roomId: roomId,
            userNameAlreadyTaken: true,
            userName: username,
            password: roomPassword
        });
    }
};
