import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dfhxh3eam",
  api_key: "561741923486594",
  api_secret: "O_XnwOZIy0Z6jaP62PhM8l_ypEM",
});

const storage = multer.memoryStorage();//Multer is a Node.js middleware used for handling multipart/form-data, which is primarily used for uploading files.
const upload = multer({ storage });

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  
  return result;
}

export { upload, imageUploadUtil };
