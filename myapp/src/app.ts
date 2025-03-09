import express from "express";
import { type Request } from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import session from "express-session"
import { createHmac, randomBytes } from "node:crypto"
import registerGameHandlers from "./handlers/gameHandler"
import { router as gameRouter } from "./routes/gameRouter"
import { CheckerMove } from "./game"

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

interface ServerToClientEvents {
}

interface ClientToServerEvents {
  moveChecker: (payload: { id:string, move: CheckerMove}) => {}
}

interface InterServerEvents {
}

interface SocketData {
}

const socketServer = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, config);

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

app.use("/games", gameRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

socketServer.on("connection", (socket) => {
  const req = socket.request as Request;
  const sessionId = req.session.id;
  console.log("a user connected s:" + sessionId);

  registerGameHandlers(socketServer, socket)
});

httpServer.listen(port, () => {
  console.log(`myapp is running at: http://localhost:${port}`);
});
