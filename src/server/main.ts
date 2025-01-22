import express from 'express';
import ViteExpress from 'vite-express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

const mockGameList = [
    {
        id: Math.floor(Math.random() * 500000).toString(36),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Math.floor(Math.random() * 500000).toString(36),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Math.floor(Math.random() * 500000).toString(36),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Math.floor(Math.random() * 500000).toString(36),
        numberOfPlayer: Math.floor(Math.random() * 3),
        gameStatus: 'open',
    },
    {
        id: Math.floor(Math.random() * 500000).toString(36),
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

app.get('/api/games', (req, res) => {
    console.log(req.headers.cookie);
    res.json(mockGameList);
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-game', (gameId) => {
        io.to(socket.id).emit('join-response', 'success');
    });
});
