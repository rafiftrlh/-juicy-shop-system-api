import express from "express"
import session from "express-session"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"

import setupWebSocket from "./services/websocket.js"

import systemUserRoute from "./routes/system_user.route.js"
import memberRoute from "./routes/member.route.js"
import authRoute from "./routes/auth.route.js"
import categoryRoute from "./routes/category.route.js"
import juiceRoute from "./routes/juice.route.js"
import juiceIngredientRoute from "./routes/juice_ingredient.route.js"
import inventoryRoute from "./routes/inventory.route.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use("/api/system-user", express.json(), systemUserRoute)
app.use("/api/member", express.json(), memberRoute)
app.use("/api/auth", express.json(), authRoute)
app.use("/api/category", express.json(), categoryRoute)
app.use("/api/juice", juiceRoute)
app.use("/api/juice-ingredient", express.json(), juiceIngredientRoute)
app.use("/api/inventory", express.json(), inventoryRoute)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

setupWebSocket(io)

server.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))