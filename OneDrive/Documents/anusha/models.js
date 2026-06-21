const mongoose = require('mongoose');

// 1. User Schema (Supports both Students and Admins)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
});

// 2. Exam Schema (Stores previous question papers and upcoming tests)
const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true } // 0 to 3
    }]
});

// 3. Submission Schema (Stores student exam results)
const submissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Exam: mongoose.model('Exam', examSchema),
    Submission: mongoose.model('Submission', submissionSchema)
};