"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SC: any = {
  "Label Created":       { pct: 8,   color: "#888780", emoji: "📋", desc: "Label created — awaiting pickup by courier" },
  "Picked Up":           { pct: 22,  color: "#f97316", emoji: "📦", desc: "Package secured — courier has taken possession" },
  "In Transit":          { pct: 45,  color: "#f97316", emoji: "🚚", desc: "Rolling. Your package is on the move right now" },
  "Arrived at Facility": { pct: 62,  color: "#f97316", emoji: "🏭", desc: "Package checked in at regional sorting facility" },
  "Customs Clearance":   { pct: 72,  color: "#d97706", emoji: "🛃", desc: "Held at customs — clearance in progress" },
  "On Hold":             { pct: 72,  color: "#d97706", emoji: "⏸️", desc: "Temporarily paused — verification may be required" },
  "Out for Delivery":    { pct: 90,  color: "#f97316", emoji: "🛵", desc: "Final mile — your package arrives today" },
  "Exception":           { pct: 72,  color: "#dc2626", emoji: "⚠️", desc: "Attention needed — contact support immediately" },
  "Delivered":           { pct: 100, color: "#22c55e", emoji: "✅", desc: "Mission complete — package delivered successfully" },
};

export default function Home() {
  const [tracking, setTracking] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifyInput, setNotifyInput] = useState("");
  const [notifyOk, setNotifyOk] = useState(false);
  const [ntab, setNtab] = useState("email");
  const [pct, setPct] = useState(0);

  async function doTrack() {
    if (!tracking.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);
    setPct(0);
    const { data } = await supabase
      .from("shipments")
      .select("*, shipment_status_logs(*)")
      .eq("tracking_number", tracking.trim())
      .single();
    setLoading(false);
    if (!data) { setError(true); return; }
    setResult(data);
    setTimeout(() => setPct((SC[data.current_status] || { pct: 0 }).pct), 100);
  }

  const cfg = result ? (SC[result.current_status] || { pct: 0, color: "#888780", emoji: "📋", desc: "" }) : null;

  return (
    <main style={{ background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scan { 0% { top: -2px; opacity: 0; } 5% { opacity: 0.25; } 95% { opacity: 0.25; } 100% { top: 100%; opacity: 0; } }
        @keyframes rain { 0% { transform: translateY(-100px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.6; } 100% { transform: translateY(110vh); opacity: 0; } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.25; } }
        @keyframes live { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .rain-drop { position: absolute; width: 1px; background: linear-gradient(transparent, rgba(249,115,22,0.4), transparent); animation: rain linear infinite; pointer-events: none; }
        .scan-line { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%); animation: scan 6s linear infinite; opacity: 0.25; pointer-events: none; z-index: 1; }
        .prog-fill { transition: width 1s cubic-bezier(.4,0,.2,1); }
        .plane-move { transition: left 1s ease; }
        input:focus { outline: none; border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1) !important; }
      `}</style>

      {/* GRID BG */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#1c1c19 1px,transparent 1px),linear-gradient(90deg,#1c1c19 1px,transparent 1px)", backgroundSize: "48px 48px", opacity: 0.5, pointerEvents: "none" }} />

      {/* GLOW */}
      <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse,rgba(249,115,22,0.2) 0%,transparent 65%)", pointerEvents: "none", animation: "glow-pulse 4s ease infinite" }} />

      {/* RAIN */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="rain-drop" style={{ left: `${Math.random() * 100}%`, height: `${60 + Math.random() * 80}px`, animationDuration: `${1.5 + Math.random() * 2}s`, animationDelay: `${Math.random() * 3}s`, opacity: 0.3 + Math.random() * 0.4 }} />
      ))}

      {/* SCAN LINE */}
      <div className="scan-line" />

      {/* NAV */}
      <nav style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "1px solid #1c1c19" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#f97316", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="20" r="1"/><circle cx="20" cy="20" r="1"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: -0.5 }}>NextDayRoute</div>
            <div style={{ fontSize: 9, color: "#5a5a54", marginTop: 1, letterSpacing: "0.5px", textTransform: "uppercase" }}>nextdayroute.com</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#5a5a54", border: "1px solid #1c1c19", padding: "5px 12px", borderRadius: 99 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "live 2s infinite" }} />
          All systems live
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", zIndex: 10, padding: "64px 24px 52px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 24, height: 1, background: "#f97316" }} />
          <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a5a54" }}>Discreet · Fast · Reliable</div>
          <div style={{ width: 24, height: 1, background: "#f97316" }} />
        </div>

        <div style={{ fontFamily: "'Syne',sans-serif", lineHeight: 1.0, letterSpacing: -2, marginBottom: 8 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#eeede6", display: "block" }}>NEXT</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#f97316", display: "block" }}>DAY</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#eeede6", display: "block" }}>ROUTE</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: "#5a5a54", fontStyle: "italic", display: "block", marginTop: 10, letterSpacing: 0, fontFamily: "'DM Sans',sans-serif" }}>King of the road.</div>
        </div>

        <div style={{ fontSize: 13, color: "#5a5a54", margin: "20px auto 0", maxWidth: 360, lineHeight: 1.8, fontWeight: 300 }}>
          <strong style={{ color: "#eeede6", fontWeight: 400 }}>Bulletproof delivery tracking</strong> — know exactly where your package is, every mile of the journey.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px auto", maxWidth: 300 }}>
          <div style={{ flex: 1, height: 1, background: "#252521" }} />
          <div style={{ width: 6, height: 6, background: "#f97316", transform: "rotate(45deg)" }} />
          <div style={{ flex: 1, height: 1, background: "#252521" }} />
        </div>

        {/* SEARCH */}
        <div style={{ maxWidth: 520, margin: "0 auto 24px" }}>
          <div style={{ background: "#0d0d0b", border: "1px solid #252521", borderRadius: 14, padding: "5px 5px 5px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5a5a54" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={tracking} onChange={e => setTracking(e.target.value)} onKeyDown={e => e.key === "Enter" && doTrack()} placeholder="Enter your tracking number..." style={{ flex: 1, background: "none", border: "none", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans',sans-serif", padding: "11px 0" }} />
            <button onClick={doTrack} style={{ padding: "12px 22px", background: "#f97316", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap" }}>
              {loading ? "..." : "Track"}
            </button>
          </div>
          {error && <div style={{ color: "#f87171", fontSize: 12, marginTop: 10 }}>No shipment found. Check your tracking number.</div>}
        </div>

        {/* STATS */}
        <div style={{ display: "flex", justifyContent: "center", maxWidth: 480, margin: "36px auto 0", border: "1px solid #1c1c19", borderRadius: 14, overflow: "hidden" }}>
          {[["50K+","Packages"],["99.9%","Uptime"],["24/7","Live"],["180+","Countries"]].map(([n,l]) => (
            <div key={l} style={{ flex: 1, padding: "14px 8px", textAlign: "center", borderRight: "1px solid #1c1c19" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#f97316" }}>{n}</div>
              <div style={{ fontSize: 9, color: "#5a5a54", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULT */}
      {result && cfg && (
        <div style={{ position: "relative", zIndex: 10, maxWidth: 580, margin: "0 auto", padding: "0 20px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: "#5a5a54" }}>— Shipment found —</span>
          </div>

          {/* BIG STATUS */}
          <div style={{ background: cfg.color + "10", border: `1px solid ${cfg.color}28`, borderRadius: 18, padding: 26, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: cfg.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{cfg.emoji}</div>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1, opacity: 0.5, marginBottom: 5 }}>Current status</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: cfg.color }}>{result.current_status}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, lineHeight: 1, color: cfg.color, opacity: 0.85 }}>{cfg.pct}%</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.55, marginBottom: 16, fontWeight: 300, lineHeight: 1.6 }}>{cfg.desc}</div>
            <div style={{ height: 5, background: "rgba(0,0,0,0.25)", borderRadius: 99, overflow: "hidden" }}>
              <div className="prog-fill" style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 99 }} />
            </div>
          </div>

          {/* DETAILS */}
          <div style={{ background: "#0d0d0b", border: "1px solid #1c1c19", borderRadius: 18, padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: "#5a5a54", textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 }}>Shipment details</div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", marginBottom: 6 }} />
                <div style={{ fontSize: 14, fontWeight: 500 }}>{result.origin?.split(",")[0]}</div>
                <div style={{ fontSize: 9, color: "#5a5a54", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Origin</div>
              </div>
              <div style={{ flex: 2, margin: "0 12px", position: "relative" }}>
                <div style={{ width: "100%", height: 1, background: "#252521" }} />
                <div className="prog-fill" style={{ position: "absolute", top: -0.5, left: 0, height: 2, width: `${pct}%`, background: "#f97316", borderRadius: 99 }} />
                <div className="plane-move" style={{ position: "absolute", top: -10, fontSize: 14, left: `${Math.min(pct - 5, 85)}%` }}>✈</div>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", marginBottom: 6, marginLeft: "auto" }} />
                <div style={{ fontSize: 14, fontWeight: 500 }}>{result.destination?.split(",")[0]}</div>
                <div style={{ fontSize: 9, color: "#5a5a54", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Destination</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Tracking #", result.tracking_number],["Service", result.service_type],["Sender", result.sender_name],["Receiver", result.receiver_name],["Weight", result.package_weight + " kg"],["Est. delivery", result.estimated_delivery_date]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 9, color: "#28281f", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>{l}</div>
            <div style={{ color: "#d0cfc8", fontFamily: l === "Tracking #" ? "monospace" : "inherit", fontSize: l === "Tracking #" ? 11 : 13 }}>
                </div>
              ))}
            </div>
          </div>

          {/* NOTIFY */}
          <div style={{ background: "#0d0d0b", border: "1px solid #1c1c19", borderRadius: 18, padding: 22, marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: "#5a5a54", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Notifications</div>
            <div style={{ fontSize: 12, color: "#5a5a54", marginBottom: 12, fontWeight: 300 }}>Get alerted the moment your package moves</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {["email","sms"].map(m => (
                <button key={m} onClick={() => setNtab(m)} style={{ padding: "5px 14px", border: "1px solid", borderColor: ntab === m ? "#f97316" : "#1c1c19", borderRadius: 99, fontSize: 11, cursor: "pointer", background: ntab === m ? "#f97316" : "none", color: ntab === m ? "#fff" : "#5a5a54", fontFamily: "'DM Sans',sans-serif" }}>{m === "email" ? "Email" : "SMS"}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={notifyInput} onChange={e => setNotifyInput(e.target.value)} type={ntab === "email" ? "email" : "tel"} placeholder={ntab === "email" ? "your@email.com" : "+1 (000) 000-0000"} style={{ flex: 1, padding: "10px 14px", border: "1px solid #252521", borderRadius: 10, fontSize: 13, background: "#131311", color: "#eeede6", fontFamily: "'DM Sans',sans-serif" }} />
              <button onClick={() => { if (notifyInput.trim()) { setNotifyOk(true); setNotifyInput(""); } }} style={{ padding: "10px 16px", background: "none", border: "1px solid #252521", borderRadius: 10, fontSize: 12, color: "#eeede6", cursor: "pointer", whiteSpace: "nowrap" }}>Notify me</button>
            </div>
            {notifyOk && <div style={{ fontSize: 12, color: "#22c55e", marginTop: 8 }}>Done! You'll get updates at your contact.</div>}
          </div>

          {/* HISTORY */}
          {result.shipment_status_logs?.length > 0 && (
            <div style={{ background: "#0d0d0b", border: "1px solid #1c1c19", borderRadius: 18, padding: 22 }}>
              <div style={{ fontSize: 9, fontWeight: 500, color: "#5a5a54", textTransform: "uppercase", letterSpacing: 1, marginBottom: 18 }}>Tracking history</div>
              {[...result.shipment_status_logs].reverse().map((log: any) => {
                const lc = SC[log.status] || { color: "#888780" };
                return (
                  <div key={log.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #1c1c19" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, border: `2px solid ${lc.color}`, background: lc.color + "18", marginTop: 3 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{log.status}</div>
                      <div style={{ fontSize: 11, color: "#5a5a54", marginTop: 2 }}>{log.location}{log.description ? ` — ${log.description}` : ""}</div>
                      <div style={{ fontSize: 10, color: "#28281f", marginTop: 2 }}>{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}