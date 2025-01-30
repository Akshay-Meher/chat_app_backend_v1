const { validationResult } = require('express-validator');
const { Message, User, MessageReaction, Emoji } = require('../models');
const path = require('path');
const fs = require('fs');
const { generateUniqueFilename } = require('../utils/fileOperationsHelper');
const { sendResponse } = require('../utils/responseHandler');

const sendMessage = async (req, res) => {

    const { sender_id, receiver_id, group_id, content, reply_to_message_id } = req.body;

    try {
        const message = await Message.create({
            sender_id,
            receiver_id,
            group_id,
            content,
            reply_to_message_id,
        });

        return res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
};





const uploadFiles = async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded');
        }

        // Step 1: Move files to 'public/uploads' directory after successful upload
        const filePaths = [];
        const fileNames = [];
        const fileTypes = [];
        const fileSizes = [];
        const tempDir = path.join(__dirname, '../../public/temp');
        const uploadDir = path.join(__dirname, '../../public/uploads');

        for (const file of req.files) {

            const mimeType = file.mimetype;
            const fileSize = file.size;
            const tempFilePath = path.join(tempDir, file.filename);
            const originalName = file.originalname.replace(/\s+/g, '_');
            let uploadFileName = generateUniqueFilename(originalName, uploadDir);
            const uploadFilePath = path.join(uploadDir, uploadFileName);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            await new Promise((resolve, reject) => {
                fs.rename(tempFilePath, uploadFilePath, (err) => {
                    if (err) reject(err);
                    else {
                        filePaths.push(`/uploads/${uploadFileName}`);
                        fileNames.push(originalName);
                        fileTypes.push(mimeType);
                        fileSizes.push(fileSize);
                        resolve();
                    }
                });
            });
        }

        return sendResponse(res, "OK", "Files uploaded and moved successfully", {
            filePaths: filePaths,
            fileNames, fileTypes, fileSizes
        });

    } catch (error) {
        res.status(500).send({ message: 'Error moving files', error: error.message });
    }
}

const getMessagesByGroupId = async (req, res) => {
    const { groupId } = req.params;

    try {

        // Fetch messages for the group along with sender, receiver, and reply details
        // const messages = await Message.findAll({
        //     where: { group_id: groupId },
        //     include: [
        //         {
        //             model: User,
        //             as: 'Sender',
        //             attributes: ['id', 'name', 'email'],
        //         },
        //         {
        //             model: User,
        //             as: 'Receiver',
        //             attributes: ['id', 'name', 'email'],
        //         },
        //         {
        //             model: Message,
        //             as: 'replyToMessage', // Alias for replied-to message
        //             attributes: ['filename', 'content'], // Include necessary fields
        //         }
        //     ],
        //     order: [['createdAt', 'ASC']],
        // });

        // if (!messages.length) {
        //     return res.status(404).json({ message: 'No messages found for this group' });
        // }


        // return res.status(200).json({ messages });


        // Fetch messages for the group along with sender, receiver, reply details, and reactions
        const messages = await Message.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: User,
                    as: 'Receiver',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Message,
                    as: 'replyToMessage', // Alias for replied-to message
                    attributes: ['filename', 'content'], // Include necessary fields
                },
                {
                    model: MessageReaction,
                    as: 'reactions',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: Emoji,
                            as: 'emoji',
                            attributes: ['id', 'unicode', 'imageUrl', 'description'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found for this group' });
        }

        return res.status(200).json({ messages });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};


const getMessagesByUser = async (req, res) => {
    const { sender_id, receiver_id } = req.params;

    try {
        // Fetch messages for the group along with sender and receiver details
        const messages = await Message.findAll({
            where: { sender_id, receiver_id },
            include: [
                {
                    model: User,
                    as: 'Sender', // Alias for sender details
                    attributes: ['id', 'name', 'email'], // Specify the fields to include
                },
                {
                    model: User,
                    as: 'Receiver', // Alias for receiver details (optional for private chats)
                    attributes: ['id', 'name', 'email'], // Specify the fields to include
                },
            ],
            order: [['createdAt', 'ASC']], // Sort messages by creation time
        });

        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found for this group' });
        }

        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

module.exports = { sendMessage, getMessagesByGroupId, getMessagesByUser, uploadFiles };

