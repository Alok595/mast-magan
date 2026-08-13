const https = require('https');
const fs = require('fs');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function test() {
  try {
    const html = await fetchHTML("https://www.youtube.com/playlist?list=PLw-VjHDlEOgs658kAHR_LAaILBXb-sILT");
    let match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
    if (!match) {
        match = html.match(/window\["ytInitialData"\] = (\{.*?\});/);
    }
    if (!match) {
      console.log("ytInitialData not found");
      return;
    }
    const data = JSON.parse(match[1]);
    
    // Scrape generic way
    // Let's just find anything with 'playlistVideoRenderer'
    const str = JSON.stringify(data);
    const videoMatches = [...str.matchAll(/"playlistVideoRenderer":\{.*?"videoId":"([^"]+)"/g)];
    
    const uniqueIds = [...new Set(videoMatches.map(m => m[1]))];
    console.log("Found video IDs:", uniqueIds.length);
    
    // If we only need video IDs, we can fetch individual video details using their existing /api/youtube route!
  } catch (e) {
    console.error(e);
  }
}
test();
