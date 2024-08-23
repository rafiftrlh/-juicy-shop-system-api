import express from "express"
import { createStaff, forceDeleteStaff, getAllStaff, getAllSystemUser, getSystemUserById, restoreStaff, softDeleteStaff, updateStaff } from "../controllers/system_user.controller.js"

const router = express.Router()

router.get("/", getAllSystemUser)
router.get("/get-all-staff", getAllStaff)
router.get("/:id", getSystemUserById)
router.post("/", createStaff)
router.patch("/:id", updateStaff)
router.patch("/soft-delete/:id", softDeleteStaff)
router.patch("/restore/:id", restoreStaff)
router.delete("/force-delete/:id", forceDeleteStaff)

export default router
