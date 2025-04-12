import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    // console.log(filterParams, sortParams, "filter and sort params from redux");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      
      // the above 2 lines can be replaced with the below lines for understanding of what is happening
      // {
      //   category: ['men', 'women'],
      //   brand: ['h&m', 'adidas'],
      //   sortBy: 'price-hightolow'
      // }
      // now URLSearchParams will convert this object to a query string like this:
      // category=men,women&brand=h&m,adidas&sortBy=price-hightolow
    });
    // console.log(query, "query params from redux");

    const result = await axios.get(
      `http://localhost:3000/api/shop/products/get?${query}`
    );

    // console.log(result);

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;