import dbConnect from "@/lib/mongodb";
import Playlist from "@/models/Playlist";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const userEmail = session.user.email;

    const playlist = await Playlist.findOne({ playlistId: id });
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (!playlist.likes) {
      playlist.likes = [];
    }
    
    const hasLiked = playlist.likes.includes(userEmail);

    if (hasLiked) {
      // Unlike
      playlist.likes = playlist.likes.filter((email) => email !== userEmail);
    } else {
      // Like
      playlist.likes.push(userEmail);
    }

    playlist.markModified('likes');
    await playlist.save();

    return NextResponse.json({ 
      success: true, 
      likesCount: playlist.likes.length,
      hasLiked: !hasLiked 
    }, { status: 200 });

  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
