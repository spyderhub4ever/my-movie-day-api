import { Router } from "express";
import {
  login,
  getProfile,
  refresh,
  register,
  updateProfile,
} from "./auth.controller";
import validate from "../../middlewares/validate";
import { loginSchema, registerSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/auth";
import { upload } from "../../services/cloudinary";

const router = Router();

// NON - AUTHENTICATED
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);

// AUTHENTICATED
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, upload.single("image"), updateProfile);

export default router;
