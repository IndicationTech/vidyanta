import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/documents");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadDocument = multer({
  storage,
  limits: {
    fileSize: 10 * 1024, // ✅ 10 KB limit
  },
}).single("document");

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, "profile-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadPhoto = multer({
  storage: photoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image uploads are allowed"));
    }
  },
}).single("photo");

// Error handling wrapper for photo upload
export const handlePhotoUpload = (req, res, next) => {
  uploadPhoto(req, res, (err) => {
    if (err) {
      console.error("❌ Multer/Cloudinary upload error:", err);
      return res.status(400).json({
        message: err.message || "File upload failed",
        error: err.toString(),
      });
    }
    next();
  });
};

export { uploadDocument, uploadPhoto };
