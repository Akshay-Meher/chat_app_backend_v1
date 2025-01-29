const express = require('express');
const { createGroup, getGroupsByUserId } = require('../controllers/groupController');
const { create_grp_validations } = require('../validations/commonValidations');
const upload = require('../utils/fileUpload');
const { uploadFile } = require('../controllers/messageController');
const { checkValidationMidd } = require('../middleware/checkValidationMidd');

const router = express.Router();

router.post('/create', create_grp_validations, checkValidationMidd, createGroup);
router.get('/getGroups/:userId', getGroupsByUserId);

module.exports = router;
