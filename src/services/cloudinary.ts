import { v2 as cloudinary } from "cloudinary";
import env from "../config/env";
import multer from "multer";
import fs from "fs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const upload = multer({ dest: "uploads/" });

type UploadOptions = {
  folder?: string;
  width?: number;
  height?: number;
  crop?: "limit" | "fill" | "fit" | "scale";
};

export const uploadToCloudinary = async (
  filePath: string,
  options: UploadOptions = {}
) => {
  const {
    folder = "default_uploads",
    width = 1000,
    height = 1000,
    crop = "limit",
  } = options;

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    transformation: [{ width, height, crop }],
  });

  fs.unlinkSync(filePath);

  return result.secure_url;
};
