const { Emoji } = require("../models");
const { sendResponse } = require("../utils/responseHandler");


const getAllEmojis = async (req, res) => {
    try {
        const emojis = await Emoji.findAll();
        return sendResponse(res, "OK", null, emojis);
    } catch (error) {
        // res.status(500).json({ error: error.message });
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}

module.exports = { getAllEmojis }