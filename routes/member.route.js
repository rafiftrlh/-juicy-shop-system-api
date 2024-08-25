import express from "express"
import { getAllMember, getMemberById, createMember, updateMember } from "../controllers/member.controller.js"

const router = express.Router()

router.get("/", getAllMember)
router.get("/:id", getMemberById)
router.post("/", createMember)
router.patch("/:id", updateMember)

export default router