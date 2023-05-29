import mongoose, { Schema } from "mongoose";

const countSchema = new Schema({
  Guild: { type: String, required: true },
  Channel: { type: String, required: true },
  Count: { type: Number, required: true },
});

const countModel = mongoose.model("countSchema", countSchema);
export {countModel};
