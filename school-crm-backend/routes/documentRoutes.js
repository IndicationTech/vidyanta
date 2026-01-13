import express from "express";
import {
  uploadDoc,
  getDocs,
  deleteDoc,
} from "../controllers/documentController.js";
import { uploadDocument } from "../middleware/upload.js";

const router = express.Router();

router.post("/:id", uploadDocument, uploadDoc);
router.get("/:id", getDocs);
router.delete("/:docId", deleteDoc);

export default router;
