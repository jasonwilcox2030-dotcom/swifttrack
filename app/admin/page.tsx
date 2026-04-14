"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Admin() {
  const [form, setForm] = useState({
    tracking_number: "",
    sender_name: "",
    sender_email: "",
    receiver_name: "",
    receiver_email: "",
    origin: "",
    destination: "",
    status: "In Transit",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function createShipment() {
    setLoading(true);
    const { error } = await supabase.from("shipments").insert([form]);
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setForm({
        tracking_number: "",
        sender_name: "",
        sender_email: "",
        receiver_name: "",
        receiver_email: "",
        origin: "",
        destination: "",
        status: "In Transit",
      });
    }
  }

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "40px 20px" }}>
      <h1 style={{ color: "#f97316", fontSize: "2rem", marginBottom: "8px" }}>SwiftTrack Admin</h1>
      <p style={{ color: "#888", marginBottom: "32px" }}>Create a new shipment</p>

      <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "24px", maxWidth: "600px" }}>
        {["tracking_number","sender_name","sender_email","receiver_name","receiver_email","origin","destination"].map((field) => (
          <div key={field} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#888", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase" }}>{field.replace(/_/g, " ")}</label>
            <input
              value={(form as any)[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "white", fontSize: "16px" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#888", marginBottom: "6px", fontSize: "13px", textTransform: "uppercase" }}>Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "white", fontSize: "16px" }}
          >
            <option>In Transit</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
            <option>On Hold</option>
          </select>
        </div>

        <button
          onClick={createShipment}
          style={{ background: "#f97316", color: "white", border: "none", borderRadius: "8px", padding: "14px 28px", fontSize: "16px", cursor: "pointer", width: "100%" }}
        >
          {loading ? "Creating..." : "Create Shipment"}
        </button>

        {success && <p style={{ color: "#22c55e", marginTop: "16px", textAlign: "center" }}>✅ Shipment created successfully!</p>}
      </div>
    </main>
  );
}