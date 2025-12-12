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
// Get all lessons
router.get('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessons = yield prisma_1.default.lesson.findMany();
        res.json(lessons);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
}));
// Get lesson by ID
router.get('/:id', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = yield prisma_1.default.lesson.findUnique({
            where: { id: req.params.id },
            include: {
                quiz: true,
            },
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
// Create lesson
router.post('/', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, description, courseId, order } = req.body;
        const lesson = yield prisma_1.default.lesson.create({
            data: {
                title,
                content,
                description,
                courseId,
                order,
            },
        });
        res.status(201).json(lesson);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create lesson' });
    }
}));
exports.default = router;
