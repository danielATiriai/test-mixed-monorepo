import React, { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  description: string;
}

interface ApiResponse {
  items: Item[];
  database: string;
}

const API_URL = process.env.API_URL || "http://localhost:8000";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [dbStatus, setDbStatus] = useState<string>("loading...");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        setItems(data.items);
        setDbStatus(data.database);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h1>test-mixed-monorepo frontend</h1>
      <p>
        <strong>Builder:</strong> Nixpacks (auto)
      </p>
      <p>
        <strong>API URL:</strong> {API_URL}
      </p>
      <p>
        <strong>Database:</strong> {dbStatus}
      </p>

      <h2>Items from API</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
