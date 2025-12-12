"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Get all lessons
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessons = yield prisma.lesson.findMany({
            include: {
                quizzes: true
            }
        });
        res.json(lessons);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
}));
// Get a single lesson with its quizzes
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = yield prisma.lesson.findUnique({
            where: { id: req.params.id },
            include: {
                quizzes: true
            }
        });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json(lesson);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch lesson' });
    }
}));
// Create a new lesson
router.post('/', auth_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, content } = req.body;
        const lesson = yield prisma.lesson.create({
            data: {
                title,
                description,
                content
            }
        });
        res.status(201).json(lesson);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create lesson' });
    }
}));
// Create a quiz for a lesson
router.post('/:lessonId/quizzes', auth_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, questions } = req.body;
        const quiz = yield prisma.quiz.create({
            data: {
                title,
                questions,
                lessonId: req.params.lessonId
            }
        });
        res.status(201).json(quiz);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create quiz' });
    }
}));
// Submit quiz attempt
router.post('/quizzes/:quizId/attempt', auth_js_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { answers } = req.body;
        const quiz = yield prisma.quiz.findUnique({
            where: { id: req.params.quizId }
        });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        // Calculate score (you might want to implement more sophisticated scoring)
        const score = calculateScore(answers, quiz.questions);
        const attempt = yield prisma.attempt.create({
            data: {
                userId: req.user.id,
                quizId: req.params.quizId,
                score,
                answers
            }
        });
        res.status(201).json(attempt);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit quiz attempt' });
    }
}));
// Helper function to calculate quiz score
function calculateScore(userAnswers, quizQuestions) {
    // Implement your scoring logic here
    // This is a simple example that assumes each question is worth 1 point
    let score = 0;
    const questions = quizQuestions.questions;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
            score++;
        }
    }
    return score;
}
exports.default = router;
