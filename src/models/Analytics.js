import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // 'site_visits'
  count: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
