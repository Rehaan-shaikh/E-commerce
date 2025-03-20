import { Router } from "express";
import {RegisterUser} from "../Controller/userController.js"
//all of this r functions

const router = Router();

router.post("/",RegisterUser);


export default router;