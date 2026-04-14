"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATUSES = ["Label Created","Picked Up","In Transit","Arrived at Facility","Out for Delivery","Delivered","On Hold","Exception"];

export default function Admin() {
  const [tab, setTab] = useState<"create"|"update">("create");

  // CREATE
  const [form, setForm] = useState({
    tracking_number: "", sender_name: "", sender_email: "", sender_phone: "",
    sender_address: "", receiver_name: "", receiver_email: "", receiver_phone: "",
    receiver_address: "", origin: "", destination: "", service_type: "Standard",
    package_weight: "", estimated_delivery_date: "", status: "Label Created",
  });
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // UPDATE
  const [searchTrk, setSearchTrk] = useState("");
  const [foundShipment, setFoundShipment] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  async function createShipment() {
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(false);
    const { error } = await supabase.from("shipments").insert([form]);
    setCreateLoading(false);
    if (error) { setCreateError(error.message); return; }
    setCreateSuccess(true);
    setForm({ tracking_number: "", sender_name: "", sender_email: "", sender_phone: "", sender_address: "", receiver_name: "", receiver_email: "", receiver_phone: "", receiver_address: "", origin: "", destination: "", service_type: "Standard", package_weight: "", estimated_delivery_date: "", status: "Label Created" });
  }

  async function searchShipment() {
    setSearchError(false);
    setFoundShipment(null);
    setUpdateSuccess(false);
    const { data } = await supabase.from("shipments").select("*").eq("tracking_number", searchTrk.trim()).single();
    if (!data) { setSearchError(true); return; }
    setFoundShipment(data);
    setNewStatus(data.status || data.current_status || "In Transit");
  }

  async function updateStatus() {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    await supabase.from("shipments").update({ status: newStatus, current_status: newStatus }).eq("id", foundShipment.id);
    setUpdateLoading(false);
    setUpdateSuccess(true);
    setFoundShipment({ ...foundShipment, status: newStatus, current_status: newStatus });
  }

  const fields = [
    { key: "tracking_number", label: "Tracking Number" },
    { key: "sender_name", label: "Sender Name" },
    { key: "sender_email", label: "Sender Email" },
    { key: "sender_phone", label: "Sender Phone" },
    { key: "sender_address", label: "Sender Address" },
    { key: "receiver_name", label: "Receiver Name" },
    { key: "receiver_email", label: "Receiver Email" },
    { key: "receiver_phone", label: "Receiver Phone" },
    { key: "receiver_address", label: "Receiver Address" },
    { key: "origin", label: "Origin City" },
    { key: "destination", label: "Destination City" },
    { key: "package_weight", label: "Package Weight (kg)" },
    { key: "estimated_delivery_date", label: "Est. Delivery Date" },
  ];

  const st: any = {
    page: { background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px" },
    wrap: { maxWidth: 600, margin: "0 auto" },
    logo: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f97316", marginBottom: 4 },
    sub: { color: "#444", fontSize: 14, marginBottom: 32 },
    tabs: { display: "flex", gap: 8, marginBottom: 28 },
    card: { background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 16, padding: 24 },
    label: { display: "block", fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6 },
    input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 16 },
    select: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 16 },
    btn: { width: "100%", padding: 14, background: "#f97316", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" },
  };

  return (
    <main style={st.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={st.wrap}>
        <div style={st.logo}>NextDayRoute</div>
        <div style={st.sub}>Admin Panel</div>

        {/* TABS */}
        <div style={st.tabs}>
          {(["create","update"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid", borderColor: tab === t ? "#f97316" : "#1a1a17", background: tab === t ? "#f97316" : "none", color: tab === t ? "white" : "#444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif", textTransform: "capitalize" }}>
              {t === "create" ? "➕ Create Shipment" : "✏️ Update Status"}
            </button>
          ))}
        </div>

        {/* CREATE TAB */}
        {tab === "create" && (
          <div style={st.card}>
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label style={st.label}>{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={st.input} />
              </div>
            ))}
            <label style={st.label}>Service Type</label>
            <select value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} style={st.select}>
              {["Standard","Express","Priority","Overnight"].map(s => <option key={s}>{s}</option>)}
            </select>
            <label style={st.label}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...st.select, marginBottom: 24 }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={createShipment} style={st.btn}>{createLoading ? "Creating..." : "Create Shipment →"}</button>
            {createError && <div style={{ color: "#ef4444", marginTop: 12, fontSize: 13 }}>{createError}</div>}
            {createSuccess && <div style={{ color: "#22c55e", marginTop: 12, fontSize: 13, textAlign: "center" }}>✅ Shipment created!</div>}
          </div>
        )}

        {/* UPDATE TAB */}
        {tab === "update" && (
          <div style={st.card}>
            <label style={st.label}>Tracking Number</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input value={searchTrk} onChange={e => setSearchTrk(e.target.value)} onKeyDown={e => e.key === "Enter" && searchShipment()} placeholder="e.g. NDR-0003" style={{ ...st.input, marginBottom: 0, flex: 1 }} />
              <button onClick={searchShipment} style={{ ...st.btn, width: "auto", padding: "12px 20px", fontSize: 13 }}>Search</button>
            </div>
            {searchError && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>Shipment not found!</div>}

            {foundShipment && (
              <div>
                <div style={{ background: "#111", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>FOUND SHIPMENT</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{foundShipment.tracking_number}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{foundShipment.sender_name} → {foundShipment.receiver_name}</div>
                  <div style={{ fontSize: 13, color: "#f97316", marginTop: 4 }}>Current: {foundShipment.status || foundShipment.current_status}</div>
                </div>

                <label style={st.label}>New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ ...st.select, marginBottom: 24 }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>

                <button onClick={updateStatus} style={st.btn}>{updateLoading ? "Updating..." : "Update Status →"}</button>
                {updateSuccess && <div style={{ color: "#22c55e", marginTop: 12, fontSize: 13, textAlign: "center" }}>✅ Status updated successfully!</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}