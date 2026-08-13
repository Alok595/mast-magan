import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import Analytics from "@/models/Analytics";
import { playlists } from "@/data/playlists";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing
    await Playlist.deleteMany({});
    await Analytics.deleteMany({});

    // Seed analytics
    await Analytics.create({ type: "site_visits", count: 0 });

    // Seed playlists
    const dbPlaylists = playlists.map(p => ({
      playlistId: p.id,
      title: p.title,
      description: p.description,
      cover: p.cover,
      tracks: p.tracks,
      playCount: 0
    }));

    await Playlist.insertMany(dbPlaylists);

    return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
