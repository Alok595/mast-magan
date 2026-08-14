import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const playlists = await Playlist.find({}).lean();
    const mappedPlaylists = playlists.map(p => ({
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

export async function POST(req) {
  try {
    let authEmail = null;

    // 1. Check Web Session
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      authEmail = session.user.email;
    }

    // 2. Check Mobile JWT
    if (!authEmail) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          const secret = process.env.NEXTAUTH_SECRET || "mastmagan_super_secret_key";
          const decoded = jwt.verify(token, secret);
          authEmail = decoded.email;
        } catch (err) {
          // invalid token
        }
      }
    }

    if (!authEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    // Assign the owner email from auth
    data.ownerEmail = authEmail;
    
    
    const newPlaylist = await Playlist.create(data);
    return NextResponse.json(newPlaylist, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
