# Digital Twin of Your Productivity

An AI-powered productivity dashboard that creates a digital twin of a user’s behavior, analyzes time usage, generates AI insights, and simulates future productivity improvements.

## Problem

Many people think they are productive, but they don’t actually know where their time goes.  
Most productivity apps only track past activity but don’t help users understand or improve their future productivity.

## Solution

We built a **Digital Twin of Productivity** — a system that creates a virtual model of a user's behavior.

The system:
- Tracks how users spend time
- Calculates productivity score
- Generates AI insights
- Simulates future productivity if habits improve

This helps users not only track their productivity but also **predict and improve their future performance**.

## Features

- Manual activity logging (Coding, Study, YouTube, Idle)
- Productivity score calculation
- Time distribution pie chart
- Daily productivity pattern bar graph
- AI-generated productivity insights
- Future productivity simulation ("What if I study 2 extra hours daily?")
- Dark / Light mode UI
- Interactive dashboard

## How It Works

1. User enters daily activity hours.
2. The system calculates productive vs distraction time.
3. Productivity score is generated.
4. Weekly behavior pattern is simulated.
5. AI analyzes the data and gives suggestions.
6. Future simulation predicts productivity improvement.

## Productivity Score Formula

Productivity Score = (Coding + Study) / Total Hours × 100

## Future Simulation Logic

Productive Hours Per Day = Coding + Study
Current Weekly Hours = Productive Hours × 7
Future Weekly Hours = Current Weekly Hours + (Extra Hours × 7)

This is called What-if Analysis — predicting the future based on behavior changes.

## Tech Stack

**Frontend**
- React
- Tailwind CSS
- Recharts

**Backend**
- Node.js
- Express.js

**AI**
- Groq API (LLM for productivity insights)

## Project Structure

client/
src/
components/
Dashboard.jsx
Chart.jsx
Insights.jsx
Simulation.jsx
InputForm.jsx
App.jsx

server/
server.js
.env

## Future Scope

- Automatic activity tracking using a Chrome Extension
- Machine learning model for productivity prediction
- User login and history tracking
- Weekly and monthly reports
- Goal setting and habit tracking

## Demo Flow

1. Enter daily activity hours
2. Dashboard updates
3. Productivity score changes
4. AI insights generated
5. Future simulation shows improvement prediction

## Project Idea

> Instead of only tracking the past, this system helps users predict and improve their future productivity using AI and simulation.

## Author

Your Name:
Parth Rastogi 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
