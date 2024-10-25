import { NextRequest, NextResponse } from "next/server";
import { sendEventToAll } from "../../lib/sse";

let submissions: string[] = [];

export async function GET() {
  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  const { action, name } = await req.json();

  switch (action) {
    case "add":
      if (!submissions.includes(name)) {
        submissions.push(name);
        sendEventToAll({ type: "add", name });
      }
      break;
    case "remove":
      submissions = submissions.filter((n) => n !== name);
      sendEventToAll({ type: "remove", name });
      break;
    case "clear":
      submissions = [];
      sendEventToAll({ type: "clear" });
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ success: true, submissions });
}
