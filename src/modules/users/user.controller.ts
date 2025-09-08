import { Request, Response } from "express";
import * as userService from "./user.service";

export async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const updatedUser = await userService.updateUser(id, req.body);
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await userService.deleteUser(id);
  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
}
