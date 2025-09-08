import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../users/user.model";
import env from "../../config/env";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(user: IUser) {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(user: IUser) {
  return jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: "7d" });
}
