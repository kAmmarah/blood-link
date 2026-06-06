import { useState } from "react";
import { useAppData } from "../data/AppDataContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AREAS = ["Clifton", "Defence", "Gulshan-e-Iqbal", "Nazimabad", "North Karachi", "Korangi", "Saddar", "Malir", "Landhi", "Baldia"];

export default function DonorRegistration() {
  const { donors, requests, addDonor, confirmDonor } = useAppData();
  const [form, setForm] = useState({ name: "", bloodGroup: "O+", area: "Clifton", lastDonation: "" });
  const [registered, setRegistered] = useState(false);
  const [alerts, setAlerts] = useState([
    { id: 1, requestId: 1, hospital: "Aga Khan Hospital", bloodGroup: "O+", urgency: "critical", dismissed: false },
  ]);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    addDonor(form);
    setRegistered(true);
    setTimeout(() => setRegistered(false), 3000);
    setForm({ name: "", bloodGroup: "O+", area: "Clifton", lastDonation: "" });
  };

  const confirmAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, dismissed: true, confirmed: true } : a));
  };

  const skipAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, dismissed: true } : a));
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#f0ece4" }}>Donor Portal</h2>
      <p style={{ color: "#666", marginBottom: 28, fontSize: 14 }}>Register as a donor — get alerts when your blood group is needed nearby</p>

      {/* Incoming Alerts */}
      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>🔴 Incoming Alerts</p>
          {activeAlerts.map(alert => (
            <div key={alert.id} style={{ background: "#1e0d0d", border: "1px solid #c0392b", borderRadius: 14, padding: 20, marginBottom: 10, animation: "pulse 2s infinite" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>⚡ {alert.urgency} need</span>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#f0ece4", margin: "4px 0" }}>{alert.hospital} needs <span style={{ color: "#c0392b" }}>{alert.bloodGroup}</span></p>
                  <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Within 5km of your area</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => skipAlert(alert.id)}
                    style={{ padding: "10px 18px", background: "#1e1e1e", border: "1px solid #333", borderRadius: 10, color: "#888", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                    Skip
                  </button>
                  <button onClick={() => confirmAlert(alert.id)}
                    style={{ padding: "10px 20px", background: "#c0392b", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                    Confirm ✓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Registration Form */}
        <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.08em" }}>Register as Donor</p>

          <label style={lStyle}>Full Name</label>
          <input value={form.name} onChange={e => handle("name", e.target.value)} placeholder="Your name"
            style={inputStyle} />

          <label style={lStyle}>Blood Group</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {BLOOD_GROUPS.map(g => (
              <button key={g} onClick={() => handle("bloodGroup", g)}
                style={{ padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.12s", border: form.bloodGroup === g ? "1px solid #c0392b" : "1px solid #2a2a2a", background: form.bloodGroup === g ? "#c0392b" : "#1e1e1e", color: form.bloodGroup === g ? "#fff" : "#888" }}>
                {g}
              </button>
            ))}
          </div>

          <label style={lStyle}>Area</label>
          <select value={form.area} onChange={e => handle("area", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {AREAS.map(a => <option key={a} value={a} style={{ background: "#1a1a1a" }}>{a}</option>)}
          </select>

          <label style={lStyle}>Last Donation Date</label>
          <input type="date" value={form.lastDonation} onChange={e => handle("lastDonation", e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }} />

          <button onClick={submit}
            style={{ width: "100%", padding: "12px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Register as Donor →
          </button>
          {registered && <div style={{ marginTop: 12, padding: "10px 14px", background: "#0e2b1a", border: "1px solid #27ae60", borderRadius: 8, color: "#27ae60", fontSize: 13 }}>
            ✓ Registered! You'll receive alerts when needed.
          </div>}
        </div>

        {/* Donor List */}
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Registered Donors</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {donors.map(d => (
              <div key={d.id} style={{ background: "#161616", border: "1px solid #222", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#c0392b22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c0392b" }}>{d.bloodGroup}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#f0ece4" }}>{d.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{d.area} · Last donated: {d.lastDonation || "Not recorded"}</p>
                  </div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 6, background: d.available ? "#0e2b1a" : "#1a1a1a", color: d.available ? "#27ae60" : "#555" }}>
                  {d.available ? "Available" : "On hold"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const lStyle = { fontSize: 12, color: "#666", marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: "0.06em" };
const inputStyle = { width: "100%", padding: "10px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#f0ece4", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" };
