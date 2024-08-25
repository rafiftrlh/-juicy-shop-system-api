import express from "express"
import { getAllCategory, createCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/", getAllCategory)
router.get("/:id", getCategoryById)
router.post("/", createCategory)
router.patch("/:id", updateCategory)
router.delete("/:id", deleteCategory)


export default router