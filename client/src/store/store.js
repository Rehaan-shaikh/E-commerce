import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/product-slice";
import shoppingProductSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shoppingProductSlice, 
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
  },
});

export default store;
