import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';
// cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    // delete local file after uploading
    fs.unlink(path, (err) => {
      if (err) {
        console.log('Error Deleting File', err);
      } else {
        console.log('Local File Deleted Successfully');
      }
    });
    console.log('Upload successful and local file deleted:', uploadResult);
    return uploadResult;
  } catch (err: any) {
    console.error('Upload failed:', err);
    return err;
  }
};

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/src/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
