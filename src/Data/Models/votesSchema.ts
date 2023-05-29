import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema({
  Guild: { type: String, required: true },
  Msg: { type: String, required: true },
  UpMembers: { type: Array, required: true },
  DownMembers: { type: Array, required: true },
  UpVote: { type: Number, required: true },
  DownVote: { type: Number, required: true },
  Owner: { type: String, required: true },
});

const voteModel = mongoose.model("voteSchema", voteSchema);
export {voteModel};
