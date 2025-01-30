const express = require('express');
const { addReaction, addOrRemoveReaction, deleteReaction } = require('../controllers/reactionController');
const { reactionValidation, addReactionValidation } = require('../validations/commonValidations');
const { checkValidationMidd } = require('../middleware/checkValidationMidd');


const router = express.Router();

// router.post('/create', create_grp_validations, createGroup);
router.post('/add', addReactionValidation, checkValidationMidd, addOrRemoveReaction);
router.delete('/delete', addReactionValidation, checkValidationMidd, deleteReaction);

module.exports = router;
