import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { playlistId } = await req.json();
    
    if (!playlistId) {
      return NextResponse.json({ error: "playlistId is required" }, { status: 400 });
    }

    const result = await Playlist.findOneAndUpdate(
      { playlistId },
      { $inc: { playCount: 1 } },
      { new: true }
    );
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
