const express = require('express');
const http = require('http');
const { initializeSocket } = require('./src/socket/socket');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./src/routes');
const path = require('path');
app.use(cors());

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});