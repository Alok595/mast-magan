import dbConnect from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import Playlist from "@/models/Playlist";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const siteVisits = await Analytics.findOne({ type: "site_visits" });
    const playlists = await Playlist.find({}, 'title playCount ownerEmail').sort({ playCount: -1 });
    const users = await User.find({}).lean();

    return NextResponse.json({
      siteVisits: siteVisits ? siteVisits.count : 0,
      playlists: playlists,
      users: users
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
