const https = require('https');
const queries = [
  "ankhiyon ke jharokhon se",
  "lag ja gale",
  "ek pyar ka nagma hai",
  "kabhie kabhie mere dil mein",
  "chura liya hai tumne",
  "mera dil bhi kitna pagal hai",
  "tujhe dekha to",
  "pehla nasha",
  "chura ke dil mera",
  "hothon se chhu lo tum",
  "tumko dekha toh",
  "jhuki jhuki si nazar",
  "tum itna jo"
];

async function fetchId(query) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (match) resolve(match[1]);
        else resolve("dQw4w9WgXcQ");
      });
    });
  });
}

async function run() {
  for (const q of queries) {
    const id = await fetchId(q);
    console.log(`${q}: ${id}`);
  }
}

run();
