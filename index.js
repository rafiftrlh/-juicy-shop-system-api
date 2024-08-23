import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import systemUserRoute from "./routes/system_user.route.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use("/api/system-user", systemUserRoute)

app.get('/', (req, res) => {
  res.send("Hello World!")
})

app.listen(PORT, () => console.log(`Server app listening on port ${PORT}!`))