import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const playlists = await Playlist.find({}).lean();
    const mappedPlaylists = playlists.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p.playlistId,
      tracks: p.tracks.map(t => ({ ...t, _id: t._id.toString() }))
    }));
    return NextResponse.json(mappedPlaylists, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    // Assign the owner email from session if available, else trust data
    const finalEmail = session?.user?.email || data.ownerEmail;
    if (finalEmail) {
      data.ownerEmail = finalEmail;
    } else {
      delete data.ownerEmail; // Let Mongoose use the default
    }
    
    const newPlaylist = await Playlist.create(data);
    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
