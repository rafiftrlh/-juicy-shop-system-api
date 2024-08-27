import express from "express"
import { createInventory } from "../controllers/inventory.controller.js"

const router = express.Router()

router.post("/", createInventory)

export default router