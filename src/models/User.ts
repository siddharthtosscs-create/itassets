import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

// Avoid recompiling model in dev/hot-reload
export default models.User || model("User", UserSchema);
