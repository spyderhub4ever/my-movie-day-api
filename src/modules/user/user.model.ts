import mongoose, { Schema, InferSchemaType, Model, Document } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

type UserSchemaType = InferSchemaType<typeof UserSchema>;

interface IUser extends UserSchemaType, Document {}

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
export type { IUser };
