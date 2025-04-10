import express from "express";
import { getFilteredProducts} from "../../controller/shop/products-controller.js";

const router = express.Router();


router.get("/get", getFilteredProducts);

export default router;
