import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    
    // The user originally asked for custom playlists, but now wants to see the Mast Magan playlist too.
    // We will include all playlists in the leaderboard.
    const customPlaylists = await Playlist.find({}).lean();
    
    // Mongoose doesn't easily sort by array length in a standard find() query without aggregation.
    // Since this is a simple leaderboard, we can sort them in memory or use aggregation.
    // Given the potential size, aggregation is better, but since it's a small app, in memory is fine for now.
    
    // Let's use standard JS sort to allow frontend to easily switch tabs without fetching again,
    // or we can return them all and let frontend sort, but let's pre-calculate.
    
    const mappedPlaylists = customPlaylists.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p.playlistId,
      likesCount: p.likes ? p.likes.length : 0,
      tracks: p.tracks.map(t => ({ ...t, _id: t._id.toString() }))
    }));

    return NextResponse.json(mappedPlaylists, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
