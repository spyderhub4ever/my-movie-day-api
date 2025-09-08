import { Router } from "express";
import userRoutes from "../modules/users/user.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
