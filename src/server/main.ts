import express from 'express';
import ViteExpress from 'vite-express';
import { Server } from 'socket.io';
<<<<<<< HEAD
import {setupSocket} from "./services/game/socketService";
=======
import { setupSocket } from './services/game/socketService';
>>>>>>> feature/backend/socketService
import cors from 'cors';

const app = express();

const mockGameList = [
    {
        id: Date.now().toString(36) + Math.floor(Math.random() * 1000),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Date.now().toString(36) + Math.floor(Math.random() * 1000),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Date.now().toString(36) + Math.floor(Math.random() * 1000),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Date.now().toString(36) + Math.floor(Math.random() * 1000),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Date.now().toString(36) + Math.floor(Math.random() * 1000),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
];

app.use(cors());
const viteServer = ViteExpress.listen(app, 3000, () => {
    console.log('Server is listening on port 3000...');
});

const io = new Server(viteServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.get('/api', (req, res) => {
    console.log(req.headers.cookie);
    res.json('test');
});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//
//     socket.on('test', (arg) => {
//         console.log(`Test: ${JSON.stringify(arg)}`);
//     });
// });
setupSocket(io);
<<<<<<< HEAD
=======

app.get('/api/games', (req, res) => {
    console.log(req.headers.cookie);
    res.json(mockGameList);
});

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('join-game', (gameId) => {
//         setTimeout(() => {
//             const gameData = {
//                 players: [1, 2, 3, 4],
//                 round: 1,
//                 status: 'started',
//             };

//             if (true) {
//                 io.to(socket.id).emit('join-response', {
//                     isPermitted: true,
//                     gameData,
//                 });
//             } else {
//                 io.to(socket.id).emit('join-response', {
//                     isPermitted: false,
//                     gameData: null,
//                 });
//             }
//         }, 1000);
//     });
// });
>>>>>>> feature/backend/socketService
