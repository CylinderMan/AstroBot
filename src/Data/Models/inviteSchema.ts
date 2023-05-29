import mongoose, { Schema } from "mongoose";

const inviteSchema = new Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
});

const inviteModel = mongoose.model("inviteSchema", inviteSchema);
export {inviteModel};
