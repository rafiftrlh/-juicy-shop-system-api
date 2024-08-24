import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

import setupWebSocket from "./services/websocket"

import systemUserRoute from "./routes/system_user.route.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use("/api/system-user", systemUserRoute)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

setupWebSocket(io)

server.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))