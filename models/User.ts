import mongoose from "mongoose";
import { UserType } from "../types";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: UserType, required: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  about: { type: String, require: true },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
