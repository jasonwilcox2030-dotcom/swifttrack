"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATUSES = ["Label Created","Picked Up","In Transit","Arrived at Facility","Out for Delivery","Delivered","On Hold","Exception"];

export default function Admin() {
  const [tab, setTab] = useState<"dashboard"|"shipments"|"create"|"update">("dashboard");
  const [shipments, setShipments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loadingShipments, setLoadingShipments] = useState(false);

  // CREATE
  const [form, setForm] = useState({
    tracking_number: "", sender_name: "", sender_email: "", sender_phone: "",
    sender_address: "", receiver_name: "", receiver_email: "", receiver_phone: "",
    receiver_address: "", origin: "", destination: "", service_type: "Standard",
    package_weight: "", estimated_delivery_date: "", status: "Label Created", current_location: "",
  });
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // UPDATE
  const [searchTrk, setSearchTrk] = useState("");
  const [foundShipment, setFoundShipment] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (tab === "dashboard" || tab === "shipments") fetchShipments();
  }, [tab]);

  async function fetchShipments() {
    setLoadingShipments(true);
    const { data } = await supabase.from("shipments").select("*").order("created_at", { ascending: false });
    setShipments(data || []);
    setLoadingShipments(false);
  }

  async function deleteShipment(id: string) {
    if (!confirm("Delete this shipment?")) return;
    await supabase.from("shipments").delete().eq("id", id);
    fetchShipments();
    if (selected?.id === id) setSelected(null);
  }

  async function createShipment() {
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(false);
    const trackNum = form.tracking_number || `NDR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    const { error } = await supabase.from("shipments").insert([{ ...form, tracking_number: trackNum }]);
    setCreateLoading(false);
    if (error) { setCreateError(error.message); return; }
    setCreateSuccess(true);
    setForm({ tracking_number: "", sender_name: "", sender_email: "", sender_phone: "", sender_address: "", receiver_name: "", receiver_email: "", receiver_phone: "", receiver_address: "", origin: "", destination: "", service_type: "Standard", package_weight: "", estimated_delivery_date: "", status: "Label Created", current_location: "" });
  }

  async function searchShipment() {
    setSearchError(false);
    setFoundShipment(null);
    setUpdateSuccess(false);
    const { data } = await supabase.from("shipments").select("*").eq("tracking_number", searchTrk.trim()).single();
    if (!data) { setSearchError(true); return; }
    setFoundShipment(data);
    setNewStatus(data.status || data.current_status || "In Transit");
    setNewLocation(data.current_location || "");
  }

  async function updateShipment() {
    setUpdateLoading(true);
    setUpdateSuccess(false);
    await supabase.from("shipments").update({ status: newStatus, current_status: newStatus, current_location: newLocation }).eq("id", foundShipment.id);
    setUpdateLoading(false);
    setUpdateSuccess(true);
    setFoundShipment({ ...foundShipment, status: newStatus, current_status: newStatus, current_location: newLocation });
  }

  const filtered = shipments.filter(s => {
    const matchSearch = s.tracking_number?.toLowerCase().includes(search.toLowerCase()) || s.sender_name?.toLowerCase().includes(search.toLowerCase()) || s.receiver_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || s.status === filterStatus || s.current_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => (s.status || s.current_status) === "In Transit").length,
    delivered: shipments.filter(s => (s.status || s.current_status) === "Delivered").length,
    onHold: shipments.filter(s => (s.status || s.current_status) === "On Hold").length,
  };

  const st: any = {
    page: { background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif" },
    sidebar: { position: "fixed" as const, left: 0, top: 0, bottom: 0, width: 220, background: "#0d0d0b", borderRight: "1px solid #1a1a17", padding: "24px 16px", zIndex: 100 },
    main: { marginLeft: 220, padding: "32px 24px", minHeight: "100vh" },
    logo: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#f97316", marginBottom: 32 },
    navBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", background: "none", color: "#444", fontSize: 13, cursor: "pointer", width: "100%", textAlign: "left" as const, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" },
    navBtnActive: { background: "#f9731615", color: "#f97316", borderLeft: "2px solid #f97316" },
    card: { background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 16, padding: 20, marginBottom: 12 },
    statCard: { background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 16, padding: 20, flex: 1 },
    input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 16 },
    select: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 16 },
    btn: { padding: "12px 24px", background: "#f97316", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" },
    label: { display: "block", fontSize: 10, color: "#444", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6 },
    badge: { padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 500 },
  };

  const statusColor: any = {
    "Label Created": "#888780", "Picked Up": "#f97316", "In Transit": "#f97316",
    "Arrived at Facility": "#f97316", "Out for Delivery": "#f97316",
    "Delivered": "#22c55e", "On Hold": "#d97706", "Exception": "#dc2626",
  };

  const fields = [
    { key: "tracking_number", label: "Tracking Number (leave blank to auto-generate)" },
    { key: "sender_name", label: "Sender Name" }, { key: "sender_email", label: "Sender Email" },
    { key: "sender_phone", label: "Sender Phone" }, { key: "sender_address", label: "Sender Address" },
    { key: "receiver_name", label: "Receiver Name" }, { key: "receiver_email", label: "Receiver Email" },
    { key: "receiver_phone", label: "Receiver Phone" }, { key: "receiver_address", label: "Receiver Address" },
    { key: "origin", label: "Origin City" }, { key: "destination", label: "Destination City" },
    { key: "current_location", label: "Current Location" },
    { key: "package_weight", label: "Package Weight (kg)" }, { key: "estimated_delivery_date", label: "Est. Delivery Date" },
  ];

  return (
    <main style={st.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* SIDEBAR */}
      <div style={st.sidebar}>
        <div style={st.logo}>NDR Admin</div>
        {[
          { id: "dashboard", icon: "📊", label: "Dashboard" },
          { id: "shipments", icon: "📦", label: "All Shipments" },
          { id: "create", icon: "➕", label: "Create Shipment" },
          { id: "update", icon: "✏️", label: "Update Status" },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id as any)} style={{ ...st.navBtn, ...(tab === item.id ? st.navBtnActive : {}) }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={st.main}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Dashboard</div>
            <div style={{ color: "#444", fontSize: 13, marginBottom: 28 }}>Welcome back, Jason 👋</div>

            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" as const }}>
              {[
                { label: "Total Shipments", value: stats.total, color: "#f97316" },
                { label: "In Transit", value: stats.inTransit, color: "#f97316" },
                { label: "Delivered", value: stats.delivered, color: "#22c55e" },
                { label: "On Hold", value: stats.onHold, color: "#d97706" },
              ].map(stat => (
                <div key={stat.label} style={st.statCard}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={st.card}>
              <div style={{ fontSize: 13, color: "#444", marginBottom: 16 }}>RECENT SHIPMENTS</div>
              {shipments.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1a1a17" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.tracking_number}</div>
                    <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{s.sender_name} → {s.receiver_name}</div>
                  </div>
                  <div style={{ ...st.badge, background: (statusColor[s.status || s.current_status] || "#888") + "20", color: statusColor[s.status || s.current_status] || "#888" }}>
                    {s.status || s.current_status || "Unknown"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL SHIPMENTS */}
        {tab === "shipments" && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>All Shipments</div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" as const }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or tracking #..." style={{ ...st.input, marginBottom: 0, flex: 1, minWidth: 200 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...st.select, marginBottom: 0, width: "auto" }}>
                <option>All</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {selected ? (
              <div>
                <button onClick={() => setSelected(null)} style={{ ...st.btn, background: "none", color: "#444", border: "1px solid #1a1a17", marginBottom: 16 }}>← Back to list</button>
                <div style={st.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700 }}>{selected.tracking_number}</div>
                    <button onClick={() => deleteShipment(selected.id)} style={{ ...st.btn, background: "#dc2626", fontSize: 12, padding: "8px 16px" }}>🗑️ Delete</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      ["Status", selected.status || selected.current_status],
                      ["Current Location", selected.current_location || "—"],
                      ["Service", selected.service_type],
                      ["Weight", selected.package_weight ? selected.package_weight + " kg" : "—"],
                      ["Est. Delivery", selected.estimated_delivery_date || "—"],
                      ["Origin", selected.origin],
                      ["Destination", selected.destination],
                      ["Sender", selected.sender_name],
                      ["Sender Email", selected.sender_email],
                      ["Sender Phone", selected.sender_phone],
                      ["Sender Address", selected.sender_address],
                      ["Receiver", selected.receiver_name],
                      ["Receiver Email", selected.receiver_email],
                      ["Receiver Phone", selected.receiver_phone],
                      ["Receiver Address", selected.receiver_address],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 13, color: "#ccc" }}>{value || "—"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={st.card}>
                {loadingShipments ? <div style={{ color: "#444", textAlign: "center", padding: 40 }}>Loading...</div> : filtered.length === 0 ? <div style={{ color: "#444", textAlign: "center", padding: 40 }}>No shipments found</div> : filtered.map(s => (
                  <div key={s.id} onClick={() => setSelected(s)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #1a1a17", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.tracking_number}</div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{s.sender_name} → {s.receiver_name}</div>
                      <div style={{ fontSize: 11, color: "#333", marginTop: 2 }}>{s.origin} → {s.destination}</div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div style={{ ...st.badge, background: (statusColor[s.status || s.current_status] || "#888") + "20", color: statusColor[s.status || s.current_status] || "#888", marginBottom: 4 }}>
                        {s.status || s.current_status || "Unknown"}
                      </div>
                      <div style={{ fontSize: 10, color: "#333" }}>{s.current_location || ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREATE */}
        {tab === "create" && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Create Shipment</div>
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
              <button onClick={createShipment} style={{ ...st.btn, width: "100%" }}>{createLoading ? "Creating..." : "Create Shipment →"}</button>
              {createError && <div style={{ color: "#ef4444", marginTop: 12, fontSize: 13 }}>{createError}</div>}
              {createSuccess && <div style={{ color: "#22c55e", marginTop: 12, fontSize: 13, textAlign: "center" }}>✅ Shipment created!</div>}
            </div>
          </div>
        )}

        {/* UPDATE */}
        {tab === "update" && (
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Update Status</div>
            <div style={st.card}>
              <label style={st.label}>Tracking Number</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input value={searchTrk} onChange={e => setSearchTrk(e.target.value)} onKeyDown={e => e.key === "Enter" && searchShipment()} placeholder="e.g. NDR-2026-00001" style={{ ...st.input, marginBottom: 0, flex: 1 }} />
                <button onClick={searchShipment} style={{ ...st.btn, whiteSpace: "nowrap" as const }}>Search</button>
              </div>
              {searchError && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>Shipment not found!</div>}

              {foundShipment && (
                <div>
                  <div style={{ background: "#111", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>FOUND SHIPMENT</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{foundShipment.tracking_number}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>{foundShipment.sender_name} → {foundShipment.receiver_name}</div>
                    <div style={{ fontSize: 13, color: "#f97316", marginTop: 4 }}>Current: {foundShipment.status || foundShipment.current_status}</div>
                    {foundShipment.current_location && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>📍 {foundShipment.current_location}</div>}
                  </div>

                  <label style={st.label}>New Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={st.select}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>

                  <label style={st.label}>Current Location</label>
                  <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="e.g. Dallas, TX sorting facility" style={st.input} />

                  <button onClick={updateShipment} style={{ ...st.btn, width: "100%" }}>{updateLoading ? "Updating..." : "Update Shipment →"}</button>
                  {updateSuccess && <div style={{ color: "#22c55e", marginTop: 12, fontSize: 13, textAlign: "center" }}>✅ Updated successfully!</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}