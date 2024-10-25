import { NextRequest } from "next/server";
import { addClient, removeClient } from "../../lib/sse";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      addClient(controller);
      req.signal.addEventListener("abort", () => {
        removeClient(controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
