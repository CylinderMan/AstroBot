import mongoose, { Schema } from "mongoose";

const stickSchema = new Schema({
  Message: { type: String, required: true },
  ChannelID: { type: String, required: true },
  LastMessage: { type: String, required: false },
  LastMessageID: { type: String, required: true },
  MaxCount: { type: Number, default: 6, required: true },
  CurrentCount: { type: Number, default: 0, required: true },
});

const stickyModel = mongoose.model("stickSchema", stickSchema);
export {stickyModel};
