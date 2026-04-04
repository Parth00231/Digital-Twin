import { useState } from "react";

export default function InputForm({ onDataUpdate, isDark }) {
  const [coding, setCoding] = useState("");
  const [study, setStudy] = useState("");
  const [youtube, setYoutube] = useState("");
  const [idle, setIdle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("http://localhost:5000/api/update-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coding: Number(coding),
          study: Number(study),
          youtube: Number(youtube),
          idle: Number(idle),
        }),
      });

      onDataUpdate();
      setCoding("");
      setStudy("");
      setYoutube("");
      setIdle("");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div
      className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-slate-300 bg-white/80"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-xl font-semibold">Enter Today&apos;s Activity</h3>
        <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Log your productive and distracting hours to update the digital twin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField label="Coding Hours" value={coding} onChange={setCoding} placeholder="e.g. 4" isDark={isDark} />
        <InputField label="Study Hours" value={study} onChange={setStudy} placeholder="e.g. 3" isDark={isDark} />
        <InputField label="YouTube Hours" value={youtube} onChange={setYoutube} placeholder="e.g. 2" isDark={isDark} />
        <InputField label="Idle Hours" value={idle} onChange={setIdle} placeholder="e.g. 1" isDark={isDark} />

        <button
          type="submit"
          className="md:col-span-2 mt-2 rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300"
        >
          Update Dashboard
        </button>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, isDark }) {
  return (
    <div>
      <label className={`mb-2 block text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${
          isDark
            ? "border-white/10 bg-slate-950/60 text-white placeholder:text-slate-500 focus:border-cyan-400/40"
            : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500/40"
        }`}
        required
      />
    </div>
  );
}