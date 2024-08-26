import express from "express"
import { login, logout } from "../controllers/auth.controller.js"

const router = express.Router()

router.get("/login", login)
router.post("/logout", logout)

export default router