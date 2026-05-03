import { useState } from "react";

export default function InputForm({ onDataUpdate, isDark }) {
  const [formData, setFormData] = useState({
    codingHours: "",
    studyHours: "",
    learningVideoHours: "",
    planningThinkingHours: "",
    collegeHours: "",
    sleepingHours: "",
    breakHours: "",
    entertainmentHours: "",
    unproductiveHours: "",
    deepWorkHours: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      codingHours: "",
      studyHours: "",
      learningVideoHours: "",
      planningThinkingHours: "",
      collegeHours: "",
      sleepingHours: "",
      breakHours: "",
      entertainmentHours: "",
      unproductiveHours: "",
      deepWorkHours: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      codingHours: Number(formData.codingHours) || 0,
      studyHours: Number(formData.studyHours) || 0,
      learningVideoHours: Number(formData.learningVideoHours) || 0,
      planningThinkingHours: Number(formData.planningThinkingHours) || 0,
      collegeHours: Number(formData.collegeHours) || 0,
      sleepingHours: Number(formData.sleepingHours) || 0,
      breakHours: Number(formData.breakHours) || 0,
      entertainmentHours: Number(formData.entertainmentHours) || 0,
      unproductiveHours: Number(formData.unproductiveHours) || 0,
      deepWorkHours: Number(formData.deepWorkHours) || 0,
    };

    const productiveHours =
      payload.codingHours +
      payload.studyHours +
      payload.learningVideoHours +
      payload.planningThinkingHours;

    const neutralHours =
      payload.collegeHours +
      payload.sleepingHours +
      payload.breakHours;

    const distractingHours =
      payload.entertainmentHours +
      payload.unproductiveHours;

    const totalHours = productiveHours + neutralHours + distractingHours;

    if (totalHours > 24) {
      setError("Total logged hours cannot be more than 24.");
      return;
    }

    if (payload.deepWorkHours > productiveHours) {
      setError("Deep Work Hours cannot be greater than Productive Hours.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/update-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update data");
      }

      setSuccess(result.message || "Today’s activity updated successfully.");
      await onDataUpdate();
      resetForm();
    } catch (error) {
      console.error("Update failed:", error);
      setError(error.message || "Failed to update activity data. Please try again.");
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
        <p
          className={`mt-1 text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Log your productive, neutral, and distracting hours to update your
          digital twin.
        </p>
      </div>

      {error && (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
            isDark
              ? "border-red-400/30 bg-red-500/10 text-red-300"
              : "border-red-300 bg-red-50 text-red-600"
          }`}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
            isDark
              ? "border-green-400/30 bg-green-500/10 text-green-300"
              : "border-green-300 bg-green-50 text-green-600"
          }`}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionTitle title="Productive Hours" isDark={isDark} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Coding Hours"
            value={formData.codingHours}
            onChange={(value) => handleChange("codingHours", value)}
            placeholder="e.g. 4"
            isDark={isDark}
          />
          <InputField
            label="Study Hours"
            value={formData.studyHours}
            onChange={(value) => handleChange("studyHours", value)}
            placeholder="e.g. 3"
            isDark={isDark}
          />
          <InputField
            label="Learning Video Hours"
            value={formData.learningVideoHours}
            onChange={(value) => handleChange("learningVideoHours", value)}
            placeholder="e.g. 1.5"
            isDark={isDark}
          />
          <InputField
            label="Planning / Thinking Hours"
            value={formData.planningThinkingHours}
            onChange={(value) => handleChange("planningThinkingHours", value)}
            placeholder="e.g. 1"
            isDark={isDark}
          />
        </div>

        <SectionTitle title="Neutral Hours" isDark={isDark} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="College Hours"
            value={formData.collegeHours}
            onChange={(value) => handleChange("collegeHours", value)}
            placeholder="e.g. 5"
            isDark={isDark}
          />
          <InputField
            label="Sleeping Hours"
            value={formData.sleepingHours}
            onChange={(value) => handleChange("sleepingHours", value)}
            placeholder="e.g. 8"
            isDark={isDark}
          />
          <InputField
            label="Break Hours"
            value={formData.breakHours}
            onChange={(value) => handleChange("breakHours", value)}
            placeholder="e.g. 2"
            isDark={isDark}
          />
        </div>

        <SectionTitle title="Distracting Hours" isDark={isDark} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Entertainment Hours"
            value={formData.entertainmentHours}
            onChange={(value) => handleChange("entertainmentHours", value)}
            placeholder="e.g. 1"
            isDark={isDark}
          />
          <InputField
            label="Unproductive Hours"
            value={formData.unproductiveHours}
            onChange={(value) => handleChange("unproductiveHours", value)}
            placeholder="e.g. 1"
            isDark={isDark}
          />
        </div>

        <SectionTitle title="Deep Work" isDark={isDark} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Deep Work Hours"
            value={formData.deepWorkHours}
            onChange={(value) => handleChange("deepWorkHours", value)}
            placeholder="e.g. 4"
            isDark={isDark}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-black transition hover:bg-cyan-300"
        >
          Update Dashboard
        </button>
      </form>
    </div>
  );
}

function SectionTitle({ title, isDark }) {
  return (
    <div className="pt-2">
      <h4
        className={`text-sm font-semibold uppercase tracking-wide ${
          isDark ? "text-cyan-300" : "text-cyan-600"
        }`}
      >
        {title}
      </h4>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, isDark }) {
  return (
    <div>
      <label
        className={`mb-2 block text-sm ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>
      <input
        type="number"
        min="0"
        step="0.5"
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