import { Request, Response } from "express";
import UserModel from "../users/user.model";
import {
  comparePassword,
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await hashPassword(password);
    const user = await UserModel.create({ name, email, password: hashed });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isValid = await comparePassword(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
