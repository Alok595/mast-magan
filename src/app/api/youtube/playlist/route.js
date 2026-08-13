import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YOUTUBE_API_KEY is not configured in .env.local" }, { status: 500 });
  }

  try {
    // Extract playlist ID from URL
    const urlObj = new URL(url);
    const playlistId = urlObj.searchParams.get("list");

    if (!playlistId) {
      return NextResponse.json({ error: "Invalid YouTube Playlist URL" }, { status: 400 });
    }

    // 1. Fetch Playlist Info (Title, Cover)
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`);
    const playlistData = await playlistRes.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }
    
    const snippet = playlistData.items[0].snippet;
    const title = snippet.title;
    const description = snippet.description || "Imported Playlist";
    const cover = snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || "";

    // 2. Fetch Playlist Items (Videos)
    const itemsRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
    const itemsData = await itemsRes.json();

    if (!itemsData.items) {
      return NextResponse.json({ error: "No videos found in playlist" }, { status: 404 });
    }

    const videoIds = itemsData.items.map(item => item.contentDetails.videoId);

    // 3. Fetch Video Durations
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${apiKey}`);
    const videosData = await videosRes.json();

    const durationMap = {};
    if (videosData.items) {
      videosData.items.forEach(v => {
        // Parse ISO 8601 duration e.g. PT4M13S
        const iso = v.contentDetails.duration;
        const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const h = parseInt(match[1] || 0);
          const m = parseInt(match[2] || 0);
          const s = parseInt(match[3] || 0);
          
          let durationStr = "";
          if (h > 0) durationStr += `${h}:`;
          durationStr += `${h > 0 && m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
          durationMap[v.id] = durationStr;
        } else {
          durationMap[v.id] = "0:00";
        }
      });
    }

    // 4. Map into TrackSchema format
    const tracks = itemsData.items.map(item => {
      const vid = item.contentDetails.videoId;
      return {
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle || "Unknown Artist",
        videoId: vid,
        duration: durationMap[vid] || "3:00"
      };
    }).filter(t => t.title !== "Private video" && t.title !== "Deleted video");

    return NextResponse.json({
      title,
      description,
      cover,
      tracks
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
