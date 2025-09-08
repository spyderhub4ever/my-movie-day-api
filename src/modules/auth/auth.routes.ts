import { Response, Router } from "express";
import { login, register } from "./auth.controller";
import { authMiddleware, AuthRequest } from "./auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
