import mongoose, { Schema } from "mongoose";

const ecoSchema = new Schema({
    User: { type: String, required: true },
    Guild: { type: String, required: true },
    Bank: { type: Number, required: true },
    Wallet: { type: Number, required: true },
    lastStargaze: { type: Date, required: true, default: 0},
});

const ecoModel = mongoose.model("ecoSchema", ecoSchema);
export {ecoModel};
