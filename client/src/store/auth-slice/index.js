/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// The registerUser (createAsyncThunk) function is triggered when you dispatch it from your React component.
// and allows method like Pending (fetchUser.pending) Fulfilled (fetchUser.fulfilled)  Rejected (fetchUser.rejected)
// createAsyncThunk is a function from Redux Toolkit that allows you to handle asynchronous operations
export const registerUser = createAsyncThunk(
  "/auth/register",
  // u dont have to necessaarily pass this path
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/register",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      // Use rejectWithValue to return the error response data
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData , { rejectWithValue }) => {
    try{
    const response = await axios.post(
      "http://localhost:3000/api/user/login",
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(response.data , "response data")
    return response.data;
  }catch(error){
    return rejectWithValue(error.response.data);
  }
 }
);



export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      "http://localhost:3000/api/user/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// checkAuth is automatically get called when refresh beacuse of useEffect in the app.jsx
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/check-auth",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("CheckAuth Error:", error);
      return rejectWithValue(error.response?.data || "Auth failed");
    }
  }
);


// This authSlice is a name of a slice of the Redux store that manages the state related to authentication in this application
const authSlice = createSlice({
  name: "auth",  //name of the slice
  initialState,  //this 2 parameters are part of slice syntax(initialState and name)

  reducers: {
    setUser: (state, action) => {},  //setUser can be any name which is a reducer function that updates the user state in the Redux store.
  },

  // extraReducers is where you handle asynchronous actions (like API calls) that are defined outside the slice.
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state , action) => {
        // console.log(action);
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Log the error message from the backend
        console.error("Register Error:", action.payload?.message || "Registration failed");
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log(action , "action");

        state.isLoading = false;
        state.user = action.payload.status==200? action.payload.data : null;
        // console.log(state.user , "Login fulfilled")
        state.isAuthenticated = action.payload.status==200;

        // console.log(state.isAuthenticated , "boolean")
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;    
        state.isAuthenticated = true;      
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;       
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;







// //reducer ex
// const initialState = {
//   count: 0,
// };
// const counterReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "INCREMENT":
//       return { ...state, count: state.count + 1 }; // Increase count by 1.
//     case "DECREMENT":
//       return { ...state, count: state.count - 1 }; // Decrease count by 1.
//     case "RESET":
//       return { ...state, count: 0 }; // Reset count to 0.
//     default:
//       return state; // If the action is unknown, return the current state.
//   }
// };
