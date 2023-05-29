import mongoose, { Schema } from "mongoose";

const ghostPingNumSchema = new Schema({
  Guild: { type: String, required: true },
  User: { type: String, required: true },
  Number: { type: Number, required: true },
});

const ghostPingNumModel = mongoose.model("ghostPingNumSchema", ghostPingNumSchema);
export {ghostPingNumModel};
