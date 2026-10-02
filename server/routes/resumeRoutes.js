import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Resume route is working",
  });
});

// Resume analysis
router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResume
);

export default router;