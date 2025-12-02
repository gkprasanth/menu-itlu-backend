import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: 'AKIARU7GPCYC7FUUID3N',
    secretAccessKey: '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',
  },
  forcePathStyle: false, // Use virtual-hosted-style URLs
  useAccelerateEndpoint: false,
});

// Configure Multer to upload directly to S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'itlu-menu2',
    // acl: 'public-read', 
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `menu-items/${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export { s3Client, upload };
