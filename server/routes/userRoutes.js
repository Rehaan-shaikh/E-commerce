import { Router } from "express";
import {LoginUser, RegisterUser,LogoutUser,CheckAuth } from "../controller/userController.js"
//all of this r functions

const router = Router();

router.post("/register",RegisterUser);
router.post("/login",LoginUser);
router.post("/logout",LogoutUser);
router.get("/check-auth", CheckAuth); 


export default router;