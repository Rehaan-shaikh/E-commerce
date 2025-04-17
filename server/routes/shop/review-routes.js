// routes/shop/productReviewRoutes.js
import express from "express";
import {
  addProductReview,
  getProductReviews,
} from "../../controller/shop/products-review.js";

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

export default router;
