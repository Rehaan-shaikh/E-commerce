// import { Button } from "./components/ui/button"
import React from "react"
import {Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import AdminHeader from "./components/admin-view/Header";
import AdminSidebar from "./components/admin-view/Sidebar";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminProducts from "./pages/admin-view/products";
import ShoppingHeader from "./components/shopping-view/Header";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingListing from "./pages/shopping-view/Listing";
import ShoppingAccount from "./pages/shopping-view/Account";
import UnAuth from "./pages/Unauth-page";
import CheckAuth from "./components/Common/Check-Auth";

function App() {
  //Dummy   data
  const isAuthenticated = false;
  const user = null;
  return (
    <div className="flex flex-col overflow-hidden bg-yellow-50">
      {/* Common compponents */}
      <h1>Header of app</h1>

      <Routes>
        <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout/></CheckAuth>}>
             <Route path="login" element={<Login/>}/>
             <Route path="register" element={<Register/>}/>
        </Route>
        
        <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout/></CheckAuth>}>
             <Route path="dashboard" element={<AdminDashboard/>}/>
             <Route path="orders" element={<AdminOrders/>}/>
             <Route path="features" element={<AdminFeatures/>}/>
             <Route path="products" element={<AdminProducts/>}/>
        </Route>
        
        <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}>
             <Route path="home" element={<ShoppingHome />}/>
             <Route path="checkout" element={<ShoppingCheckout />}/>
             <Route path="listing" element={<ShoppingListing />}/>
             <Route path="account" element={<ShoppingAccount />}/>
        </Route>

        <Route path="/unauth-page" element={<UnAuth />}></Route>

        <Route path="*" element={<NotFound/>}></Route>

      </Routes>
    </div>
  )
}  

export default App;
