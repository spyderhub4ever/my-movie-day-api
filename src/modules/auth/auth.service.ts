import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../user/user.model";
import env from "../../config/env";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../config/jwt";

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

export const generateTokens = (user: IUser) => {
  const access_token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );

  const refresh_token = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { access_token, refresh_token };
};
