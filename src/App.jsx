import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import CalendarView from "./components/CalendarView";
import DailyInsights from "./components/DailyInsights";
import WeeklyInsights from "./components/WeeklyInsights";
import Simulation from "./components/Simulation";
import InputForm from "./components/InputForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyPage from "./pages/VerifyPage";
import VerifyNotice from "./pages/VerifyNotice";

export default function App() {
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const path = window.location.pathname;
  const isVerifyPage = path.startsWith("/verify/");
  const verifyToken = isVerifyPage
    ? decodeURIComponent(path.replace("/verify/", ""))
    : null;

  const [isAuthenticated, setIsAuthenticated] = useState(
    !isVerifyPage && !!localStorage.getItem("token")
  );

  const [authMode, setAuthMode] = useState("login");
  const [stats, setStats] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [streakData, setStreakData] = useState({});

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch dashboard");
      }

      setStats(data.stats || {});
      setWeeklyData(data.weeklyData || []);
      setWeeklySummary(data.weeklySummary || {});
      setStreakData(data.streakData || {});
    } catch (error) {
      console.error("Fetch dashboard failed:", error);
    }
  };

  const handleDataUpdate = async () => {
    await fetchDashboard();
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isVerifyPage && isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated, isVerifyPage]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(false);
    setAuthMode("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthMode("login");
    setStats({});
    setWeeklyData([]);
    setWeeklySummary({});
    setStreakData({});
    setRefreshKey(0);
  };

if (isVerifyPage) {
  return <VerifyPage token={verifyToken} />;
}

if (showVerifyNotice) {
  return (
    <VerifyNotice
      email={verifyEmail}
      isDark={isDark}
      onGoToLogin={() => {
        setShowVerifyNotice(false);
        setAuthMode("login");
      }}
    />
  );
}

if (!isAuthenticated) {
  return authMode === "login" ? (
    <Login
      onLogin={handleLogin}
      onSwitchToSignup={() => setAuthMode("signup")}
      isDark={isDark}
    />
  ) : (
    <Signup
      onSignup={(email) => {
        setVerifyEmail(email);
        setShowVerifyNotice(true);
      }}
      onSwitchToLogin={() => setAuthMode("login")}
      isDark={isDark}
    />
  );
}

const codingHours = Number(stats?.codingHours || 0);
const studyHours = Number(stats?.studyHours || 0);
const learningVideoHours = Number(stats?.learningVideoHours || 0);
const planningThinkingHours = Number(stats?.planningThinkingHours || 0);
const entertainmentHours = Number(stats?.entertainmentHours || 0);
const unproductiveHours = Number(stats?.unproductiveHours || 0);
const deepWorkHours = Number(stats?.deepWorkHours || 0);

const productiveHours =
  codingHours +
  studyHours +
  learningVideoHours +
  planningThinkingHours;

const distractingHours = entertainmentHours + unproductiveHours;

const deepWorkScore =
  productiveHours > 0
    ? ((deepWorkHours / productiveHours) * 100).toFixed(2)
    : "0.00";

