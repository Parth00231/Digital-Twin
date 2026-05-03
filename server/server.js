require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Groq = require("groq-sdk");

const db = require("./database");
const { sendVerificationEmail, sendLoginAlertEmail } = require("./mail");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   HELPERS
========================= */
function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getDerivedMetrics(stats) {
  const codingHours = Number(stats.codingHours || 0);
  const studyHours = Number(stats.studyHours || 0);
  const learningVideoHours = Number(stats.learningVideoHours || 0);
  const planningThinkingHours = Number(stats.planningThinkingHours || 0);
  const collegeHours = Number(stats.collegeHours || 0);
  const sleepingHours = Number(stats.sleepingHours || 0);
  const breakHours = Number(stats.breakHours || 0);
  const entertainmentHours = Number(stats.entertainmentHours || 0);
  const unproductiveHours = Number(stats.unproductiveHours || 0);
  const deepWorkHours = Number(stats.deepWorkHours || 0);

  const productiveHours =
    codingHours + studyHours + learningVideoHours + planningThinkingHours;

  const neutralHours = collegeHours + sleepingHours + breakHours;
  const distractingHours = entertainmentHours + unproductiveHours;
  const totalHours = productiveHours + neutralHours + distractingHours;

  const productivityScore =
    productiveHours + distractingHours > 0
      ? Number(((productiveHours / (productiveHours + distractingHours)) * 100).toFixed(2))
      : 0;

  const deepWorkScore =
    productiveHours > 0
      ? Number(((deepWorkHours / productiveHours) * 100).toFixed(2))
      : 0;

  return {
    productiveHours,
    neutralHours,
    distractingHours,
    totalHours,
    productivityScore,
    deepWorkScore,
  };
}

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA");
}

async function getTodayStatsFromDB(userId) {
  const today = getTodayDate();

  const [rows] = await db.query(
    "SELECT * FROM productivity_entries WHERE user_id = ? AND entry_date = ?",
    [userId, today]
  );

  if (rows.length === 0) {
    return {
      codingHours: 0,
      studyHours: 0,
      learningVideoHours: 0,
      planningThinkingHours: 0,
      collegeHours: 0,
      sleepingHours: 0,
      breakHours: 0,
      entertainmentHours: 0,
      unproductiveHours: 0,
      deepWorkHours: 0,
    };
  }

  const entry = rows[0];

  return {
    codingHours: Number(entry.coding_hours || 0),
    studyHours: Number(entry.study_hours || 0),
    learningVideoHours: Number(entry.learning_video_hours || 0),
    planningThinkingHours: Number(entry.planning_thinking_hours || 0),
    collegeHours: Number(entry.college_hours || 0),
    sleepingHours: Number(entry.sleeping_hours || 0),
    breakHours: Number(entry.break_hours || 0),
    entertainmentHours: Number(entry.entertainment_hours || 0),
    unproductiveHours: Number(entry.unproductive_hours || 0),
    deepWorkHours: Number(entry.deep_work_hours || 0),
  };
}

async function getCurrentWeekData(userId) {
  const today = new Date();
  const currentDay = today.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const mondayStr = monday.toLocaleDateString("en-CA");
  const sundayStr = sunday.toLocaleDateString("en-CA");

  const [rows] = await db.query(
    `SELECT * FROM productivity_entries
     WHERE user_id = ?
     AND entry_date BETWEEN ? AND ?
     ORDER BY entry_date ASC`,
    [userId, mondayStr, sundayStr]
  );

  const dayMap = {
    Mon: { day: "Mon", score: 0, deepWork: 0 },
    Tue: { day: "Tue", score: 0, deepWork: 0 },
    Wed: { day: "Wed", score: 0, deepWork: 0 },
    Thu: { day: "Thu", score: 0, deepWork: 0 },
    Fri: { day: "Fri", score: 0, deepWork: 0 },
    Sat: { day: "Sat", score: 0, deepWork: 0 },
    Sun: { day: "Sun", score: 0, deepWork: 0 },
  };

  for (const row of rows) {
    const stats = {
      codingHours: Number(row.coding_hours || 0),
      studyHours: Number(row.study_hours || 0),
      learningVideoHours: Number(row.learning_video_hours || 0),
      planningThinkingHours: Number(row.planning_thinking_hours || 0),
      collegeHours: Number(row.college_hours || 0),
      sleepingHours: Number(row.sleeping_hours || 0),
      breakHours: Number(row.break_hours || 0),
      entertainmentHours: Number(row.entertainment_hours || 0),
      unproductiveHours: Number(row.unproductive_hours || 0),
      deepWorkHours: Number(row.deep_work_hours || 0),
    };

    const derived = getDerivedMetrics(stats);

    const dayName = new Date(row.entry_date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    if (dayMap[dayName]) {
      dayMap[dayName] = {
        day: dayName,
        score: derived.productivityScore,
        deepWork: derived.deepWorkScore,
      };
    }
  }

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day) => dayMap[day]
  );
}

