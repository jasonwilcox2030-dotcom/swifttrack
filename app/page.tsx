"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function doTrack() {
    if (!tracking.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);

    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", tracking.trim())
      .single();

    setLoading(false);
    if (error || !data) { setError(true); return; }
    setResult(data);
  }

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <h1 style={{ color: "#f97316", fontSize: "2rem", marginBottom: "8px" }}>SwiftTrack</h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>Real-time package tracking</p>

      <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "24px", maxWidth: "600px" }}>
        <p style={{ marginBottom: "12px" }}>Enter your tracking number</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doTrack()}
            placeholder="e.g. TRK-0001-0001-0001"
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "white", fontSize: "16px" }}
          />
          <button
            onClick={doTrack}
            style={{ background: "#f97316", color: "white", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
          >
            {loading ? "..." : "Track"}
          </button>
        </div>

        {error && <p style={{ color: "#ef4444", marginTop: "16px" }}>Tracking number not found!</p>}

        {result && (
          <div style={{ marginTop: "24px", borderTop: "1px solid #333", paddingTop: "24px" }}>
            <p style={{ color: "#f97316", fontWeight: "bold", marginBottom: "16px" }}>📦 Shipment Found!</p>
            <p><span style={{ color: "#888" }}>Tracking:</span> {result.tracking_number}</p>
            <p><span style={{ color: "#888" }}>Sender:</span> {result.sender_name}</p>
            <p><span style={{ color: "#888" }}>Status:</span> {result.status || "In Transit"}</p>
          </div>
        )}
      </div>
    </main>
  );
}