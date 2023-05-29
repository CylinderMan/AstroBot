import mongoose, { Schema } from "mongoose";

const remindSchema = new Schema({
  User: { type: String, required: true },
  Time: { type: String, required: true },
  Remind: { type: String, required: true },
  Channel: { type: String, required: true },
});

const remindModel = mongoose.model("remindSchema", remindSchema);
export {remindModel};
