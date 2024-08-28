import express from "express"
import { createJuiceIngredient } from "../controllers/juice_ingredient.controller.js"

const router = express.Router()

router.post("/", createJuiceIngredient)

export default router