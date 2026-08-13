import { NextResponse } from "next/server";

// In-memory store for active sessions
// Note: In a production serverless environment (like Vercel), this would reset on cold starts.
// For a local or long-running Node.js server, this works perfectly for tracking live users.
const activeSessions = new Map();
const TIMEOUT_MS = 15000; // 15 seconds

export async function POST(request) {
  try {
    const { clientId } = await request.json();
    
    if (clientId) {
      activeSessions.set(clientId, Date.now());
    }

    // Clean up dead sessions
    const now = Date.now();
    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > TIMEOUT_MS) {
        activeSessions.delete(id);
      }
    }

    // User requested a minimum of 50 base members, plus the actual real active sessions
    // If they want exactly real data but minimum 50, we do: Math.max(50, activeSessions.size)
    // Actually, let's just make it 50 + real users so you can clearly see it go up when you open a new tab
    const realUsersCount = activeSessions.size;
    const displayCount = Math.max(50, 50 + realUsersCount - 1); 
    // -1 so that the first user keeps it at 50, second tab makes it 51, etc.

    return NextResponse.json({ 
      listeners: displayCount,
      realSessions: realUsersCount
    });
  } catch (e) {
    return NextResponse.json({ listeners: 50 }, { status: 500 });
  }
}
