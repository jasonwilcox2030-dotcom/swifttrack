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
      .select("*, shipment_status_logs(*)")
      .eq("tracking_number", tracking.trim())
      .single();

    setLoading(false);
    if (error || !data) { setError(true); return; }
    setResult(data);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0f0f0e", color: "#f5f4f0", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <h1 style={{ color: "#f97316", fontSize: "28px", marginBottom: "4px" }}>SwiftTrack</h1>
      <p style={{ color: "#a8a79f", marginBottom: "32px" }}>Real-time package tracking</p>

      <div style={{ background: "#1a1a18", border: "1px solid #2e2e2b", borderRadius: "14px", padding: "24px", maxWidth: "600px", marginBottom: "24px" }}>
        <p style={{ marginBottom: "12px", color: "#f5f4f0" }}>Enter your tracking number</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <input value={tracking} onChange={e => setTracking(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} placeholder="e.g. TRK-5829-4831-1204" style={{ flex: 1, padding: "11px 14px", borderRadius: "10px", border: "1px solid #3d3d39", background: "#222220", color: "#f5f4f0", fontSize: "14px" }} />
          <button onClick={doTrack} style={{ padding: "11px 20px", background: "#f97316", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
            {loading ? "..." : "Track"}
          </button>
        </div>
        {error && <p style={{ color: "#f87171", marginTop: "10px", fontSize: "13px" }}>Tracking number not found.</p>}
      </div>

      {result && (
        <div style={{ background: "#1a1a18", border: "1px solid #2e2e2b", borderRadius: "14px", padding: "24px", maxWidth: "600px" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "15px", fontWeight: 500 }}>{result.tracking_number}</div>
            <div style={{ fontSize: "12px", color: "#a8a79f" }}>{result.service_type} · {result.package_weight} kg</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div><div style={{ fontSize: "11px", color: "#6b6a63" }}>FROM</div><div style={{ fontSize: "13px" }}>{result.origin}</div></div>
            <div><div style={{ fontSize: "11px", color: "#6b6a63" }}>TO</div><div style={{ fontSize: "13px" }}>{result.destination}</div></div>
            <div><div style={{ fontSize: "11px", color: "#6b6a63" }}>SENDER</div><div style={{ fontSize: "13px" }}>{result.sender_name}</div></div>
            <div><div style={{ fontSize: "11px", color: "#6b6a63" }}>EST. DELIVERY</div><div style={{ fontSize: "13px" }}>{result.estimated_delivery_date}</div></div>
          </div>
          <div style={{ background: "#222220", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>Current Status</div>
            <div style={{ color: "#f97316", fontSize: "15px", fontWeight: 500 }}>{result.current_status}</div>
          </div>
          {result.shipment_status_logs?.length > 0 && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>Status History</div>
              {[...result.shipment_status_logs].reverse().map((log: any) => (
                <div key={log.id} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f97316", marginTop: "5px", flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500 }}>{log.status}</div>
                    <div style={{ fontSize: "11px", color: "#6b6a63" }}>{log.location} · {new Date(log.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}