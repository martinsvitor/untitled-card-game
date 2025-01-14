import express from 'express';
import ViteExpress from 'vite-express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

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

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('test', (arg) => {
        console.log(`Test: ${JSON.stringify(arg)}`);
    });
});
