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
      const decoded = jwt.verify(authHeader.split(" ")[1], process.env.NEXTAUTH_SECRET || "dhun_super_secret_key");
      return { email: decoded.email, role: decoded.role };
    } catch (err) { return null; }
  }
  return null;
};

export async function DELETE(req, { params }) {
  try {
    const auth = await getAuth(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (playlist.ownerEmail !== auth.email && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Playlist.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Playlist deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await getAuth(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    if (playlist.ownerEmail !== auth.email && auth.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    
    // Find by _id and update
    const result = await Playlist.findByIdAndUpdate(id, data, { new: true });
    
    if (!result) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
