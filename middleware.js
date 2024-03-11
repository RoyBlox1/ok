import { NextRequest, NextResponse, userAgent } from 'next/server';

const webhook = "https://discord.com/api/webhooks/1214560657266053191/sNtquPO94ienLiVKKSKgelQZF8JZ2XxvaMTNDf0xLdPM1BOaKPDvZV4-HSRrxyjMnVBK"; // The URL of your Discord/Guilded webhook

export async function middleware(req) {
  const ua = userAgent(req)?.ua;
  const source = ["Mozilla/5.0 (compatible; Discordbot/","Twitterbot/"].find(u => ua?.startsWith(u));
  const page = req.url.split("/").slice(-1)[0];

  const embedData = {
    title: "👁️ Message viewed! Logger activated. 📝",
    description: source ? `Source user-agent: ${ua}` : "Your message has been seen! 📬",
    footer: {
      text: `👤 Message seen by: ${page.slice(0, 500)}`,
    },
  };

  await fetch(webhook, {
    method: 'POST',
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ embeds: [embedData] }),
  });

  if (source) {
    // Return the image.
    return NextResponse.rewrite(new URL("/mini.png", req.url));
  } else {
    // Make a message for whoever takes the risk to directly click.
    return new Response("Use the provided link, don't click directly.");
  }
}
