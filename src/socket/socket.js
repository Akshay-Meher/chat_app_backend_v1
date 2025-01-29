const { Message, User } = require('../models');

const { Server } = require('socket.io');
const { readOnlineUsers, writeOnlineUsers } = require('../utils');

let onlineUsers = {};
let io;


function sendMessageToUser(userId, message) {
    // const onlineUsers = readOnlineUsers();
    const socketId = onlineUsers[userId];
    // console.log("onlineUsers", onlineUsers);
    if (socketId) {
        io.to(socketId).emit('privateMessage', message);
        console.log(`Message sent to user ${userId} (Socket ID: ${socketId})`);
    } else {
        console.log(`User ${userId} is not connected`);
    }
}


const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {

        console.log('A user connected:', socket.id);

        socket.on('join', (user) => {
            console.log("join event", user);
            onlineUsers[user?.id] = socket.id;
            // writeOnlineUsers(onlineUsers);
            console.log(`${user?.name} joined with socket ID: ${socket.id}`);
            io.emit('update-user-list', Object.keys(onlineUsers));
        });


        socket.on('chatMessage', async ({ senderId, receiverId, content }) => {
            try {

                console.log("EVent chatMessage ", {
                    senderId,
                    receiverId,
                    content
                });

                const savedMessage = await Message.create({
                    senderId,
                    receiverId,
                    content
                });

                sendMessageToUser(receiverId, {
                    senderId,
                    receiverId,
                    content
                });

            } catch (error) {
                console.error('Error saving message:', error);
            }
        });


        // Join a group
        socket.on('joinGroup', ({ groupId, userId }) => {
            console.log(`User ${userId} joined group ${groupId}`);
            socket.join(`group_${groupId}`);
        });

        // Handle group messages
        socket.on('groupMessage', async (data) => {

            console.log("groupMessage", data);

            const { groupId, senderId, content, filename, file_url, filetype, filesize, reply_to_message_id } = data;

            if (!groupId && !senderId) {
                console.log("ERRR: groupId or senderId null",)
                return;
            }

            // const newMessage = await GroupMessage.create({
            //     groupId,
            //     senderId,
            //     message: content,
            // });


            // Fetch sender's information
            const sender = await User.findByPk(senderId, {
                attributes: ['id', 'name', 'email'],
            });

            let replyToMessage1 = {};
            if (reply_to_message_id) {
                const replyToMessage = await Message.findByPk(reply_to_message_id);
                console.log("replyToMessage", replyToMessage);
                replyToMessage1.content = replyToMessage?.content;
                replyToMessage1.filename = replyToMessage?.filename;
            }

            const newMessage = await Message.create({
                group_id: groupId,
                sender_id: senderId,
                receiver_id: null,
                content: content,
                filename, file_url, filetype, filesize,
                reply_to_message_id
            });
            const messageToEmit = {
                id: newMessage.id,
                group_id: newMessage.group_id,
                sender_id: newMessage.sender_id,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: sender ? { id: sender.id, username: sender.name, email: sender.email } : null,
                filename, file_url, filetype, filesize,
                replyToMessage: replyToMessage1
            };

            // console.log("messageToEmit", messageToEmit);

            // const messageToEmit = {
            //     id: newMessage.id,
            //     groupId: newMessage.groupId,
            //     senderId: newMessage.senderId,
            //     message: newMessage.message,
            //     createdAt: newMessage.createdAt,
            // };

            // Broadcast the message to the group
            socket.join(`group_${groupId}`);
            io.to(`group_${groupId}`).emit('groupMessage', messageToEmit);
        });



        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (let id in onlineUsers) {
                if (onlineUsers[id] === socket.id) {
                    delete onlineUsers[id];
                    break;
                }
            }
            io.emit('update-user-list', Object.keys(onlineUsers));
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIo };