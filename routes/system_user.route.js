import express from "express"
import { getAllSystemUser } from "../controllers/system_user.controller.js"

const router = express.Router()

router.get("/", getAllSystemUser)
// router.get("/get-all-staff", getAllStaff)
// router.get("/:id", getSystemUser)
// router.post("/", createStaff)
// router.patch("/:id", updateStaff)
// router.patch("/soft-delete/:id", softDeleteStaff)
// router.patch("/restore/:id", restoreStaff)
// router.delete("/force-delete/:id", forceDeleteStaff)

export default router
