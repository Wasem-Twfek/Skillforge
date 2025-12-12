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
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Get all courses
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield prisma.course.findMany({
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                lessons: true,
            },
        });
        const updatedCourses = courses.map(course => {
            return {
                id: course.id,
                title: course.title,
                description: course.description,
                thumbnail: course.thumbnail,
                instructor: course.instructor.name,
                category: course.category,
                level: course.level,
                lessons: course.lessons,
            };
        });
        res.json(updatedCourses);
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
}));
// Get user's enrolled courses
router.get('/user', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('[/api/courses/user] Request received');
    console.log('[/api/courses/user] Headers:', req.headers);
    console.log('[/api/courses/user] User:', req.user);
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            console.error('[/api/courses/user] No user ID found in request');
            return res.status(401).json({ error: 'User not authenticated' });
        }
        console.log('[/api/courses/user] Fetching enrollments for user:', userId);
        const enrollments = yield prisma.enrollment.findMany({
            where: {
                userId: userId
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        lessons: true,
                    },
                },
                progress: true,
            },
        });
        const userCourses = enrollments.map(enrollment => {
            const totalLessons = enrollment.course.lessons.length;
            const completedLessons = enrollment.progress.length;
            const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
            return {
                id: enrollment.course.id,
                title: enrollment.course.title,
                description: enrollment.course.description,
                thumbnail: enrollment.course.thumbnail,
                instructor: enrollment.course.instructor.name,
                progress: Math.round(progress),
                enrolledAt: enrollment.enrolledAt,
                category: enrollment.course.category,
                level: enrollment.course.level,
            };
        });
        res.json(userCourses);
    }
    catch (error) {
        console.error('Error fetching user courses:', error);
        res.status(500).json({ error: 'Failed to fetch user courses' });
    }
}));
// Get course by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield prisma.course.findUnique({
            where: { id: req.params.id },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                lessons: true,
            },
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    }
    catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
}));
// Enroll in a course
router.post('/:id/enroll', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        // Check if already enrolled
        const existingEnrollment = yield prisma.enrollment.findFirst({
            where: {
                userId,
                courseId,
            },
        });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }
        // Create enrollment
        const enrollment = yield prisma.enrollment.create({
            data: {
                userId,
                courseId,
                enrolledAt: new Date(),
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        lessons: true,
                    },
                },
            },
        });
        res.status(201).json({
            message: 'Successfully enrolled in course',
            enrollment,
        });
    }
    catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
}));
// Update course progress
router.post('/:id/progress', auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const userId = req.user.id;
        const { lessonId, completed } = req.body;
        // Check enrollment
        const enrollment = yield prisma.enrollment.findFirst({
            where: {
                userId,
                courseId,
            },
        });
        if (!enrollment) {
            return res.status(404).json({ error: 'Not enrolled in this course' });
        }
        // Update progress
        if (completed) {
            yield prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId,
                    },
                },
                update: {
                    completedAt: new Date(),
                },
                create: {
                    userId,
                    lessonId,
                    enrollmentId: enrollment.id,
                    completedAt: new Date(),
                },
            });
        }
        // Calculate new progress
        const totalLessons = yield prisma.lesson.count({
            where: { courseId },
        });
        const completedLessons = yield prisma.lessonProgress.count({
            where: {
                userId,
                lesson: {
                    courseId,
                },
            },
        });
        const progress = Math.round((completedLessons / totalLessons) * 100);
        res.json({ progress });
    }
    catch (error) {
        console.error('Error updating course progress:', error);
        res.status(500).json({ error: 'Failed to update course progress' });
    }
}));
exports.default = router;
