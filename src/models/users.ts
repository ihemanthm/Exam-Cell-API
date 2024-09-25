import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/serverConfig";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Users extends Document, User {
  comparePassword(inputPassword: string): Promise<boolean>;
  genJWT(): string;
}

const userSchema: Schema<Users> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);
userSchema.pre<Users>("save", async function (next) {
  const user = this as Users;
  if (!user.isModified("password")) return next();
  const SALT: string = await bcrypt.genSalt(9);
  const encryptedPassword = bcrypt.hashSync(user.password, SALT);
  user.password = encryptedPassword;
  next();
});

userSchema.methods.comparePassword = function (inputPassword: string) {
  return bcrypt.compareSync(inputPassword, this.password);
};

userSchema.methods.genJWT = function (): string {
  if (!JWT_KEY) {
    return "JWT_NOT_FOUND";
  }
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
};

const Users = mongoose.model<Users>("Users", userSchema);
export default Users;
