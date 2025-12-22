// config/s3.config.js
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import path from "path";

import dotenv from 'dotenv';

dotenv.config();

// GCP automatically uses the VM service account
const storage = new Storage();

// Your GCS bucket name
const bucketName = process.env.GCS_BUCKET_NAME || "gsaybucket";
const bucket = storage.bucket(bucketName);

// Multer memory storage (file kept in memory before upload)
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload handler
const uploadToGCS = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileName = `news/${Date.now()}-${req.file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", async () => {
  // Assign GCS URL
  req.file.gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  req.file.gcsPath = fileName;

  // Optional: try to make public, but don't crash on failure
  try {
    await blob.makePublic();
  } catch (err) {
    console.warn("Could not make file public:", err.message);
  }

  next();
});


  blobStream.end(req.file.buffer);
};

export { multerUpload, uploadToGCS };