async function getCurrentWeekRows(userId) {
  const today = new Date();
  const currentDay = today.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const mondayStr = monday.toLocaleDateString("en-CA");
  const sundayStr = sunday.toLocaleDateString("en-CA");

  const [rows] = await db.query(
    `SELECT * FROM productivity_entries
     WHERE user_id = ?
     AND entry_date BETWEEN ? AND ?
     ORDER BY entry_date ASC`,
    [userId, mondayStr, sundayStr]
  );

  return rows;
}

async function getWeeklySummary(userId) {
  const rows = await getCurrentWeekRows(userId);

  if (rows.length === 0) {
    return {
      avgScore: 0,
      avgDeepWork: 0,
      bestDay: "-",
      worstDay: "-",
    };
  }

  let totalScore = 0;
  let totalDeepWork = 0;
  let bestScore = -1;
  let worstScore = 101;
  let bestDay = "-";
  let worstDay = "-";

  for (const row of rows) {
    const stats = {
      codingHours: Number(row.coding_hours || 0),
      studyHours: Number(row.study_hours || 0),
      learningVideoHours: Number(row.learning_video_hours || 0),
      planningThinkingHours: Number(row.planning_thinking_hours || 0),
      collegeHours: Number(row.college_hours || 0),
      sleepingHours: Number(row.sleeping_hours || 0),
      breakHours: Number(row.break_hours || 0),
      entertainmentHours: Number(row.entertainment_hours || 0),
      unproductiveHours: Number(row.unproductive_hours || 0),
      deepWorkHours: Number(row.deep_work_hours || 0),
    };

    const derived = getDerivedMetrics(stats);

    const dayName = new Date(row.entry_date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    totalScore += derived.productivityScore;
    totalDeepWork += derived.deepWorkScore;

    if (derived.productivityScore > bestScore) {
      bestScore = derived.productivityScore;
      bestDay = dayName;
    }

    if (derived.productivityScore < worstScore) {
      worstScore = derived.productivityScore;
      worstDay = dayName;
    }
  }

  return {
    avgScore: Number((totalScore / rows.length).toFixed(2)),
    avgDeepWork: Number((totalDeepWork / rows.length).toFixed(2)),
    bestDay,
    worstDay,
  };
}

async function getStreakData(userId) {
  const [rows] = await db.query(
    `SELECT DATE_FORMAT(entry_date, '%Y-%m-%d') AS entry_date
     FROM productivity_entries
     WHERE user_id = ?
     ORDER BY entry_date DESC`,
    [userId]
  );

  if (rows.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      todayLogged: false,
    };
  }

  const uniqueDates = [...new Set(rows.map((row) => row.entry_date))];
  const today = new Date().toLocaleDateString("en-CA");

  let currentStreak = 0;
  let checkDate = new Date();

  while (true) {
    const formatted = checkDate.toLocaleDateString("en-CA");

    if (uniqueDates.includes(formatted)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i] + "T00:00:00");
    const next = new Date(uniqueDates[i + 1] + "T00:00:00");

    const diffInDays = Math.round((current - next) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak,
    todayLogged: uniqueDates.includes(today),
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* =========================
   BASIC ROUTES
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");
    res.json({
      message: "Database connected successfully",
      rows,
    });
  } catch (error) {
    console.error("DB test error:", error);
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});
/* =========================
   AUTH ROUTES
========================= */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const [existingUsers] = await db.query(
      "SELECT id, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: existingUsers[0].is_verified
          ? "Email already registered. Please login."
          : "Email already registered. Please verify your email before login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const [result] = await db.query(
      `INSERT INTO users
       (name, email, password_hash, is_verified, verification_token)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, 0, verificationToken]
    );

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      message:
        "Signup successful. Please check your email and verify your account before login.",
      user: {
        id: result.insertId,
        name,
        email,
        is_verified: 0,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Server error during signup",
      details: error.message,
    });
  }
});

app.get("/api/auth/verify/:token", async (req, res) => {
  try {
    const token = String(req.params.token || "").trim();

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token missing.",
      });
    }

    const [users] = await db.query(
      "SELECT id FROM users WHERE verification_token = ? AND is_verified = 0",
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    await db.query(
      `UPDATE users
       SET is_verified = 1, verification_token = NULL
       WHERE verification_token = ?`,
      [token]
    );

    res.json({
      success: true,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during email verification.",
      details: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];

    // ✅ Pehle email verification check hoga
    if (Number(user.is_verified) !== 1) {
      return res.status(403).json({
        error: "Please verify your email before login.",
      });
    }

    // ✅ Verification ke baad password check hoga
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    try {
      await sendLoginAlertEmail(user.email, user.name);
    } catch (mailError) {
      console.error("Login alert email failed:", mailError.message);
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login",
      details: error.message,
    });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Me route error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   DASHBOARD ROUTES
========================= */
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const stats = await getTodayStatsFromDB(req.user.id);
    const derived = getDerivedMetrics(stats);
    const weeklyData = await getCurrentWeekData(req.user.id);
    const weeklySummary = await getWeeklySummary(req.user.id);
    const streakData = await getStreakData(req.user.id);

    res.json({
      stats: {
        ...stats,
        ...derived,
      },
      weeklyData,
      weeklySummary,
      streakData,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

app.post("/api/update-data", authMiddleware, async (req, res) => {
  try {
    const incomingStats = {
      codingHours: Number(req.body.codingHours || 0),
      studyHours: Number(req.body.studyHours || 0),
      learningVideoHours: Number(req.body.learningVideoHours || 0),
      planningThinkingHours: Number(req.body.planningThinkingHours || 0),
      collegeHours: Number(req.body.collegeHours || 0),
      sleepingHours: Number(req.body.sleepingHours || 0),
      breakHours: Number(req.body.breakHours || 0),
      entertainmentHours: Number(req.body.entertainmentHours || 0),
      unproductiveHours: Number(req.body.unproductiveHours || 0),
      deepWorkHours: Number(req.body.deepWorkHours || 0),
    };

    const derived = getDerivedMetrics(incomingStats);

    if (derived.totalHours > 24) {
      return res.status(400).json({
        error: "Total hours cannot exceed 24",
      });
    }

    if (incomingStats.deepWorkHours > derived.productiveHours) {
      return res.status(400).json({
        error: "Deep Work cannot exceed productive hours",
      });
    }

    const userId = req.user.id;
    const today = getTodayDate();

    const [existing] = await db.query(
      "SELECT id FROM productivity_entries WHERE user_id = ? AND entry_date = ?",
      [userId, today]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE productivity_entries
         SET coding_hours = ?, study_hours = ?, learning_video_hours = ?,
             planning_thinking_hours = ?, college_hours = ?, sleeping_hours = ?,
             break_hours = ?, entertainment_hours = ?, unproductive_hours = ?, deep_work_hours = ?
         WHERE user_id = ? AND entry_date = ?`,
        [
          incomingStats.codingHours,
          incomingStats.studyHours,
          incomingStats.learningVideoHours,
          incomingStats.planningThinkingHours,
          incomingStats.collegeHours,
          incomingStats.sleepingHours,
          incomingStats.breakHours,
          incomingStats.entertainmentHours,
          incomingStats.unproductiveHours,
          incomingStats.deepWorkHours,
          userId,
          today,
        ]
      );

      return res.json({ message: "Entry updated" });
    }

    await db.query(
      `INSERT INTO productivity_entries
       (user_id, entry_date, coding_hours, study_hours, learning_video_hours,
        planning_thinking_hours, college_hours, sleeping_hours, break_hours,
        entertainment_hours, unproductive_hours, deep_work_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        today,
        incomingStats.codingHours,
        incomingStats.studyHours,
        incomingStats.learningVideoHours,
        incomingStats.planningThinkingHours,
        incomingStats.collegeHours,
        incomingStats.sleepingHours,
        incomingStats.breakHours,
        incomingStats.entertainmentHours,
        incomingStats.unproductiveHours,
        incomingStats.deepWorkHours,
      ]
    );

    res.json({ message: "Entry saved" });
  } catch (error) {
    console.error("Update data error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/calendar-data", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM productivity_entries WHERE user_id = ? ORDER BY entry_date ASC`,
      [req.user.id]
    );

    const result = rows.map((row) => {
      const stats = {
        codingHours: Number(row.coding_hours || 0),
        studyHours: Number(row.study_hours || 0),
        learningVideoHours: Number(row.learning_video_hours || 0),
        planningThinkingHours: Number(row.planning_thinking_hours || 0),
        collegeHours: Number(row.college_hours || 0),
        sleepingHours: Number(row.sleeping_hours || 0),
        breakHours: Number(row.break_hours || 0),
        entertainmentHours: Number(row.entertainment_hours || 0),
        unproductiveHours: Number(row.unproductive_hours || 0),
        deepWorkHours: Number(row.deep_work_hours || 0),
      };

      const derived = getDerivedMetrics(stats);

      return {
        date: new Date(row.entry_date).toLocaleDateString("en-CA"),
        score: derived.productivityScore,
        deepWork: derived.deepWorkScore,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Calendar data error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/simulate", authMiddleware, async (req, res) => {
  try {
    const extraHours = Number(req.query.extraHours) || 0;
    const stats = await getTodayStatsFromDB(req.user.id);
    const derived = getDerivedMetrics(stats);

    const currentWeeklyHours = derived.productiveHours * 7;
    const simulatedWeeklyHours = currentWeeklyHours + extraHours * 7;

    const improvement =
      currentWeeklyHours > 0
        ? Number(
            (((simulatedWeeklyHours - currentWeeklyHours) / currentWeeklyHours) * 100).toFixed(2)
          )
        : 0;

    const graphData = [
      { week: "Week 1", current: currentWeeklyHours, future: currentWeeklyHours + extraHours * 2 },
      { week: "Week 2", current: currentWeeklyHours, future: currentWeeklyHours + extraHours * 4 },
      { week: "Week 3", current: currentWeeklyHours, future: currentWeeklyHours + extraHours * 6 },
      { week: "Week 4", current: currentWeeklyHours, future: simulatedWeeklyHours },
    ];

    res.json({
      currentWeeklyHours,
      simulatedWeeklyHours,
      improvement,
      graphData,
    });
  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

/* =========================
   AI INSIGHTS ROUTES
========================= */
app.get("/api/ai-insights/daily", authMiddleware, async (req, res) => {
  try {
    const stats = await getTodayStatsFromDB(req.user.id);
    const derived = getDerivedMetrics(stats);

    const prompt = `
You are analyzing a student's DAILY productivity dashboard.

Today's data:
- Coding Hours: ${stats.codingHours}
- Study Hours: ${stats.studyHours}
- Learning Video Hours: ${stats.learningVideoHours}
- Planning / Thinking Hours: ${stats.planningThinkingHours}
- College Hours: ${stats.collegeHours}
- Sleeping Hours: ${stats.sleepingHours}
- Break Hours: ${stats.breakHours}
- Entertainment Hours: ${stats.entertainmentHours}
- Unproductive Hours: ${stats.unproductiveHours}
- Deep Work Hours: ${stats.deepWorkHours}

Today's metrics:
- Productive Hours: ${derived.productiveHours}
- Neutral Hours: ${derived.neutralHours}
- Distracting Hours: ${derived.distractingHours}
- Total Logged Hours: ${derived.totalHours}
- Productivity Score: ${derived.productivityScore}%
- Deep Work Score: ${derived.deepWorkScore}%

Give 3-5 short bullet points. Keep it student-focused.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    res.json({
      insights: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Daily AI error:", error);
    res.status(500).json({
      error: "Daily AI error",
      message: error.message,
    });
  }
});

app.get("/api/ai-insights/weekly", authMiddleware, async (req, res) => {
  try {
    const weeklySummary = await getWeeklySummary(req.user.id);
    const rows = await getCurrentWeekRows(req.user.id);

    const weeklyBreakdown = rows.map((row) => {
      const stats = {
        codingHours: Number(row.coding_hours || 0),
        studyHours: Number(row.study_hours || 0),
        learningVideoHours: Number(row.learning_video_hours || 0),
        planningThinkingHours: Number(row.planning_thinking_hours || 0),
        collegeHours: Number(row.college_hours || 0),
        sleepingHours: Number(row.sleeping_hours || 0),
        breakHours: Number(row.break_hours || 0),
        entertainmentHours: Number(row.entertainment_hours || 0),
        unproductiveHours: Number(row.unproductive_hours || 0),
        deepWorkHours: Number(row.deep_work_hours || 0),
      };

      const derived = getDerivedMetrics(stats);

      const dayName = new Date(row.entry_date).toLocaleDateString("en-US", {
        weekday: "long",
      });

      return `${dayName}: Productivity ${derived.productivityScore}%, Deep Work ${derived.deepWorkScore}%`;
    });

    const prompt = `
You are analyzing a student's WEEKLY productivity trend.

Weekly summary:
- Average Productivity Score: ${weeklySummary.avgScore}%
- Average Deep Work Score: ${weeklySummary.avgDeepWork}%
- Best Day: ${weeklySummary.bestDay}
- Worst Day: ${weeklySummary.worstDay}

Daily breakdown:
${weeklyBreakdown.join("\n")}

Give 3-5 short bullet points. Keep it student-focused.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    res.json({
      insights: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Weekly AI error:", error);
    res.status(500).json({
      error: "Weekly AI error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});