import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      setError("");
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", { email, password });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", color: "#fff", fontSize: "0.9rem",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f0c29 0%, #24243e 40%, #302b63 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "1.5rem", position: "relative", overflow: "hidden",
    }}>
      {/* Glow orbs */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px", width: "450px", height: "450px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", left: "-60px", width: "400px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "440px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.18)", borderRadius: "24px",
        padding: "2.5rem",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
        position: "relative", zIndex: 10,
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            fontSize: "2rem", boxShadow: "0 8px 24px rgba(139,92,246,0.5)",
          }}>🌍</div>
        </div>

        <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, textAlign: "center", margin: 0 }}>
          Create account
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "0.4rem", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Join SkyWatch for free
        </p>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <p style={{ color: "#86efac", fontWeight: 600, fontSize: "1rem" }}>
              Account created! Redirecting to login…
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Email address
              </label>
              <input
                id="register-email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Password
              </label>
              <input
                id="register-password" type="password" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
                Confirm password
              </label>
              <input
                id="register-confirm" type="password" placeholder="Re-enter password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: "12px", padding: "0.75rem 1rem",
                color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1.2rem",
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit" type="submit" disabled={loading}
              style={{
                width: "100%", padding: "0.9rem",
                background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                border: "none", borderRadius: "12px", color: "#fff",
                fontSize: "0.95rem", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.45)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? (
                <>
                  <span style={{
                    display: "inline-block", width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                    borderRadius: "50%", animation: "spin 0.7s linear infinite",
                  }} />
                  Creating account…
                </>
              ) : "Create account"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "1.5rem", marginBottom: 0 }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#c4b5fd", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "#a5b4fc")}
            onMouseLeave={(e) => (e.target.style.color = "#c4b5fd")}>
            Sign in
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
