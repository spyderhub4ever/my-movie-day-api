import UserModel from "./user.model";
import { IUser } from "./user.types";

export async function getAllUsers() {
  return UserModel.find();
}

export async function getUserById(id: string) {
  return UserModel.findById(id);
}

export async function createUser(data: IUser) {
  const user = new UserModel(data);
  return user.save();
}

export async function updateUser(id: string, data: Partial<IUser>) {
  return UserModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteUser(id: string) {
  return UserModel.findByIdAndDelete(id);
}
