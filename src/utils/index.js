const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'onlineUsers.json');

const readOnlineUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify({}));
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading onlineUsers file:', error);
        return {};
    }
};

const writeOnlineUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing to onlineUsers file:', error);
    }
};

module.exports = { readOnlineUsers, writeOnlineUsers };
