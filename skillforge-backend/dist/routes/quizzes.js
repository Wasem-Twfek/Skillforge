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
const auth_1 = require("../middleware/auth");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
// Get all quizzes
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield prisma_1.default.quiz.findMany();
        res.json(quizzes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
}));
// Get quiz by ID
router.get('/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield prisma_1.default.quiz.findUnique({
            where: { id: req.params.id },
        });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.json(quiz);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
}));
// Create quiz
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, questions, lessonId } = req.body;
        const quiz = yield prisma_1.default.quiz.create({
            data: {
                title,
                questions,
                lessonId,
            },
        });
        res.status(201).json(quiz);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create quiz' });
    }
}));
// Submit quiz attempt
router.post('/:id/attempt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, answers, score } = req.body;
        const attempt = yield prisma_1.default.attempt.create({
            data: {
                userId,
                quizId: req.params.id,
                answers,
                score,
            },
        });
        res.status(201).json(attempt);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit quiz attempt' });
    }
}));
exports.default = router;
