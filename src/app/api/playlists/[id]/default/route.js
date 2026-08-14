import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import jwt from "jsonwebtoken";

const getAuth = async (req) => {
  const session = await getServerSession(authOptions);
  if (session && session.user) return { email: session.user.email, role: session.user.role };
  
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.NEXTAUTH_SECRET || "mastmagan_super_secret_key");
      return { email: decoded.email, role: decoded.role };
    } catch (err) { return null; }
  }
  return null;
};

export async function POST(req, { params }) {
  try {
    const auth = await getAuth(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const decodedId = decodeURIComponent(id);

    // 1. Set all playlists to isDefault: false
    await Playlist.updateMany({}, { $set: { isDefault: false } });

    // 2. Set the requested playlist to isDefault: true
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: decodedId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedPlaylist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlaylist, { status: 200 });
  } catch (error) {
    console.error("Error setting default playlist:", error);
    return NextResponse.json({ error: "Failed to set default playlist" }, { status: 500 });
  }
}
