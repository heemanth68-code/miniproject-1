const express = require('express');
const mongoose = require('mongoose');
const { User, Exam, Submission } = require('./models');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serves frontend HTML/CSS files

// Connect to MongoDB (Replace with your own local or Atlas URI)
mongoose.connect('mongodb://127.0.0.1:27017/onlineexamdb')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Database connection error:", err));

// --- 1. USER AUTHENTICATION API ---
app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Registration successful!", role: newUser.role });
    } catch (error) {
        res.status(400).json({ error: "Email already exists or invalid data." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    
    // In a real production app, use JWT tokens. For simplicity, we send user details.
    res.json({ message: "Login successful", userId: user._id, role: user.role, name: user.name });
});

// --- 2. EXAM PORTAL & DASHBOARD API ---

// Get all available exams (for question papers / taking live exams)
app.get('/api/exams', async (req, res) => {
    const exams = await Exam.find({});
    res.json(exams);
});

// Get a specific exam's questions (For the test portal)
app.get('/api/exams/:id', async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    res.json(exam);
});

// Submit exam answers and calculate score instantly
app.post('/api/exams/submit', async (req, res) => {
    const { userId, examId, answers } = req.body; // answers is an array of selected option indices
    const exam = await Exam.findById(examId);
    
    let score = 0;
    exam.questions.forEach((q, index) => {
        if (answers[index] === q.correctOptionIndex) {
            score++;
        }
    });

    const result = new Submission({
        studentId: userId,
        examId: examId,
        score: score,
        totalQuestions: exam.questions.length
    });
    await result.save();
    res.json({ message: "Exam submitted successfully!", score, total: exam.questions.length });
});

// Get previous results for a specific student's dashboard
app.get('/api/student/:userId/results', async (req, res) => {
    const results = await Submission.find({ studentId: req.params.userId }).populate('examId', 'title subject');
    res.json(results);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));