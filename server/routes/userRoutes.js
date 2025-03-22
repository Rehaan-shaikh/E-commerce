import { Router } from "express";
import {LoginUser, RegisterUser} from "../Controller/userController.js"
//all of this r functions

const router = Router();

router.post("/register",RegisterUser);
router.post("/login",LoginUser);


export default router;