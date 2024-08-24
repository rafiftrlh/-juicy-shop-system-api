import express from "express"
import { getAllMember, getMemberById } from "../controllers/member.controller.js"

const router = express.Router()

router.get("/", getAllMember)
router.get("/:id", getMemberById)

export default router