import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel from "../user/user.model";
import { comparePassword, hashPassword, generateTokens } from "./auth.service";
import { JWT_REFRESH_SECRET } from "../../config/jwt";
import { uploadToCloudinary } from "../../services/cloudinary";

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

    if (!user)
      return res.status(400).json({ message: "You are not a valid user." });

    const isValid = await comparePassword(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: "Incorrect Password" });

    const { access_token, refresh_token } = generateTokens(user);

    console.log(refresh_token);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token, refresh_token, user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { access_token, refresh_token } = generateTokens(user);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ access_token });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { name, email, password, image } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path, {
        folder: "user_profiles",
        width: 500,
        height: 500,
      });
      updateData.image = imageUrl;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
