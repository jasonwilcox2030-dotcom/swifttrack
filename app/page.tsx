"use client";
import { useState } from "react";

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  const shipments: any = {
    "TRK-5829-4831-1204": {
      tracking: "TRK-5829-4831-1204",
      sender: "John Smith",
      receiver: "Jane Doe",
      origin: "New York, NY",
      dest: "Los Angeles, CA",
      service: "Express",
      weight: 2.4,
      status: "In Transit",
      eta: "Apr 15, 2026",
    },
    "TRK-1023-7742-8801": {
      tracking: "TRK-1023-7742-8801",
      sender: "Alice Brown",
      receiver: "Bob Lee",
      origin: "Chicago, IL",
      dest: "Miami, FL",
      service: "Standard",
      weight: 0.8,
      status: "Delivered",
      eta: "Apr 10, 2026",
    },
  };

  function doTrack() {
    const s = shipments[tracking.trim()];
    if (!s) { setError(true); setResult(null); return; }
    setError(false);
    setResult(s);
  }

  return (
    <main style={{ fontFamily: "sans-serif", background: "#0f0f0e", minHeight: "100vh", padding: "24px", color: "#f5f4f0" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ color: "#f97316", fontSize: 24, marginBottom: 4 }}>SwiftTrack</h1>
        <p style={{ color: "#a8a79f", marginBottom: 24 }}>Real-time package tracking</p>

        <div style={{ background: "#1a1a18", borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <p style={{ marginBottom: 12, color: "#f5f4f0" }}>Enter your tracking number</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              placeholder="TRK-5829-4831-1204"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #2e2e2b", background: "#222220", color: "#f5f4f0", fontSize: 14 }}
            />
            <button
              onClick={doTrack}
              style={{ padding: "10px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: 8, fontWeight: 500, cursor: "pointer" }}
            >Track</button>
          </div>
          {error && <p style={{ color: "#f87171", marginTop: 10 }}>Tracking number not found!</p>}
        </div>

        {result && (
          <div style={{ background: "#1a1a18", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 500 }}>{result.tracking}</div>
                <div style={{ color: "#a8a79f", fontSize: 12 }}>{result.service} · {result.weight}kg</div>
              </div>
              <span style={{ background: "#2a1500", color: "#f97316", padding: "4px 12px", borderRadius: 99, fontSize: 12 }}>{result.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div><div style={{ fontSize: 11, color: "#6b6a63" }}>FROM</div><div style={{ fontSize: 13 }}>{result.origin}</div></div>
              <div><div style={{ fontSize: 11, color: "#6b6a63" }}>TO</div><div style={{ fontSize: 13 }}>{result.dest}</div></div>
              <div><div style={{ fontSize: 11, color: "#6b6a63" }}>SENDER</div><div style={{ fontSize: 13 }}>{result.sender}</div></div>
              <div><div style={{ fontSize: 11, color: "#6b6a63" }}>EST. DELIVERY</div><div style={{ fontSize: 13 }}>{result.eta}</div></div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}