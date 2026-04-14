"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [form, setForm] = useState({
    tracking_number: "",
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    sender_address: "",
    receiver_name: "",
    receiver_email: "",
    receiver_phone: "",
    receiver_address: "",
    origin: "",
    destination: "",
    service_type: "Standard",
    package_weight: "",
    estimated_delivery_date: "",
    status: "Label Created",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function createShipment() {
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);
    const { error } = await supabase.from("shipments").insert([form]);
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      setForm({
        tracking_number: "",
        sender_name: "",
        sender_email: "",
        sender_phone: "",
        sender_address: "",
        receiver_name: "",
        receiver_email: "",
        receiver_phone: "",
        receiver_address: "",
        origin: "",
        destination: "",
        service_type: "Standard",
        package_weight: "",
        estimated_delivery_date: "",
        status: "Label Created",
      });
    }
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

  return (
    <main style={{ background: "#060605", minHeight: "100vh", color: "#eeede6", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f97316", marginBottom: 4 }}>NextDayRoute</div>
        <div style={{ color: "#444", fontSize: 14, marginBottom: 40 }}>Admin — Create Shipment</div>

        <div style={{ background: "#0d0d0b", border: "1px solid #1a1a17", borderRadius: 16, padding: 24 }}>
          {fields.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Service Type</label>
            <select value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
              <option>Standard</option>
              <option>Express</option>
              <option>Priority</option>
              <option>Overnight</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #1a1a17", background: "#111", color: "#eeede6", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
              <option>Label Created</option>
              <option>Picked Up</option>
              <option>In Transit</option>
              <option>Arrived at Facility</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>On Hold</option>
              <option>Exception</option>
            </select>
          </div>

          <button onClick={createShipment} style={{ width: "100%", padding: "14px", background: "#f97316", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            {loading ? "Creating..." : "Create Shipment →"}
          </button>

          {errorMsg && <div style={{ color: "#ef4444", marginTop: 12, fontSize: 13 }}>{errorMsg}</div>}
          {success && <div style={{ color: "#22c55e", marginTop: 12, fontSize: 13, textAlign: "center" }}>✅ Shipment created successfully!</div>}
        </div>
      </div>
    </main>
  );
}