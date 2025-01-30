const express = require("express");
const { Emoji } = require("../models");
const { getAllEmojis } = require("../controllers/emojisController");

const router = express.Router();

/**
 * @route GET /api/emojis
 * @desc Get all emojis
 */
router.get("/getAll", getAllEmojis);

module.exports = router;
