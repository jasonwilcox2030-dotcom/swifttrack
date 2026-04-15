"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATUS_CONFIG: any = {
  "Label Created":       { pct: 8,   color: "#888780", emoji: "📋" },
  "Picked Up":           { pct: 22,  color: "#f97316", emoji: "📦" },
  "In Transit":          { pct: 45,  color: "#f97316", emoji: "🚚" },
  "Arrived at Facility": { pct: 62,  color: "#f97316", emoji: "🏭" },
  "Out for Delivery":    { pct: 90,  color: "#f97316", emoji: "🛵" },
  "Delivered":           { pct: 100, color: "#22c55e", emoji: "✅" },
  "On Hold":             { pct: 80,  color: "#d97706", emoji: "⏸️" },
  "Exception":           { pct: 50,  color: "#dc2626", emoji: "⚠️" },
};

const MapComponent = dynamic(() => import("../components/TrackingMap"), { ssr: false });

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drops, setDrops] = useState<any[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 30 }, (_, i) => ({
      id: i, left: Math.random() * 100, height: 50 + Math.random() * 80,
      duration: 1.5 + Math.random() * 2.5, delay: Math.random() * 4, opacity: 0.2 + Math.random() * 0.3,
    }));
    setDrops(arr);
  }, []);

  async function doTrack() {
    if (!tracking.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);
    const { data } = await supabase.from("shipments").select("*").eq("tracking_number", tracking.trim()).single();
    setLoading(false);
    if (!data) { setError(true); return; }
    setResult(data);
  }

  const status = result?.current_status || result?.status || "Label Created";
  const cfg = STATUS_CONFIG[status] || { pct: 0, color: "#888780", emoji: "📋" };
  const isAir = ["Overnight", "Express"].includes(result?.service_type);
  const vehicle = isAir ? "✈️" : "🚚";

  const s: any = {
    body: { background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", position: "relative" },
    grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(#1a1a17 1px,transparent 1px),linear-gradient(90deg,#1a1a17 1px,transparent 1px)", backgroundSize: "48px 48px", opacity: 0.5, pointerEvents: "none", zIndex: 0 },
    glow: { position: "fixed", top: -150, left: "50%", transform: "translateX(-50%)", width: "min(700px,100vw)", height: 500, background: "radial-gradient(ellipse,rgba(249,115,22,0.18) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },
    scan: { position: "fixed", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#f97316,transparent)", opacity: 0.2, zIndex: 1, pointerEvents: "none", animation: "scan 8s linear infinite" },
    nav: { position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1a1a17" },
    logo: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#f97316" },
    badge: { display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#444", border: "1px solid #1a1a17", padding: "4px 10px", borderRadius: 99 },
    hero: { position: "relative", zIndex: 10, textAlign: "center" as const, padding: "48px 16px 36px" },
    eyebrow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 },
    eyeLine: { width: 24, height: 1, background: "#f97316" },
    eyeText: { fontSize: 9, letterSpacing: 2, textTransform: "uppercase" as const, color: "#444" },
    headline: { fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, marginBottom: 12, fontSize: "clamp(44px,12vw,64px)" },
    searchWrap: { maxWidth: 520, margin: "0 auto 12px", padding: "0 4px" },
    searchBox: { background: "#0d0d0b", border: "1px solid #252521", borderRadius: 14, padding: "5px 5px 5px 16px", display: "flex", alignItems: "center", gap: 8 },
    input: { flex: 1, background: "none", border: "none", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: "10px 0", outline: "none", minWidth: 0 },
    btn: { padding: "10px 18px", background: "#f97316", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" as const, flexShrink: 0 },
    divider: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "28px auto", maxWidth: 280 },
    divLine: { flex: 1, height: 1, background: "#1a1a17" },
    divDiamond: { width: 5, height: 5, background: "#f97316", transform: "rotate(45deg)" },
    stats: { display: "flex", maxWidth: 420, margin: "0 auto", border: "1px solid #1a1a17", borderRadius: 12, overflow: "hidden" },
    stat: { flex: 1, padding: "12px 4px", textAlign: "center" as const },
    statNum: { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#f97316" },
    statLabel: { fontSize: 8, color: "#333", marginTop: 2, textTransform: "uppercase" as const },
    results: { position: "relative" as const, zIndex: 10, maxWidth: 580, margin: "0 auto", padding: "0 16px 60px" },
    sectionLabel: { textAlign: "center" as const, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#333", marginBottom: 14, marginTop: 32 },
    card: { background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 16, padding: 20, marginBottom: 12 },
    cardLabel: { fontSize: 9, color: "#333", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 16 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    dlabel: { fontSize: 9, color: "#333", textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 3 },
    dvalue: { fontSize: 13, color: "#ccc", wordBreak: "break-word" as const },
  };

  return (
    <main style={s.body}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes scan { 0% { top:-2px; } 100% { top:100vh; } }
        @keyframes rain { 0% { transform:translateY(-120px); opacity:0; } 10% { opacity:1; } 90% { opacity:0.5; } 100% { transform:translateY(110vh); opacity:0; } }
        @keyframes livePulse { 0%,100% { box-shadow:0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow:0 0 0 4px rgba(34,197,94,0); } }
        @keyframes vehicleFloat { 0%,100% { transform:translateY(-2px); } 50% { transform:translateY(2px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #333; font-size: 13px; }
        input:focus { outline: none; }
        .leaflet-container { background: #1a1a1a !important; }
        .leaflet-tile { filter: invert(1) hue-rotate(180deg) brightness(0.7) saturate(0.5); }
        .leaflet-control-attribution { display: none; }
      `}</style>

      <div style={s.grid} />
      <div style={s.glow} />
      <div style={s.scan} />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {drops.map(d => (
          <div key={d.id} style={{ position: "absolute", left: d.left + "%", height: d.height, width: 1, background: "linear-gradient(transparent,rgba(249,115,22,0.35),transparent)", borderRadius: 99, opacity: d.opacity, animation: `rain ${d.duration}s ${d.delay}s linear infinite` }} />
        ))}
      </div>

      <nav style={s.nav}>
        <div style={s.logo}>NextDayRoute</div>
        <div style={s.badge}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s ease infinite" }} />
          All systems live
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.eyebrow}>
          <div style={s.eyeLine} />
          <div style={s.eyeText}>Discreet · Fast · Reliable</div>
          <div style={s.eyeLine} />
        </div>
        <div style={s.headline}>
          <div style={{ color: "#eeede6" }}>NEXT</div>
          <div style={{ color: "#f97316" }}>DAY</div>
          <div style={{ color: "#eeede6" }}>ROUTE</div>
        </div>
        <div style={{ fontSize: 15, fontWeight: 300, fontStyle: "italic", color: "#555", marginBottom: 6 }}>King of the road.</div>
        <div style={{ fontSize: 12, color: "#333", marginBottom: 32, padding: "0 20px" }}>Bulletproof delivery tracking — every mile, every update.</div>

        <div style={s.searchWrap}>
          <div style={s.searchBox}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={tracking} onChange={e => setTracking(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} placeholder="Enter tracking number..." style={s.input} />
            <button onClick={doTrack} style={s.btn}>{loading ? "..." : "Track →"}</button>
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>No shipment found.</div>}
        </div>

        <div style={s.divider}>
          <div style={s.divLine} />
          <div style={s.divDiamond} />
          <div style={s.divLine} />
        </div>

        <div style={s.stats}>
          {[["50K+","Packages"],["99.9%","Uptime"],["24/7","Live"],["180+","Countries"]].map(([n,l],i) => (
            <div key={l} style={{ ...s.stat, borderRight: i < 3 ? "1px solid #1a1a17" : "none" }}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div style={s.results}>
          <div style={s.sectionLabel}>— Shipment found —</div>

          {/* STATUS */}
          <div style={{ ...s.card, background: cfg.color + "0d", border: "1px solid " + cfg.color + "30" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 30 }}>{cfg.emoji}</div>
                <div>
                  <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Current Status</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: cfg.color }}>{status}</div>
                  {result.current_location && <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>📍 {result.current_location}</div>}
                  {result.status_notes && <div style={{ fontSize: 11, color: "#444", marginTop: 4, fontStyle: "italic" }}>📝 {result.status_notes}</div>}
                </div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: cfg.color, opacity: 0.8 }}>{cfg.pct}%</div>
            </div>
            <div style={{ height: 4, background: "rgba(0,0,0,0.3)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: cfg.pct + "%", background: cfg.color, borderRadius: 99, transition: "width 1s ease" }} />
            </div>
          </div>

          {/* LEAFLET MAP */}
          <div style={s.card}>
            <div style={s.cardLabel}>🗺️ Live Route Map</div>
            <div style={{ borderRadius: 12, overflow: "hidden", height: 300 }}>
              <MapComponent
                origin={result.origin || ""}
                destination={result.destination || ""}
                pct={cfg.pct}
                color={cfg.color}
                vehicle={vehicle}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
                {result.origin}
              </div>
              <div style={{ fontSize: 11, color: cfg.color }}>{vehicle} {cfg.pct}% complete</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                {result.destination}
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div style={s.card}>
            <div style={s.cardLabel}>Shipment Details</div>
            <div style={s.grid2}>
              {[
                ["Tracking #", result.tracking_number, true],
                ["Status", status, false, true],
                ["Current Location", result.current_location || "—"],
                ["Status Notes", result.status_notes || "—"],
                ["Service", result.service_type || "Standard"],
                ["Weight", result.package_weight ? result.package_weight + " kg" : "—"],
                ["Pieces", result.pieces || "—"],
                ["Dimensions", result.dimensions || "—"],
                ["Declared Value", result.declared_value ? "$" + result.declared_value : "—"],
                ["Fragile", result.fragile ? "⚠️ Yes" : "No"],
                ["Signature Required", result.signature_required ? "✅ Yes" : "No"],
                ["Est. Delivery", result.estimated_delivery_date || "—", false, true],
                ["Origin", result.origin || "—"],
                ["Destination", result.destination || "—"],
                ["Package Description", result.package_description || "—"],
                ["Delivery Instructions", result.delivery_instructions || "—"],
                ["Sender Company", result.sender_company || "—"],
                ["Sender", result.sender_name || "—"],
                ["Sender Email", result.sender_email || "—"],
                ["Sender Phone", result.sender_phone || "—"],
                ["Sender Address", result.sender_address || "—"],
                ["Receiver Company", result.receiver_company || "—"],
                ["Receiver", result.receiver_name || "—"],
                ["Receiver Email", result.receiver_email || "—"],
                ["Receiver Phone", result.receiver_phone || "—"],
                ["Receiver Address", result.receiver_address || "—"],
              ].map(([label, value, mono, highlight]) => (
                <div key={label as string}>
                  <div style={s.dlabel}>{label}</div>
                  <div style={{ ...s.dvalue, color: highlight ? "#f97316" : "#ccc", fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 11 : 13 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}