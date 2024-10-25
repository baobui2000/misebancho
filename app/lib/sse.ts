const clients = new Set<ReadableStreamDefaultController>();

export function addClient(controller: ReadableStreamDefaultController) {
  clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController) {
  clients.delete(controller);
}

interface SSEData {
  type: "add" | "remove" | "clear";
  name?: string;
}

export function sendEventToAll(data: SSEData) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => client.enqueue(message));
}
