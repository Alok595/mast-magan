import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    
    // The user originally asked for custom playlists, but now wants to see the Dhun playlist too.
    // We will include all playlists in the leaderboard.
    const customPlaylists = await Playlist.find({}).lean();
    
    // Fetch users to map emails to names
    const users = await User.find({}, 'email name').lean();
    const userMap = {};
    users.forEach(u => {
      userMap[u.email] = u.name;
    });
    
    const mappedPlaylists = customPlaylists.map(p => {
      let creator = "Unknown";
      if (p.isDefault || p.ownerEmail === "admin@dhun.com") {
        creator = "Admin";
      } else if (p.ownerEmail) {
        creator = userMap[p.ownerEmail] || p.ownerEmail.split('@')[0];
      }

      return {
        ...p,
        creatorName: creator,
        _id: p._id.toString(),
        id: p.playlistId,
        likesCount: p.likes ? p.likes.length : 0,
        tracks: p.tracks.map(t => ({ ...t, _id: t._id.toString() }))
      };
    });

    return NextResponse.json(mappedPlaylists, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
