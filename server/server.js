require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let dashboardData = {
  stats: {
    totalHours: "10h",
    focusTime: "8h",
    distraction: "2h",
    productivityScore: "73%",
  },
  timeData: [
    { name: "Coding", value: 4 },
    { name: "Study", value: 4 },
    { name: "YouTube", value: 2 },
    { name: "Idle", value: 1 },
  ],
  weeklyData: [
    { day: "Mon", hours: 7 },
    { day: "Tue", hours: 8 },
    { day: "Wed", hours: 6 },
    { day: "Thu", hours: 9 },
    { day: "Fri", hours: 8 },
    { day: "Sat", hours: 10 },
    { day: "Sun", hours: 5 },
  ],
};

function calculateProductivityScore(data) {
  const coding = data.timeData[0].value;
  const study = data.timeData[1].value;
  const youtube = data.timeData[2].value;
  const idle = data.timeData[3].value;

  const productive = coding + study;
  const total = coding + study + youtube + idle;

  if (total === 0) return 0;

  return Math.round((productive / total) * 100);
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/dashboard", (req, res) => {
  const score = calculateProductivityScore(dashboardData);
  dashboardData.stats.productivityScore = score + "%";
  res.json(dashboardData);
});

app.post("/api/update-data", (req, res) => {
  const { coding, study, youtube, idle } = req.body;

  const codingNum = Number(coding);
  const studyNum = Number(study);
  const youtubeNum = Number(youtube);
  const idleNum = Number(idle);

  dashboardData.timeData = [
    { name: "Coding", value: codingNum },
    { name: "Study", value: studyNum },
    { name: "YouTube", value: youtubeNum },
    { name: "Idle", value: idleNum },
  ];

  const total = codingNum + studyNum + youtubeNum + idleNum;
  const productiveBase = codingNum + studyNum;

  dashboardData.stats.totalHours = total + "h";
  dashboardData.stats.focusTime = productiveBase + "h";
  dashboardData.stats.distraction = youtubeNum + "h";

  const score = calculateProductivityScore(dashboardData);
  dashboardData.stats.productivityScore = score + "%";

  dashboardData.weeklyData = [
    { day: "Mon", hours: Math.max(productiveBase - 1, 0) },
    { day: "Tue", hours: productiveBase },
    { day: "Wed", hours: Math.max(productiveBase - 2, 0) },
    { day: "Thu", hours: productiveBase + 1 },
    { day: "Fri", hours: productiveBase },
    { day: "Sat", hours: productiveBase + 2 },
    { day: "Sun", hours: Math.max(productiveBase - 3, 0) },
  ];

  res.json({
    message: "Data updated successfully",
    dashboardData,
  });
});

app.get("/api/simulate", (req, res) => {
  const extraHours = Number(req.query.extraHours) || 0;

  const coding = dashboardData.timeData[0].value || 0;
  const study = dashboardData.timeData[1].value || 0;

  const productivePerDay = coding + study;
  const currentWeeklyHours = productivePerDay * 7;
  const simulatedWeeklyHours = currentWeeklyHours + extraHours * 7;

  const improvement =
    currentWeeklyHours === 0
      ? 0
      : Math.round(
          ((simulatedWeeklyHours - currentWeeklyHours) / currentWeeklyHours) *
            100
        );

  const graphData = [
    {
      week: "Week 1",
      current: currentWeeklyHours,
      future: currentWeeklyHours + extraHours * 1.5,
    },
    {
      week: "Week 2",
      current: currentWeeklyHours,
      future: currentWeeklyHours + extraHours * 3,
    },
    {
      week: "Week 3",
      current: currentWeeklyHours,
      future: currentWeeklyHours + extraHours * 5,
    },
    {
      week: "Week 4",
      current: currentWeeklyHours,
      future: simulatedWeeklyHours,
    },
  ];

  res.json({
    currentWeeklyHours,
    simulatedWeeklyHours,
    improvement,
    graphData,
  });
});

app.get("/api/ai-insights", async (req, res) => {
  try {
    const coding = dashboardData.timeData[0].value;
    const study = dashboardData.timeData[1].value;
    const youtube = dashboardData.timeData[2].value;
    const idle = dashboardData.timeData[3].value;
    const score = calculateProductivityScore(dashboardData);

    const prompt = `
You are analyzing a student's productivity dashboard.

Data:
- Coding: ${coding} hours
- Study: ${study} hours
- YouTube: ${youtube} hours
- Idle: ${idle} hours
- Productivity score: ${score}%

Give exactly 3 short productivity insights.
Each insight should be one bullet point.
Keep them practical and specific.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({
      insights: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      error: "AI error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});