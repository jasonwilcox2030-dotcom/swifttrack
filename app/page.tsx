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
    const { data } = await supabase
      .from("shipments")
      .select("*")
      .eq("tracking_number", tracking.trim())
      .single();
    setLoading(false);
    if (!data) { setError(true); return; }
    setResult(data);
  }

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <h1 style={{ color: "#f97316", fontSize: "2.5rem", fontWeight: 800, marginBottom: "4px" }}>NextDayRoute</h1>
      <p style={{ color: "#555", marginBottom: "40px" }}>Real-time package tracking</p>

      <div style={{ background: "#111", borderRadius: "16px", padding: "28px", maxWidth: "620px", border: "1px solid #222" }}>
        <p style={{ marginBottom: "12px", color: "#aaa", fontSize: "14px" }}>Enter your tracking number</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doTrack()}
            placeholder="e.g. TRK-0001-0001-0001"
            style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "1px solid #333", background: "#1a1a1a", color: "white", fontSize: "15px" }}
          />
          <button onClick={doTrack} style={{ background: "#f97316", color: "white", border: "none", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", cursor: "pointer", fontWeight: 600 }}>
            {loading ? "..." : "Track"}
          </button>
        </div>
        {error && <p style={{ color: "#ef4444", marginTop: "12px", fontSize: "14px" }}>No shipment found. Check your tracking number.</p>}
      </div>

      {result && (
        <div style={{ maxWidth: "620px", marginTop: "20px" }}>
          <div style={{ background: "#111", border: "1px solid #f9731630", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <p style={{ color: "#f97316", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>📦 Shipment Found!</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                ["Tracking #", result.tracking_number],
                ["Status", result.current_status || result.status || "In Transit"],
                ["Service", result.service_type || "Standard"],
                ["Weight", result.package_weight ? result.package_weight + " kg" : "—"],
                ["Est. Delivery", result.estimated_delivery_date || "—"],
                ["Origin", result.origin || "—"],
                ["Destination", result.destination || "—"],
                ["Sender", result.sender_name || "—"],
                ["Sender Email", result.sender_email || "—"],
                ["Sender Phone", result.sender_phone || "—"],
                ["Receiver", result.receiver_name || "—"],
                ["Receiver Email", result.receiver_email || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "14px", color: "#ddd" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}