const currentProductivityScore =
  productiveHours + distractingHours > 0
    ? (
        (productiveHours / (productiveHours + distractingHours)) *
        100
      ).toFixed(2)
    : "0.00";

  return (
    <>
      <style>{`
        @keyframes driftSlow {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          25% { transform: translate3d(30px, -20px, 0) scale(1.05); }
          50% { transform: translate3d(-20px, 25px, 0) scale(0.98); }
          75% { transform: translate3d(20px, 10px, 0) scale(1.02); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes driftMedium {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          25% { transform: translate3d(-35px, 20px, 0) scale(1.04); }
          50% { transform: translate3d(20px, -25px, 0) scale(0.97); }
          75% { transform: translate3d(-15px, -10px, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes gridShift {
          0% { background-position: 0px 0px, 0px 0px; }
          100% { background-position: 60px 60px, 60px 60px; }
        }

        @keyframes floatParticle {
          0% { transform: translateY(0px); opacity: 0.25; }
          50% { transform: translateY(-18px); opacity: 0.55; }
          100% { transform: translateY(0px); opacity: 0.25; }
        }

        @keyframes cyberSlide {
          0% { background-position: 0px 0px, 0px 0px; }
          100% { background-position: 220px 0px, 440px 0px; }
        }

        @keyframes scanBeam {
          0% { transform: translateY(-15%); opacity: 0; }
          15% { opacity: 0.18; }
          50% { opacity: 0.30; }
          85% { opacity: 0.16; }
          100% { transform: translateY(115%); opacity: 0; }
        }

        @keyframes linePulse {
          0%, 100% { opacity: 0.20; }
          50% { opacity: 0.48; }
        }

        .bg-drift-slow {
          animation: driftSlow 18s ease-in-out infinite;
        }

        .bg-drift-medium {
          animation: driftMedium 24s ease-in-out infinite;
        }

        .bg-grid-animated {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 42px 42px;
          animation: gridShift 18s linear infinite;
        }

        .particle-float {
          animation: floatParticle 6s ease-in-out infinite;
        }

        .cyber-lines-dark {
          background-image:
            repeating-linear-gradient(
              115deg,
              rgba(34, 211, 238, 0.18) 0px,
              rgba(34, 211, 238, 0.18) 2px,
              transparent 2px,
              transparent 30px
            ),
            repeating-linear-gradient(
              115deg,
              rgba(168, 85, 247, 0.14) 0px,
              rgba(168, 85, 247, 0.14) 2px,
              transparent 2px,
              transparent 60px
            );
          background-size: 220px 220px, 440px 440px;
          background-repeat: repeat;
          animation: cyberSlide 8s linear infinite;
          mix-blend-mode: screen;
        }

        .cyber-lines-light {
          background-image:
            repeating-linear-gradient(
              115deg,
              rgba(14, 165, 233, 0.12) 0px,
              rgba(14, 165, 233, 0.12) 2px,
              transparent 2px,
              transparent 30px
            ),
            repeating-linear-gradient(
              115deg,
              rgba(168, 85, 247, 0.10) 0px,
              rgba(168, 85, 247, 0.10) 2px,
              transparent 2px,
              transparent 60px
            );
          background-size: 220px 220px, 440px 440px;
          background-repeat: repeat;
          animation: cyberSlide 8s linear infinite;
          mix-blend-mode: multiply;
        }

        .scan-beam {
          animation: scanBeam 6s linear infinite;
          mix-blend-mode: screen;
        }

        .line-pulse {
          animation: linePulse 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
          isDark
            ? "bg-[#020617] text-white"
            : "bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? "cyber-lines-dark opacity-[0.45]"
              : "cyber-lines-light opacity-[0.32]"
          }`}
        />

        {isDark && (
          <>
            <div className="pointer-events-none absolute inset-0">
              <div className="bg-drift-slow absolute -left-24 top-[-80px] h-[320px] w-[320px] rounded-full bg-cyan-400/12 blur-3xl" />
              <div className="bg-drift-medium absolute right-[-100px] top-[120px] h-[360px] w-[360px] rounded-full bg-violet-500/12 blur-3xl" />
              <div className="bg-drift-slow absolute bottom-[-120px] left-[20%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-3xl" />
              <div className="bg-drift-medium absolute bottom-[10%] right-[15%] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-3xl" />
            </div>

            <div className="bg-grid-animated pointer-events-none absolute inset-0 opacity-[0.10]" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="scan-beam absolute left-0 top-0 h-[28%] w-full bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.18),transparent)] blur-xl" />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="line-pulse absolute left-[8%] top-[18%] h-px w-[22%] bg-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
              <div
                className="line-pulse absolute right-[10%] top-[28%] h-px w-[18%] bg-fuchsia-400/50 shadow-[0_0_18px_rgba(217,70,239,0.65)]"
                style={{ animationDelay: "1.2s" }}
              />
              <div
                className="line-pulse absolute left-[14%] bottom-[22%] h-px w-[16%] bg-violet-400/50 shadow-[0_0_18px_rgba(168,85,247,0.65)]"
                style={{ animationDelay: "2s" }}
              />
              <div
                className="line-pulse absolute right-[14%] bottom-[16%] h-px w-[24%] bg-cyan-300/45 shadow-[0_0_18px_rgba(103,232,249,0.55)]"
                style={{ animationDelay: "0.8s" }}
              />
            </div>

            <div className="pointer-events-none absolute inset-0">
              {[
                { left: "8%", top: "18%", delay: "0s" },
                { left: "18%", top: "72%", delay: "1.2s" },
                { left: "28%", top: "36%", delay: "2.2s" },
                { left: "44%", top: "14%", delay: "0.8s" },
                { left: "58%", top: "62%", delay: "1.8s" },
                { left: "72%", top: "28%", delay: "2.8s" },
                { left: "84%", top: "76%", delay: "1.4s" },
                { left: "90%", top: "20%", delay: "2.4s" },
              ].map((particle, index) => (
                <span
                  key={index}
                  className="particle-float absolute h-1.5 w-1.5 rounded-full bg-cyan-300/40 shadow-[0_0_14px_rgba(34,211,238,0.6)]"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    animationDelay: particle.delay,
                  }}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%),radial-gradient(circle_at_center,transparent,rgba(2,6,23,0.28)_75%)]" />
          </>
        )}

        {!isDark && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />

            <div className="pointer-events-none absolute inset-0">
              <div className="bg-drift-slow absolute -left-24 top-[-80px] h-[280px] w-[280px] rounded-full bg-sky-300/20 blur-3xl" />
              <div className="bg-drift-medium absolute right-[-90px] top-[120px] h-[320px] w-[320px] rounded-full bg-violet-300/18 blur-3xl" />
              <div className="bg-drift-slow absolute bottom-[-100px] left-[18%] h-[260px] w-[260px] rounded-full bg-cyan-200/18 blur-3xl" />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="line-pulse absolute left-[10%] top-[20%] h-px w-[20%] bg-sky-500/35 shadow-[0_0_14px_rgba(14,165,233,0.25)]" />
              <div
                className="line-pulse absolute right-[12%] top-[30%] h-px w-[16%] bg-violet-500/30 shadow-[0_0_14px_rgba(168,85,247,0.22)]"
                style={{ animationDelay: "1.1s" }}
              />
              <div
                className="line-pulse absolute left-[16%] bottom-[24%] h-px w-[18%] bg-cyan-500/25 shadow-[0_0_14px_rgba(6,182,212,0.2)]"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </>
        )}

        <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 lg:px-8">
          <header
            className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors duration-300 ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-slate-300 bg-white/80"
            }`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    isDark
                      ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      : "border border-cyan-500/20 bg-cyan-100 text-cyan-700"
                  }`}
                >
                  AI Productivity Twin
                </span>

                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                  Digital Twin of Your Productivity
                </h1>

                <p
                  className={`mt-3 max-w-2xl text-sm md:text-base ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Analyze daily habits, generate AI insights, and simulate future
                  productivity improvements.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex min-h-[84px] min-w-[180px] flex-col justify-center rounded-2xl px-4 py-3 ${
                    isDark
                      ? "border border-emerald-400/20 bg-emerald-400/10"
                      : "border border-emerald-500/20 bg-emerald-100"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.2em] ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Productivity Score
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-500">
                    {currentProductivityScore}%
                  </p>
                </div>

                <div
                  className={`flex min-h-[84px] min-w-[180px] flex-col justify-center rounded-2xl px-4 py-3 ${
                    isDark
                      ? "border border-violet-400/20 bg-violet-400/10"
                      : "border border-violet-500/20 bg-violet-100"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.2em] ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Deep Work Score
                  </p>
                  <p className="mt-1 text-2xl font-bold text-violet-500">
                    {deepWorkScore}%
                  </p>
                </div>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`min-h-[84px] rounded-2xl px-5 py-3 font-semibold transition ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>

                <button
                  onClick={handleLogout}
                  className="min-h-[84px] rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <InputForm onDataUpdate={handleDataUpdate} isDark={isDark} />

          <Dashboard
            stats={stats}
            weeklyData={weeklyData}
            weeklySummary={weeklySummary}
            streakData={streakData}
            isDark={isDark}
          />

          <CalendarView isDark={isDark} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DailyInsights refreshKey={refreshKey} isDark={isDark} />
            <WeeklyInsights refreshKey={refreshKey} isDark={isDark} />
          </div>

          <Simulation refreshKey={refreshKey} isDark={isDark} />
        </div>
      </div>
    </>
  );
}