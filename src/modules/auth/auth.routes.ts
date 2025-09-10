import { Router } from "express";
import { login, me, refresh, register } from "./auth.controller";
import validate from "../../middlewares/validate";
import { loginSchema, registerSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/auth";

const router = Router();

// NON - AUTHENTICATED
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);

// AUTHENTICATED
router.get("/me", authenticate, me);

export default router;
