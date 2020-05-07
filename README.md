# Chatter

A realtime chat application built using [Socket.io](https://socket.io), node and express.

## Description
User will be able to join an existing chatroom or create one. The user will be able to send
and receive the messages in realtime.

## Usage
```
npm install

npm start
```

### Features included 
* Create a private room with a password.
* 'is typing...' text message is shown is single person is typing in the room
shows 'x people are typing' if 'x' number of people is typing in the room.
* User can enter and leave the room.
* Displays room password only to admin and not to other users.
* Can create open rooms with no password.

### Features to do 
* Avatar for each user.
* Storing and retrieving messages, rooms and users in a database. 
* Add emoji support.
* Display admin name explicitly.
* Add idle-time based 'is typing...' functionality.
