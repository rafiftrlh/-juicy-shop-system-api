import express from "express"
import { createInventory, deleteInventory } from "../controllers/inventory.controller.js"

const router = express.Router()

router.post("/", createInventory)
router.delete("/:id", deleteInventory)

export default router