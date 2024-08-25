import express from "express"
import { getAllCategory, createCategory, getCategoryById, updateCategory } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/", getAllCategory)
router.get("/:id", getCategoryById)
router.post("/", createCategory)
router.patch("/:id", updateCategory)


export default router