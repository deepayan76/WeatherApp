import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    try {
      setError("");
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/weather");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow orbs */}
      <div style={{
        position: "absolute", top: "-80px", left: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", right: "-80px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "24px",
        padding: "2.5rem 2.5rem",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            fontSize: "2rem",
            boxShadow: "0 8px 24px rgba(99,102,241,0.5)",
          }}>🌤️</div>
        </div>

        <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, textAlign: "center", margin: 0 }}>
          Welcome back
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "0.4rem", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Sign in to SkyWatch
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%", padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", color: "#fff", fontSize: "0.9rem",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", color: "#fff", fontSize: "0.9rem",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              color: "#fca5a5",
              fontSize: "0.85rem",
              marginBottom: "1.2rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "0.9rem",
              background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none", borderRadius: "12px",
              color: "#fff", fontSize: "0.95rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.45)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.6)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(99,102,241,0.45)"; }}
          >
            {loading ? (
              <>
                <span style={{
                  display: "inline-block", width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                  borderRadius: "50%", animation: "spin 0.7s linear infinite",
                }} />
                Signing in…
              </>
            ) : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: "1.5rem", marginBottom: 0 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#a5b4fc", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.target.style.color = "#a5b4fc")}>
            Create one
          </Link>
        </p>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
