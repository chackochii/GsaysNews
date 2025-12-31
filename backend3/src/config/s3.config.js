import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

/**
 * -----------------------------
 * DigitalOcean Spaces S3 Client
 * -----------------------------
 */
const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION, // sgp1
  endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

/**
 * -----------------------------
 * Multer Upload Configuration
 * -----------------------------
 */
export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.DO_SPACES_BUCKET!, // gsaysbucket-images

    // Make images publicly viewable
    acl: 'public-read',

    // Automatically set correct MIME type
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      // Safe, non-guessable filename
      const ext = path.extname(file.originalname).toLowerCase();
      const fileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

      // Store under a folder
      cb(null, `news/${fileName}`);
    },
  }),

  // Max file size: 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // Strict image validation
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPG, PNG, and WEBP images are allowed.'
        ),
        false
      );
    }
  },
});

/**
 * -----------------------------
 * Helper: Build Public CDN URL
 * -----------------------------
 * Use this when saving image URL to DB
 */
export const getPublicImageUrl = (key: string): string => {
  return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`;
};
