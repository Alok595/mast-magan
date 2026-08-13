import dbConnect from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    const result = await Analytics.findOneAndUpdate(
      { type: "site_visits" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
