const express = require('express');
const router = express.Router();

const groupRoutes = require('./groupRoutes');
const messageRoutes = require('./messageRoutes');
const reactionRoutes = require('./reactionRoutes');
const userRoutes = require('./userRoutes');
const emojiRoutes = require('./emojiRoutes');

router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/messages', messageRoutes);
router.use('/reactions', reactionRoutes);
router.use('/emoji', emojiRoutes);

module.exports = router;