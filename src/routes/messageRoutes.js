const express = require('express');
const { sendMessage, uploadFile, getMessagesByGroupId, getMessagesByUser, uploadFiles } = require('../controllers/messageController');
const { body } = require('express-validator');
const { sendMessageValidation, addReactionValidation } = require('../validations/commonValidations');
const { checkValidationMidd } = require('../middleware/checkValidationMidd');
const upload = require('../utils/fileUpload');
const { addReaction, deleteReaction } = require('../controllers/reactionController');
// const { uploadFile } = require('../controller/messageController');

const router = express.Router();

router.post('/send', sendMessageValidation, checkValidationMidd, sendMessage);
// router.post('/sendFile', sendMessageValidation, checkValidationMidd, uploadFile);
router.post('/uploadFiles', upload.array('files', 5), uploadFiles);
router.get('/group/:groupId', getMessagesByGroupId);
router.get('/user/:sender_id/:reciever_id', getMessagesByUser);


module.exports = router;
