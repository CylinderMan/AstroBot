import mongoose, { Schema } from "mongoose";

const levelSchema = new Schema({
  Guild: { type: String, required: true },
  User: { type: String, required: true },
  XP: { type: Number, required: true },
  Level: { type: Number, required: true },
});

const levelModel = mongoose.model("levelSchema", levelSchema);
export {levelModel};
