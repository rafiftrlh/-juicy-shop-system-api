import express from "express"
import { getAllMember, getMemberById, createMember } from "../controllers/member.controller.js"

const router = express.Router()

router.get("/", getAllMember)
router.get("/:id", getMemberById)
router.post("/", createMember)

export default router