import mongoose, { Schema } from "mongoose";

const warnSchema = new Schema({
  GuildID: { type: String, required: true },
  UserID: { type: String, required: true },
  UserTag: { type: String, required: true },
  Content: { type: Array, required: true },
});

const warnModel = mongoose.model("warnSchema", warnSchema);
export {warnModel};
