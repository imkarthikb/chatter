const room = require('../models/room');
const user = require('../models/user');
const socketService = require('../socket-service');

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

    if (fetchedRoom) {
        if ((fetchedRoom.password || '') === roomPassword) {
            // User has entered correct password

            // Check if username is already taken
            const fetchedUser = user.getUser(username);

            if (!fetchedUser) {
                // User doesnt exist

                // Creating new user
                user.createUser(username, roomId);

                // Redirecting user to room
                req.session.roomId = roomId;
                req.session.username = username;
                res.redirect('/room');
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

        // Redirecting user to room
        req.session.roomId = roomId;
        req.session.username = username;
        res.redirect('/room');
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

exports.postLeaveRoom = (req, res, next) => {
    // Fetching the roomId and username
    const roomId = req.body.roomId;
    const username = req.body.username;

    // Delete user
    user.deleteUser(username);

    // Fetching the room to check the user was the admin
    const fetchedRoom = room.getRoom(roomId);

    // If the user is the admin redirect the user to home
    if (fetchedRoom.admin === username) {
        room.deleteRoom(roomId);

        socketService.adminExit(username, roomId);
    }

    // Redirect user to home
    res.redirect('/');
};

exports.getRoom = (req, res, next) => {
    // Fetching the roomId and username from session
    const roomId = req.session.roomId;
    const username = req.session.username;

    if (!roomId || !username) {
        // If neither roomId or the username is not existing in session
        // then is redirected to home screen
        res.redirect('/');
    } else {
        const { admin, password } = room.getRoom(roomId);
        res.render('room', {
            roomId: roomId,
            username: username,
            roomPassword: password,
            isAdmin: (admin === username)
        });
    }
};
