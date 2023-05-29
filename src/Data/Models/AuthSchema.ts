import mongoose, { Schema } from "mongoose";

const authSchema = new Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Role: { type: String, required: true },
});

const authModel = mongoose.model("authSchema", authSchema);
export {authModel};
