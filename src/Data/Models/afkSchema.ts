import mongoose, { Schema } from "mongoose";

const afkSchema = new Schema({
    User: { type: String, required: true },
    Guild: { type: String, required: true },
    Message: { type: String, required: true },
    Nickname: { type: String, required: true },
});

const afkModel = mongoose.model("afkSchema", afkSchema);
export {afkModel};
