import express from "express";
import handleImageUpload from "../../controller/admin/products-controller.js";
import { upload } from "../../helpers/cloudinary.js";


const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload); //here we send the file convert into url at handleimageupload
//my_file is name of html
export default router;