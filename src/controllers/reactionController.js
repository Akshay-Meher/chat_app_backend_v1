const express = require("express");
const { MessageReaction, Emoji, Message, User } = require("../models");



/**
 * @route POST /api/reactions
 * @desc Add a reaction to a message
 */
const addReaction = async (req, res) => {
    try {
        const { message_id, user_id, emojiId } = req.body;

        // Validate if message exists
        const message = await Message.findByPk(message_id);
        if (!message) return res.status(404).json({ error: "Message not found" });

        // Validate if emoji exists
        const emoji = await Emoji.findByPk(emojiId);
        if (!emoji) return res.status(404).json({ error: "Emoji not found" });

        // Check if user already reacted with the same emoji
        const existingReaction = await MessageReaction.findOne({ where: { message_id, user_id, emojiId } });
        if (existingReaction) return res.status(400).json({ error: "Reaction already exists" });

        // Add reaction
        const reaction = await MessageReaction.create({ message_id, user_id, emojiId });
        res.status(201).json(reaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @route DELETE /api/reactions
 * @desc Remove a reaction from a message
 */
const deleteReaction = async (req, res) => {
    try {
        const { user_id, message_id, emojiId } = req.body;

        const reaction = await MessageReaction.findOne({ where: { user_id, message_id, emojiId } });
        if (!reaction) return res.status(404).json({ error: "Reaction not found" });

        await reaction.destroy();
        res.json({ message: "Reaction removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addReaction, deleteReaction };