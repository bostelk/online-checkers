const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const { createHmac, randomBytes} = require('node:crypto');
const registerGameHandlers = require("./handlers/gameHandler");

const config = {
  cors: {
    origin: "*", // Allow all hosts when in development. (not secure)
  },
  session: {
    secret: createHmac('sha256', randomBytes(2048)).digest('hex')
  },
};

const app = express();
const port = 3000;

const httpServer = createServer(app);
const socketServer = new Server(httpServer, config);

const cors = require("cors");
app.use(cors(config.cors));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const sessionMiddleware = session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true
});
app.use(sessionMiddleware);
socketServer.engine.use(sessionMiddleware);

const gameRouter = require("./routes/gameRouter");
app.use("/games", gameRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

socketServer.on("connection", (socket) => {
  const sessionId = socket.request.session.id;
  console.log("a user connected s:" + sessionId);

  registerGameHandlers(socketServer, socket)
});

httpServer.listen(port, () => {
  console.log(`myapp is running at: http://localhost:${port}`);
});
