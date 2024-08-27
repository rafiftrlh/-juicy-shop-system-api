import express from "express"
import multer from "multer"
import { createJuice } from "../controllers/juice.controller.js"

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post("/", upload.single('image'), createJuice)

export default router