const express = require('express');
const { createServer } = require("http");
const { Server } = require('socket.io');

const app = express()
const port = 3000

const config = {
  cors: {
    origin: "*" // Allow all hosts when in development. (not secure)
  }
}

const cors = require('cors')
app.use(cors(config.cors))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const httpServer = createServer(app);
const socketServer = new Server(httpServer, config);

const game = require('./routes/game')
app.use('/games', game)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

socketServer.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})