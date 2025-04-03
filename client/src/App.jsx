import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";  // ✅ No Router here
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "./store/auth-slice";

import AuthLayout from "./components/auth/layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingListing from "./pages/shopping-view/Listing";
import ShoppingAccount from "./pages/shopping-view/Account";
import UnAuth from "./pages/Unauth-page";
import CheckAuth from "./components/Common/Check-Auth";
import NotFound from "./pages/not-found";
import { Skeleton } from "./components/ui/skeleton";

function App() {
  const { user, isAuthenticated , isLoading} = useSelector(
    (state) => state.auth || {}   
  );

  // console.log(isAuthenticated, user, isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if(isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />

  }  

  return (
    <div className="flex flex-col overflow-hidden bg-yellow-50">
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
              <AuthLayout />
            </CheckAuth>         
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Shopping Routes */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        <Route path="/unauth-page" element={<UnAuth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
