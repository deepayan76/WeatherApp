import { useState } from "react";
import axios from "axios";

function getTheme(weatherId) {
  if (!weatherId) return { from: "#0f0c29", via: "#302b63", to: "#24243e", glow: "rgba(99,102,241,0.3)" };
  if (weatherId >= 200 && weatherId < 300) return { from: "#0f0c29", via: "#1a1a2e", to: "#16213e", glow: "rgba(148,163,184,0.3)" };
  if (weatherId >= 300 && weatherId < 600) return { from: "#0c1445", via: "#1e3a5f", to: "#0f0c29", glow: "rgba(96,165,250,0.35)" };
  if (weatherId >= 600 && weatherId < 700) return { from: "#1a2a4a", via: "#2d4a7a", to: "#1a3a5c", glow: "rgba(186,230,253,0.3)" };
  if (weatherId >= 700 && weatherId < 800) return { from: "#1a1a2e", via: "#2d2d44", to: "#16213e", glow: "rgba(209,213,219,0.2)" };
  if (weatherId === 800) return { from: "#0c1e3d", via: "#1a4a8a", to: "#0f3460", glow: "rgba(251,191,36,0.35)" };
  if (weatherId > 800) return { from: "#1a2a4a", via: "#2d3e5f", to: "#1e2d4a", glow: "rgba(147,197,253,0.3)" };
  return { from: "#0f0c29", via: "#302b63", to: "#24243e", glow: "rgba(99,102,241,0.3)" };
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "6px", padding: "1rem 0.75rem",
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
    }}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = getTheme(weather?.weather?.[0]?.id);

  const getWeather = async () => {
    const trimmed = city.trim();
    if (!trimmed) return;
    try {
      setError(""); setLoading(true); setWeather(null);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(trimmed)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeather(res.data);
    } catch (err) {
      if (err.response?.status === 401) setError("Session expired. Please log in again.");
      else if (err.response?.status === 404) setError(`City "${trimmed}" not found. Check the spelling and try again.`);
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.via} 50%, ${theme.to} 100%)`,
      fontFamily: "'Inter', system-ui, sans-serif",
      transition: "background 1.2s ease",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow orb */}
      <div style={{
        position: "fixed", top: "-100px", right: "-100px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Top bar ── */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: "720px", margin: "0 auto",
        padding: "1.5rem 1.5rem 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>🌤️</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>SkyWatch</span>
        </div>
        <button
          id="logout-btn"
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
          style={{
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px", color: "#fca5a5",
            padding: "0.5rem 1rem", fontSize: "0.82rem", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.28)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
        >
          🚪 Logout
        </button>
      </div>

      {/* ── Search bar ── */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "1.75rem auto 0", padding: "0 1.5rem" }}>
        <div style={{
          display: "flex", gap: "10px",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "18px", padding: "8px",
        }}>
          <input
            id="city-search"
            placeholder="Search for a city…"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: "0.95rem", padding: "0.6rem 0.75rem",
            }}
          />
          <button
            id="search-btn"
            onClick={getWeather}
            disabled={loading}
            style={{
              padding: "0.6rem 1.6rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: "12px",
              color: "#fff", fontSize: "0.9rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              minWidth: "100px", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading
              ? <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : "Search"
            }
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "1rem auto 0", padding: "0 1.5rem" }}>
          <div style={{
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "14px", padding: "1rem 1.25rem",
            color: "#fca5a5", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "10px",
          }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* ── Weather card ── */}
      {weather && !loading && (
        <div style={{
          position: "relative", zIndex: 10, maxWidth: "720px",
          margin: "1.5rem auto 3rem", padding: "0 1.5rem",
          animation: "fadeUp 0.5s ease forwards",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "24px", padding: "2rem",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          }}>
            {/* City row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                  {weather.name}
                  {weather.sys?.country && (
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1rem", fontWeight: 400, marginLeft: "8px" }}>
                      {weather.sys.country}
                    </span>
                  )}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.55)", margin: "6px 0 0", fontSize: "0.95rem", textTransform: "capitalize" }}>
                  {weather.weather?.[0]?.description}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                alt={weather.weather?.[0]?.description}
                style={{ width: "80px", height: "80px", filter: "drop-shadow(0 0 16px rgba(255,255,255,0.25))" }}
              />
            </div>

            {/* Temperature */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ lineHeight: 1 }}>
                <span style={{ color: "#fff", fontSize: "5.5rem", fontWeight: 800 }}>{Math.round(weather.main?.temp)}</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "2.5rem", fontWeight: 600 }}>°C</span>
              </div>
              <div style={{ paddingBottom: "6px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>
                  Feels like <span style={{ color: "#fff", fontWeight: 600 }}>{Math.round(weather.main?.feels_like)}°C</span>
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", margin: "4px 0 0" }}>
                  H: {Math.round(weather.main?.temp_max)}°  ·  L: {Math.round(weather.main?.temp_min)}°
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              <StatCard icon="💧" label="Humidity" value={`${weather.main?.humidity}%`} />
              <StatCard icon="💨" label="Wind" value={`${Math.round((weather.wind?.speed || 0) * 3.6)} km/h`} />
              <StatCard icon="🌡️" label="Pressure" value={`${weather.main?.pressure} hPa`} />
              <StatCard icon="👁️" label="Visibility" value={weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : "N/A"} />
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!weather && !loading && !error && (
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", paddingTop: "5rem", textAlign: "center",
        }}>
          <span style={{ fontSize: "5rem", marginBottom: "1rem" }}>🌍</span>
          <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 600, margin: 0 }}>Search for a city</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem", fontSize: "0.9rem", maxWidth: "280px" }}>
            Type a city name and press Search or Enter to get live weather.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "1.5rem auto", padding: "0 1.5rem" }}>
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "24px", padding: "2rem",
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ height: "32px", width: "180px", background: "rgba(255,255,255,0.1)", borderRadius: "8px", marginBottom: "10px" }} />
                <div style={{ height: "16px", width: "100px", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
              </div>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{ height: "80px", width: "220px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", marginBottom: "2rem" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: "88px", background: "rgba(255,255,255,0.07)", borderRadius: "16px" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
