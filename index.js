const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uri = 'mongodb+srv://bugtracker:bugtracker98@bugtracker.jhxnl1m.mongodb.net/';
const dbName = 'test';
const collectionName = 'newusers';


console.log('s')
// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

async function watchCollection(io) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const changeStream = collection.watch();

        changeStream.on('change', (change) => {
            console.log('Change detected:', change);
            io.emit('mongoChange', change); // Emit the change event to all connected clients
        });

        console.log('Watching for changes...');
    } catch (err) {
        console.error(err);
    }
}

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

watchCollection(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
