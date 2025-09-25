import mongoose from "mongoose";
import { RELATION } from "../constants/relationships";

const familyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    relation: {
      type: String,
      enum: RELATION,
      default: "other",
    },
    age: { type: Number },
    email: { type: String },
    phone: { type: String },
    needs: [{ type: String }], // e.g. ["learning-impairment", "substance-use"]
    isPrimaryContact: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName:{ type:String ,required: true },
    lastName: String,
    email: { type: String, unique: true ,required: true },
    phone: { type: String },
    passwordHash: { type: String, required: true }, // store hashed password
    dateOfBirth: Date,
    // role: { type: String, enum: ["user", "admin"], default: "user" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    family: [familyMemberSchema],
    familyId: { type: String, unique: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
