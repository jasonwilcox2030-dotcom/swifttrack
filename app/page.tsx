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

interface MapProps {
  origin: string;
  destination: string;
  pct: number;
  color: string;
  vehicle: string;
}

const MapComponent = dynamic<MapProps>(
  () => import("../components/TrackingMap"),
  { ssr: false, loading: () => <div style={{ width: "100%", height: 370, background: "#111827", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>🗺️ Loading map...</div> }
);

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drops, setDrops] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <main style={{ background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scan { 0% { top:-2px; } 100% { top:100vh; } }
        @keyframes rain { 0%{transform:translateY(-120px);opacity:0;} 10%{opacity:1;} 90%{opacity:0.5;} 100%{transform:translateY(110vh);opacity:0;} }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.5);} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0);} }
        @keyframes orangePulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.4);} 50%{box-shadow:0 0 0 8px rgba(249,115,22,0);} }
        @keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-6px);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        input::placeholder{color:#333;} input:focus{outline:none;}
        .leaflet-container{background:#1a1a1a !important;}
        .leaflet-tile{filter:invert(1) hue-rotate(180deg) brightness(0.7) saturate(0.5);}
        .leaflet-control-attribution{display:none !important;}
        .leaflet-control-zoom a{background:#111 !important;color:#f97316 !important;border-color:#333 !important;}
        @media(max-width:600px){
          .nav-links{display:none;}
          .hero-headline{font-size:clamp(48px,15vw,72px) !important;}
          .details-grid{grid-template-columns:1fr !important;}
          .trust-grid{grid-template-columns:1fr 1fr !important;}
          .stats-row{flex-wrap:wrap;}
          .footer-grid{grid-template-columns:1fr !important;}
        }
      `}</style>

      {/* BG EFFECTS */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(#1a1a17 1px,transparent 1px),linear-gradient(90deg,#1a1a17 1px,transparent 1px)", backgroundSize: "48px 48px", opacity: 0.4, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: -150, left: "50%", transform: "translateX(-50%)", width: "min(800px,100vw)", height: 600, background: "radial-gradient(ellipse,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#f97316,transparent)", opacity: 0.2, zIndex: 1, pointerEvents: "none", animation: "scan 8s linear infinite" }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {drops.map(d => (
          <div key={d.id} style={{ position: "absolute", left: d.left + "%", height: d.height, width: 1, background: "linear-gradient(transparent,rgba(249,115,22,0.35),transparent)", borderRadius: 99, opacity: d.opacity, animation: `rain ${d.duration}s ${d.delay}s linear infinite` }} />
        ))}
      </div>

      {/* HEADER */}
      <header style={{ position: "relative", zIndex: 100, borderBottom: "1px solid #1a1a17", background: "rgba(6,6,5,0.9)", backdropFilter: "blur(20px)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#f97316", letterSpacing: -0.5 }}>
            NextDayRoute
          </div>
          <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Track", "Services", "About", "Contact"].map(link => (
              <a key={link} href="#" style={{ fontSize: 13, color: "#555", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#eeede6")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}
              >{link}</a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#444", border: "1px solid #1a1a17", padding: "5px 12px", borderRadius: 99 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s infinite" }} />
              All systems live
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "72px 20px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 28, height: 1, background: "#f97316" }} />
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#444" }}>Discreet · Fast · Reliable</div>
          <div style={{ width: 28, height: 1, background: "#f97316" }} />
        </div>

        <div className="hero-headline" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, lineHeight: 0.9, letterSpacing: -3, marginBottom: 16, fontSize: "clamp(56px,10vw,96px)", animation: "fadeUp 0.8s ease" }}>
          <div style={{ color: "#eeede6" }}>NEXT</div>
          <div style={{ color: "#f97316", textShadow: "0 0 40px rgba(249,115,22,0.4)" }}>DAY</div>
          <div style={{ color: "#eeede6" }}>ROUTE</div>
        </div>

        <div style={{ fontSize: 16, fontStyle: "italic", fontWeight: 300, color: "#555", marginBottom: 8 }}>King of the road.</div>
        <div style={{ fontSize: 13, color: "#333", marginBottom: 48, maxWidth: 420, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Premium discreet shipping — overnight and 3-day worldwide delivery. Track your package in real time, every mile of the journey.
        </div>

        {/* TRUST BADGES */}
        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, maxWidth: 700, margin: "0 auto 40px" }}>
          {[
            { icon: "🔒", label: "Verified Network" },
            { icon: "🛡️", label: "Encrypted Tracking" },
            { icon: "✅", label: "ID Verified Delivery" },
            { icon: "🔐", label: "Fraud Protection" },
          ].map(b => (
            <div key={b.label} style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 0.5 }}>{b.label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div style={{ maxWidth: 540, margin: "0 auto 24px", padding: "0 4px" }}>
          <div style={{ background: "#0d0d0b", border: "1px solid #252521", borderRadius: 16, padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 0 40px rgba(249,115,22,0.05)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={tracking} onChange={e => setTracking(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} placeholder="Enter your tracking number..." style={{ flex: 1, background: "none", border: "none", color: "#eeede6", fontSize: 15, fontFamily: "'DM Sans',sans-serif", padding: "12px 0", minWidth: 0 }} />
            <button onClick={doTrack} style={{ padding: "12px 28px", background: "#f97316", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(249,115,22,0.3)", animation: "orangePulse 3s infinite" }}>
              {loading ? "..." : "Track →"}
            </button>
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>No shipment found. Check your tracking number.</div>}
        </div>

        {/* SYSTEM INDICATORS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
          {[
            { icon: "📡", label: "Live GPS Sync" },
            { icon: "🛰️", label: "Satellite Tracking" },
            { icon: "📶", label: "Signal Strong" },
            { icon: "🔄", label: "Auto Route Updates" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 99, fontSize: 11, color: "#555" }}>
              <span>{s.icon}</span>{s.label}
            </div>
          ))}
        </div>

        {/* STATS */}
        <div className="stats-row" style={{ display: "flex", maxWidth: 480, margin: "0 auto", border: "1px solid #1a1a17", borderRadius: 14, overflow: "hidden" }}>
          {[["50K+","Packages"],["99.9%","Uptime"],["24/7","Monitoring"],["180+","Countries"]].map(([n,l],i) => (
            <div key={l} style={{ flex: 1, padding: "16px 8px", textAlign: "center", borderRight: i < 3 ? "1px solid #1a1a17" : "none", minWidth: 80 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#f97316" }}>{n}</div>
              <div style={{ fontSize: 9, color: "#333", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFICIAL NOTICE */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 580, margin: "0 auto 8px", padding: "0 16px" }}>
        <div style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Official Notice</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>All shipments are verified and tracked in real time. If your package status shows a delay, please allow 24 hours before contacting support. For urgent inquiries contact dispatch@nextdayroute.com</div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {result && (
        <div style={{ position: "relative", zIndex: 10, maxWidth: 580, margin: "0 auto", padding: "8px 16px 60px", animation: "fadeUp 0.5s ease" }}>
          <div style={{ textAlign: "center", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#333", margin: "24px 0 16px" }}>— Shipment found —</div>

          {/* STATUS CARD */}
          <div style={{ background: cfg.color + "0d", border: `1px solid ${cfg.color}30`, borderRadius: 20, padding: 24, marginBottom: 12, backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cfg.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, animation: "float 3s ease infinite" }}>{cfg.emoji}</div>
                <div>
                  <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Current Status</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: cfg.color }}>{status}</div>
                  {result.current_location && <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>📍 {result.current_location}</div>}
                  {result.status_notes && <div style={{ fontSize: 11, color: "#444", marginTop: 4, fontStyle: "italic" }}>📝 {result.status_notes}</div>}
                </div>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 52, fontWeight: 800, color: cfg.color, opacity: 0.8, lineHeight: 1, textShadow: `0 0 30px ${cfg.color}60` }}>{cfg.pct}%</div>
            </div>
            <div style={{ height: 6, background: "rgba(0,0,0,0.3)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: cfg.pct + "%", background: `linear-gradient(90deg, ${cfg.color}aa, ${cfg.color})`, borderRadius: 99, transition: "width 1.5s ease", boxShadow: `0 0 12px ${cfg.color}80` }} />
            </div>
            {/* CHECKPOINTS */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a1a1a" }}>
              {[
                { label: "Label", pct: 8 },
                { label: "Picked Up", pct: 22 },
                { label: "Transit", pct: 45 },
                { label: "Facility", pct: 62 },
                { label: "Delivery", pct: 90 },
                { label: "Delivered", pct: 100 },
              ].map(cp => (
                <div key={cp.label} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", margin: "0 auto 4px", background: cfg.pct >= cp.pct ? cfg.color : "#1a1a17", border: `1px solid ${cfg.pct >= cp.pct ? cfg.color : "#333"}`, boxShadow: cfg.pct >= cp.pct ? `0 0 6px ${cfg.color}` : "none" }} />
                  <div style={{ fontSize: 7, color: cfg.pct >= cp.pct ? "#888" : "#333", lineHeight: 1.2 }}>{cp.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MAP */}
          <div style={{ background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 20, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>🗺️ Live Route Map</div>

            {/* HUD ROW */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {[
                { label: "Mode", value: isAir ? "AIR" : "GROUND" },
                { label: "Signal", value: "STRONG 📶" },
                { label: "Progress", value: cfg.pct + "%" },
                { label: "ETA", value: result.estimated_delivery_date || "—" },
              ].map(h => (
                <div key={h.label} style={{ background: "#111", border: "1px solid #1a1a17", borderRadius: 8, padding: "6px 12px", flex: 1, minWidth: 80 }}>
                  <div style={{ fontSize: 8, color: "#333", textTransform: "uppercase", letterSpacing: 0.5 }}>{h.label}</div>
                  <div style={{ fontSize: 11, color: "#f97316", fontWeight: 600, marginTop: 2 }}>{h.value}</div>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 14, overflow: "hidden", height: 320 }}>
              <MapComponent origin={result.origin || ""} destination={result.destination || ""} pct={cfg.pct} color={cfg.color} vehicle={vehicle} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
                {result.origin}
              </div>
              <div style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{vehicle} {cfg.pct}% complete</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                {result.destination}
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 20, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Shipment Details</div>
            <div className="details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
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
                <div key={label as string} style={{ padding: "12px", background: "#111", borderRadius: 10, border: "1px solid #1a1a17" }}>
                  <div style={{ fontSize: 9, color: "#333", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: highlight ? "#f97316" : "#ccc", fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 11 : 13, wordBreak: "break-word" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 10, borderTop: "1px solid #1a1a17", background: "rgba(6,6,5,0.95)", backdropFilter: "blur(20px)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40 }}>

            {/* BRAND */}
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#f97316", marginBottom: 12 }}>NextDayRoute</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8, maxWidth: 300, marginBottom: 20 }}>
                Premium discreet shipping — overnight and 3-day worldwide delivery. Built for businesses and individuals who demand speed, privacy, and reliability.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#333" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s infinite" }} />
                All shipments encrypted & verified
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <div style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, fontWeight: 600 }}>Contact</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 2 }}>
                <div>📧 dispatch@nextdayroute.com</div>
                <div>📍 7101 S Central Ave</div>
                <div style={{ paddingLeft: 20 }}>Los Angeles, CA 90001</div>
              </div>
            </div>

            {/* LINKS */}
            <div>
              <div style={{ fontSize: 11, color: "#f97316", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, fontWeight: 600 }}>Company</div>
              <div style={{ fontSize: 13, color: "#444", lineHeight: 2.5 }}>
                {["About Us", "Services", "Track Package", "Support"].map(link => (
                  <div key={link}>
                    <a href="#" style={{ color: "#444", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                    >{link}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div style={{ borderTop: "1px solid #1a1a17", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#333" }}>© 2026 NextDayRoute. All rights reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
                <a key={link} href="#" style={{ fontSize: 12, color: "#333", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#333")}
                >{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}