import express from "express";
import handleImageUpload, { addProduct , editProduct , fetchAllProducts , deleteProduct } from "../../controller/admin/products-controller.js";
import { upload } from "../../helpers/cloudinary.js";

const router = express.Router();

//the data in my_file is the name of the file we are sending from the frontend to the backend in function uploadImageToCloudinary in imageUpload.jsx
router.post("/upload-image", upload.single("my_file"), handleImageUpload); //here we send the my_file to handleimageupload to convert it into url
//my_file is name of html

router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

export default router;
