import { useState, useRef, useEffect } from "react";
import { useAppData } from "../data/AppDataContext";

const QUICK = [
  "Kitne donors available hain?",
  "Register karna hai",
  "Which blood group is most needed?",
  "Nearest hospital kaun si hai?",
];

export default function AIChatAgent() {
  const { donors, requests } = useAppData();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Assalamu Alaikum! Main BloodLink ka AI assistant hoon. Main Urdu, Roman Urdu, aur English mein help kar sakta hoon.\n\nAap mujhse pooch sakte hain:\n• Donor availability\n• Blood group requests\n• Hospital information\n• Registration guidance\n\nKya chahiye aapko?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildSystemPrompt = () => `You are BloodLink AI — a blood donation coordination assistant for Karachi, Pakistan. You understand Urdu, Roman Urdu, and English. Always respond in the same language the user writes in (if Roman Urdu, reply in Roman Urdu; if English, reply in English; if Urdu script, reply in Urdu).

LIVE SYSTEM DATA:
Active Blood Requests: ${JSON.stringify(requests.map(r => ({ hospital: r.hospital, bloodGroup: r.bloodGroup, units: r.units, urgency: r.urgency, fulfilled: r.fulfilled, status: r.status })))}
Registered Donors: ${JSON.stringify(donors.map(d => ({ name: d.name, bloodGroup: d.bloodGroup, area: d.area, available: d.available })))}

You can answer questions about:
- Blood availability and requests ("kitne O+ donors hain?")
- Registration guidance ("register karna hai")  
- Hospital needs ("kaunsa hospital critical hai?")
- General blood donation info

Keep responses concise and helpful. Use ✓ and → for formatting. Don't use markdown headers.`;

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [...history, { role: "user", content: userMsg }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text).join("") || "Maafi chahiye, kuch error hua. Try again karen.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "#f0ece4" }}>AI Agent</h2>
      <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>Urdu · Roman Urdu · English — ask anything about blood donation</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        {/* Chat */}
        <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, display: "flex", flexDirection: "column", height: 560 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "72%", padding: "10px 14px", borderRadius: 12,
                  background: m.role === "user" ? "#c0392b" : "#1e1e1e",
                  color: "#f0ece4", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
                  borderBottomRightRadius: m.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: m.role === "assistant" ? 4 : 12,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🤖</div>
                <div style={{ padding: "10px 14px", background: "#1e1e1e", borderRadius: 12, borderBottomLeftRadius: 4 }}>
                  <span style={{ color: "#555", fontSize: 20, letterSpacing: 4 }}>···</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e1e", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && send()}
              placeholder="Type in Urdu, Roman Urdu, or English..."
              style={{ flex: 1, padding: "10px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#f0ece4", fontSize: 14, outline: "none" }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()}
              style={{ padding: "10px 18px", background: loading ? "#333" : "#c0392b", border: "none", borderRadius: 10, color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, transition: "background 0.15s" }}>
              →
            </button>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Questions</p>
            {QUICK.map((q, i) => (
              <button key={i} onClick={() => send(q)}
                style={{ width: "100%", padding: "9px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#aaa", cursor: "pointer", fontSize: 13, textAlign: "left", marginBottom: 6, transition: "all 0.12s", display: "block" }}
                onMouseEnter={e => { e.target.style.borderColor = "#c0392b"; e.target.style.color = "#f0ece4"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.color = "#aaa"; }}>
                "{q}"
              </button>
            ))}
          </div>

          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Stats</p>
            {[
              { label: "Active Donors", value: "4", color: "#27ae60" },
              { label: "Pending Requests", value: "2", color: "#e67e22" },
              { label: "Critical Needs", value: "1", color: "#c0392b" },
              { label: "Fulfilled Today", value: "2", color: "#3498db" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#666" }}>{s.label}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
