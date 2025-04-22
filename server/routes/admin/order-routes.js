import express from "express";
// import handleImageUpload, { addProduct , editProduct , fetchAllProducts , deleteProduct } from "../../controller/admin/products-controller.js";
import { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus } from "../../controller/admin/order-controller.js";
const router = express.Router();


router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

export default router;
