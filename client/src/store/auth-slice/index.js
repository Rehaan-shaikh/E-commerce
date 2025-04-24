/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token:null
};

// The registerUser (createAsyncThunk) function is triggered when you dispatch it from your React component.
// and allows method like Pending (fetchUser.pending) Fulfilled (fetchUser.fulfilled)  Rejected (fetchUser.rejected)
// createAsyncThunk is a function from Redux Toolkit that allows you to handle asynchronous operations
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
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
  // u dont have to necessaarily pass thijs path
  async (formData , { rejectWithValue }) => {
    try{
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/login`,
      formData,
      {
        withCredentials: true,
      }
    );
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
      `${import.meta.env.VITE_API_URL}/api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// checkAuth is automatically get called when refresh beacuse of useEffect in the app.jsx
// export const checkAuth = createAsyncThunk(
//   "/auth/checkauth",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/user/check-auth`,
//         {
//           withCredentials: true,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("CheckAuth Error:", error);
//       return rejectWithValue(error.response?.data || "Auth failed");
//     }
//   }
// );

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (token, { rejectWithValue }) => {
    try {
      console.log(token , "token from check-auth")   // consoling as null
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/check-auth`,
        {        
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": 
            "no-cache, no-store, must-revalidate , proxy-revalidate",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("CheckAuth Error:", error);
      return rejectWithValue(error.response?.data || "Auth failed");
    }
  }
);


// he authSlice is a slice of the Redux store that manages the state related to authentication in this application
const authSlice = createSlice({
  name: "auth",  //name of the slice
  initialState,  //this 2 parameters are part of slice syntax(initialState and name)

  reducers: {
    setUser: (state, action) => {},
    resetToken: (state) => {
      state.token = null;
      state.isAuthenticated = false; 
      state.user = null; 
    }
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
        console.log(action , "action");
        state.isLoading = false;
        state.user = action.payload.status==200? action.payload.data : null;
        // console.log(state.user , "Login fulfilled")
        state.isAuthenticated = action.payload.status==200;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
        console.log(action.payload.token , "token from login")
        // console.log(state.isAuthenticated , "boolean")
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;    
        state.isAuthenticated = true;  
        console.log(action,"chechkauth")      
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

export const { setUser , resetToken } = authSlice.actions;
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
