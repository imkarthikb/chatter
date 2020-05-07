const express = require('express');

const router = express.Router();

const roomController = require('../controllers/room')

router.get('/room', roomController.getRoom);

router.get('/join-room', roomController.getJoinRoom);
router.post('/join-room', roomController.postJoinRoom);

router.get('/create-room', roomController.getCreateRoom);
router.post('/create-room', roomController.postCreateRoom);

router.post('/leave-room', roomController.postLeaveRoom);

module.exports = router;