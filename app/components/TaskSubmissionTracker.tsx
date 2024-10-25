"use client";

import { useEffect, useState } from "react";

export default function TaskSubmissionTracker() {
  const [pendingSubmissions, setPendingSubmissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "add") {
        setPendingSubmissions((prev) => [...prev, data.name]);
      } else if (data.type === "remove") {
        setPendingSubmissions((prev) =>
          prev.filter((name) => name !== data.name)
        );
      } else if (data.type === "clear") {
        setPendingSubmissions([]);
      }
    };

    fetch("/api/submissions")
      .then((response) => response.json())
      .then((data) => {
        setPendingSubmissions(data);
        setIsLoading(false);
      });

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmission = async (name: string) => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", name }),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="space-y-2">
        {pendingSubmissions.map((name) => (
          <li
            key={name}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <span className="text-red-600 text-2xl font-bold">{name}</span>
            <button
              onClick={() => handleSubmission(name)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              確認
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
