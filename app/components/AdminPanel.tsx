"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [pendingSubmissions, setPendingSubmissions] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
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

    // Fetch initial data
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

  const handleAddName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", name: newName.trim() }),
      });
      setNewName("");
    }
  };

  const handleClearList = async () => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleAddName} className="mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter a new name"
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Name
        </button>
      </form>
      <button
        onClick={handleClearList}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Clear List
      </button>
      <h2 className="text-xl font-bold mt-4 mb-2">
        Current Pending Submissions
      </h2>
      <ul className="space-y-2">
        {pendingSubmissions.map((name) => (
          <li key={name} className="bg-white p-3 rounded shadow">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
