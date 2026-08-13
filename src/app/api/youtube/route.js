import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // 1. Fetch official metadata (Title, Author) using oEmbed
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    let title = "";
    let author = "";
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      title = oembedData.title || "";
      author = oembedData.author_name || "";
    }

    // 2. Fetch the YouTube HTML to scrape duration (lengthSeconds)
    let duration = "3:00"; // fallback
    try {
      const htmlRes = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        // Look for "lengthSeconds":"123"
        const match = html.match(/"lengthSeconds":"(\d+)"/);
        if (match && match[1]) {
          const totalSeconds = parseInt(match[1], 10);
          const m = Math.floor(totalSeconds / 60);
          const s = totalSeconds % 60;
          duration = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
      }
    } catch (e) {
      console.error("Failed to scrape duration:", e);
    }

    if (!title && !author) {
      return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 404 });
    }

    return NextResponse.json({
      title,
      author,
      duration
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
