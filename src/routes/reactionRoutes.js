const express = require('express');
const { addReaction } = require('../controllers/reactionController');
const { reactionValidation } = require('../validations/commonValidations');
const { checkValidationMidd } = require('../middleware/checkValidationMidd');


const router = express.Router();

// router.post('/create', create_grp_validations, createGroup);
router.post('/add', reactionValidation, checkValidationMidd, addReaction);

module.exports = router;
