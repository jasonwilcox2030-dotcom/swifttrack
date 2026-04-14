"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const STATUS_CONFIG: any = {
  "Label Created":       { pct: 8,   color: "#888780", emoji: "📋" },
  "Picked Up":           { pct: 22,  color: "#f97316", emoji: "📦" },
  "In Transit":          { pct: 45,  color: "#f97316", emoji: "🚚" },
  "Arrived at Facility": { pct: 62,  color: "#f97316", emoji: "🏭" },
  "Out for Delivery":    { pct: 90,  color: "#f97316", emoji: "🛵" },
  "Delivered":           { pct: 100, color: "#22c55e", emoji: "✅" },
  "On Hold":             { pct: 50,  color: "#d97706", emoji: "⏸️" },
  "Exception":           { pct: 50,  color: "#dc2626", emoji: "⚠️" },
};

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

  const status = result?.current_status || result?.status || "Label Created";
  const cfg = STATUS_CONFIG[status] || { pct: 0, color: "#888780", emoji: "📋" };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ padding: "18px 32px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "#f97316" }}>NextDayRoute</div>
        <div style={{ fontSize: "12px", color: "#444", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
          All systems live
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "60px 20px 40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#444", marginBottom: "20px" }}>Fast · Reliable · Discreet</div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "56px", fontWeight: 800, lineHeight: 1, marginBottom: "16px" }}>
          <span style={{ color: "#f97316" }}>NEXT</span>DAY<br />ROUTE
        </h1>
        <p style={{ color: "#444", fontSize: "14px", marginBottom: "40px" }}>Know exactly where your package is, every mile of the journey.</p>

        {/* SEARCH */}
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "14px", padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doTrack()}
              placeholder="Enter tracking number..."
              style={{ flex: 1, background: "none", border: "none", color: "white", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", padding: "10px 0", outline: "none" }}
            />
            <button onClick={doTrack} style={{ background: "#f97316", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? "..." : "Track →"}
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "10px" }}>No shipment found. Check your tracking number.</p>}
        </div>

        {/* STATS */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0", maxWidth: "400px", margin: "40px auto 0", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
          {[["50K+","Packages"],["99.9%","Uptime"],["180+","Countries"]].map(([n, l]) => (
            <div key={l} style={{ flex: 1, padding: "16px 8px", textAlign: "center", borderRight: "1px solid #1a1a1a" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, color: "#f97316" }}>{n}</div>
              <div style={{ fontSize: "10px", color: "#444", marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px 60px" }}>

          {/* STATUS CARD */}
          <div style={{ background: cfg.color + "10", border: "1px solid " + cfg.color + "30", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ fontSize: "36px" }}>{cfg.emoji}</div>
                <div>
                  <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Current Status</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 700, color: cfg.color }}>{status}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "48px", fontWeight: 800, color: cfg.color, opacity: 0.8 }}>{cfg.pct}%</div>
            </div>
            <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: cfg.pct + "%", background: cfg.color, borderRadius: "99px", transition: "width 1s ease" }} />
            </div>
          </div>

          {/* ROUTE */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Route</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f97316", marginBottom: "8px" }} />
                <div style={{ fontSize: "16px", fontWeight: 600 }}>{result.origin || "—"}</div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Origin</div>
              </div>
              <div style={{ flex: 2, padding: "0 16px", position: "relative" }}>
                <div style={{ height: "2px", background: "#1a1a1a", borderRadius: "99px" }}>
                  <div style={{ height: "100%", width: cfg.pct + "%", background: "#f97316", borderRadius: "99px" }} />
                </div>
                <div style={{ textAlign: "center", fontSize: "20px", marginTop: "-12px" }}>✈</div>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", marginBottom: "8px", marginLeft: "auto" }} />
                <div style={{ fontSize: "16px", fontWeight: 600 }}>{result.destination || "—"}</div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Destination</div>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "11px", color: "#444", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Shipment Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {[
                ["Tracking #", result.tracking_number],
                ["Service", result.service_type || "Standard"],
                ["Est. Delivery", result.estimated_delivery_date || "—"],
                ["Weight", result.package_weight ? result.package_weight + " kg" : "—"],
                ["Sender", result.sender_name || "—"],
                ["Sender Email", result.sender_email || "—"],
                ["Sender Phone", result.sender_phone || "—"],
                ["Sender Address", result.sender_address || "—"],
                ["Receiver", result.receiver_name || "—"],
                ["Receiver Email", result.receiver_email || "—"],
                ["Receiver Phone", result.receiver_phone || "—"],
                ["Receiver Address", result.receiver_address || "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "14px", color: "#ccc" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}