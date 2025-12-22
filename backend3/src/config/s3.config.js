// config/s3.config.js
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || "gsaybucket";
const bucket = storage.bucket(bucketName);

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

const uploadToGCS = async (req, res, next) => {
  if (!req.file) return next();

  const fileName = `news/${Date.now()}-${req.file.originalname}`;
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  blobStream.on("error", (err) => next(err));

  blobStream.on("finish", () => {
    // Assign public URL and path for DB/storage
    req.file.gcsUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    req.file.gcsPath = fileName;

    // No need to makePublic() with UBLA enabled
    console.log("File uploaded successfully:", req.file.gcsUrl);

    next();
  });

  blobStream.end(req.file.buffer);
};

export { multerUpload, uploadToGCS };
