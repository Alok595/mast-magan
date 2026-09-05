import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  videoId: { type: String, required: true },
  duration: { type: String, default: "4:00" }
});

const PlaylistSchema = new mongoose.Schema({
  playlistId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  backgroundMedia: { type: String, default: "" },
  ownerEmail: { type: String, default: "admin@dhun.com" },
  tracks: [TrackSchema],
  playCount: { type: Number, default: 0 },
  likes: [{ type: String }],
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

if (mongoose.models.Playlist) {
  delete mongoose.models.Playlist;
}

export default mongoose.model("Playlist", PlaylistSchema);
