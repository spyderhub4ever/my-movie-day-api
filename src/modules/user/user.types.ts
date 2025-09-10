export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  created_at?: Date;
  updated_at?: Date;
}
