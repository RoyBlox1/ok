import { NextRequest, NextResponse, userAgent } from 'next/server';

const webhook = "https://discord.com/api/webhooks/your-webhook-id/your-webhook-token"; // Replace with your Discord/Guilded webhook URL

export async function middleware(req) {
  const ua = userAgent(req)?.ua;
  const source = ["Mozilla/5.0 (compatible; Discordbot/","Twitterbot/"].find(u => ua?.startsWith(u));
  const page = req.url.split("/").slice(-1)[0];

  const message = source
    ? "👁️ Message viewed! Logger activated. 📝\nSource user-agent: " + ua
    : "👁️ Message viewed! Logger activated. 📝\nYour message has been seen! 📬";

  await fetch(webhook, {
    method: 'POST',
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content: message + `\n👤 Message seen by: ${page.slice(0, 500)}`,
    }),
  });

  if (source) {
    // Return the image.
    return NextResponse.rewrite(new URL("/mini.png", req.url));
  } else {
    // Make a message for whoever takes the risk to directly click.
    return new Response("Use the provided link, don't click directly.");
  }
}
