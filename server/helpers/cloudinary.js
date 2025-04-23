import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();//Multer is a Node.js middleware used for handling multipart/form-data, which is primarily used for uploading files.
const upload = multer({ storage });

async function imageUploadUtil(file) {  //file is the url of image which we get from handleimageupload function
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  
  return result;
}

export { upload, imageUploadUtil };
