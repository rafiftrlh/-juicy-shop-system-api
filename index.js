import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

import setupWebSocket from "./services/websocket.js"

import systemUserRoute from "./routes/system_user.route.js"
import memberRoute from "./routes/member.route.js"
import authRoute from "./routes/auth.route.js"
import categoryRoute from "./routes/category.route.js"
import session from "express-session"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use("/api/system-user", systemUserRoute)
app.use("/api/member", memberRoute)
app.use("/api/auth", authRoute)
app.use("/api/category", categoryRoute)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

setupWebSocket(io)

server.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))