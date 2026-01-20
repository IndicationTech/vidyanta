import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  uploadPhoto,
  getAllStaff,
  deleteProfile,
} from "../controllers/profileController.js";
import { handlePhotoUpload } from "../middleware/upload.js";

const router = express.Router();

router.get("/all", getAllStaff);
router.post("/", createProfile);
router.get("/teacher/profile", getProfile); // This would use req.user.id in a real app with auth middleware
router.get("/:id", getProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);
router.post("/:id/photo", handlePhotoUpload, uploadPhoto);

export default router;
