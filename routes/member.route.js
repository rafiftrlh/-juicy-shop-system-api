import express from "express"
import { getAllMember } from "../controllers/member.controller.js"

const router = express.Router()

router.get("/", getAllMember)

export default router