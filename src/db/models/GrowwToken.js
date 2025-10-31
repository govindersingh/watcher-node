import mongoose from "mongoose";

const GrowwTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  tokenRefId: { type: String },
  sessionName: { type: String },
  expiry: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});


export const GrowwToken = mongoose.model("GrowwToken", GrowwTokenSchema);
export default GrowwToken;