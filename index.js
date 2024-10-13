const express = require("express");
const app = express();
const port = 3000;
const { getQuestion, isCorrectAnswer } = require("./utils/mathUtilities");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static("public")); // To serve static files (e.g., CSS)

let leaderboard = [];

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/quiz", (req, res) => {
  const question = getQuestion();
  const streak = req.query.streak ? parseInt(req.query.streak) : 0;
  res.render("quiz", { question, result: null, streak });
});

app.post("/quiz", (req, res) => {
  const { answer, question, streak } = req.body;
  const isCorrect = isCorrectAnswer(question, answer);
  const newQuestion = getQuestion();
  let newStreak = parseInt(streak);

  if (isCorrect) {
    newStreak += 1;
    res.render("quiz", {
      question: newQuestion,
      result: "Correct! Here's a new question:",
      streak: newStreak,
    });
  } else {
    if (newStreak > 0) {
      const date = new Date().toLocaleString();
      leaderboard.push({ score: newStreak, date });
      leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard in descending order
      leaderboard = leaderboard.slice(0, 10); // Keep only top 10 scores
    }
    newStreak = 0; // Reset streak on incorrect answer
    res.render("quiz", {
      question: newQuestion,
      result: "Incorrect. Try again or return to the menu.",
      streak: newStreak,
    });
  }
});

app.get("/leaderboard", (req, res) => {
  res.render("leaderboard", { leaderboard });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
