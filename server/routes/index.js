import { Router } from "express";
import UserRoutes from "./userRoutes.js";

const router = Router();


// * For user Routes
router.use("/api/user/register", UserRoutes);


export default router;