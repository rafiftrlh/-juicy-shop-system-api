import express from "express"
import { getAllCategory, createCategory } from "../controllers/category.controller.js"

const router = express.Router()

router.get("/", getAllCategory)
router.post("/", createCategory)

export default router