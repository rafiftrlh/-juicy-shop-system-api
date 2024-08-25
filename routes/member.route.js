import express from "express"
import { getAllMember, getMemberById, createMember, updateMember, deleteMember } from "../controllers/member.controller.js"

const router = express.Router()

router.get("/", getAllMember)
router.get("/:id", getMemberById)
router.post("/", createMember)
router.patch("/:id", updateMember)
router.delete("/:id", deleteMember)

export default router