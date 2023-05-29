import mongoose, { Schema } from "mongoose";

const ghostPingSchema = new Schema({
  Guild: { type: String, required: true },
});

const ghostPingModel = mongoose.model("ghostPingSchema", ghostPingSchema);
export {ghostPingModel};
