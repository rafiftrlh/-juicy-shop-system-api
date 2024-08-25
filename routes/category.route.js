import express from "express"
import { getAllCategory, createCategory, getCategoryById } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/", getAllCategory)
router.get("/:id", getCategoryById)
router.post("/", createCategory)

export default router