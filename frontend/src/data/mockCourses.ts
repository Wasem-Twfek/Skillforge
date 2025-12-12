import { Course } from '../types/course';

export const mockCourses: Course[] = [
  // Programming Courses
  {
    id: '1',
    title: 'Complete JavaScript Fundamentals',
    description: 'Master JavaScript from basics to advanced concepts with hands-on projects.',
    thumbnail: '/images/courses/javascript-fundamentals.jpg',
    category: 'programming',
    level: 'beginner',
    instructor: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: '/images/instructors/sarah-johnson.jpg',
      bio: 'Senior JavaScript Developer with 10+ years of experience'
    },
    rating: 4.8,
    reviews: 1250,
    students: 15000,
    price: 49.99,
    lessons: [
      {
        id: '101',
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript and its role in web development.',
        duration: 45,
        content: 'JavaScript is a programming language that powers the interactive elements on websites...',
        videoUrl: 'https://example.com/videos/js-intro.mp4',
        resources: [
          {
            title: 'JavaScript Cheatsheet',
            url: '/resources/js-cheatsheet.pdf',
            type: 'pdf'
          },
          {
            title: 'MDN JavaScript Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            type: 'link'
          }
        ],
        quiz: {
          questions: [
            {
              id: '1001',
              question: 'What is JavaScript?',
              options: [
                'A markup language',
                'A programming language',
                'A styling language',
                'A database language'
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: '102',
        title: 'Variables and Data Types',
        description: 'Learn about variables, constants, and different data types in JavaScript.',
        duration: 60,
        content: 'Variables are containers for storing data values...',
        videoUrl: 'https://example.com/videos/js-variables.mp4',
        resources: [
          {
            title: 'Variables Exercise',
            url: '/resources/variables-exercise.js',
            type: 'code'
          }
        ]
      }
    ],
    tags: ['javascript', 'web development', 'programming', 'frontend'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'React.js Mastery',
    description: 'Build modern web applications with React.js and its ecosystem.',
    thumbnail: '/images/courses/react-mastery.jpg',
    category: 'programming',
    level: 'intermediate',
    instructor: {
      id: '102',
      name: 'Michael Chen',
      avatar: '/images/instructors/michael-chen.jpg',
      bio: 'React.js Expert and Technical Lead at TechCorp'
    },
    rating: 4.9,
    reviews: 980,
    students: 12000,
    price: 59.99,
    lessons: [
      {
        id: '201',
        title: 'React Fundamentals',
        description: 'Introduction to React.js and its core concepts.',
        duration: 75,
        content: 'React is a JavaScript library for building user interfaces...',
        videoUrl: 'https://example.com/videos/react-intro.mp4',
        resources: [
          {
            title: 'React Cheatsheet',
            url: '/resources/react-cheatsheet.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['react', 'javascript', 'frontend', 'web development'],
    createdAt: '2023-02-20T10:00:00Z',
    updatedAt: '2023-07-15T16:45:00Z'
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamentals of user interface and user experience design.',
    thumbnail: '/images/courses/ui-ux-design.jpg',
    category: 'design',
    level: 'beginner',
    instructor: {
      id: '103',
      name: 'Emily Roberts',
      avatar: '/images/instructors/emily-roberts.jpg',
      bio: 'Senior UX Designer with 8 years of experience'
    },
    rating: 4.7,
    reviews: 850,
    students: 10000,
    price: 39.99,
    lessons: [
      {
        id: '301',
        title: 'Introduction to UI/UX',
        description: 'Understanding the basics of user interface and user experience design.',
        duration: 60,
        content: 'UI/UX design focuses on creating intuitive and user-friendly interfaces...',
        videoUrl: 'https://example.com/videos/ui-ux-intro.mp4',
        resources: [
          {
            title: 'UI/UX Design Guide',
            url: '/resources/ui-ux-guide.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['design', 'ui/ux', 'user experience', 'wireframing'],
    createdAt: '2023-03-10T14:00:00Z',
    updatedAt: '2023-08-05T11:30:00Z'
  },
  // Business Courses
  {
    id: '4',
    title: 'Digital Marketing 101',
    description: 'Master the fundamentals of digital marketing and online advertising.',
    thumbnail: '/images/courses/digital-marketing.jpg',
    category: 'business',
    level: 'beginner',
    instructor: {
      id: '104',
      name: 'David Wilson',
      avatar: '/images/instructors/david-wilson.jpg',
      bio: 'Digital Marketing Strategist with 12 years of experience'
    },
    rating: 4.6,
    reviews: 650,
    students: 8000,
    price: 29.99,
    lessons: [
      {
        id: '401',
        title: 'Introduction to Digital Marketing',
        description: 'Understanding the digital marketing landscape and key concepts.',
        duration: 45,
        content: 'Digital marketing involves promoting products and services using digital channels...',
        videoUrl: 'https://example.com/videos/digital-marketing-intro.mp4',
        resources: [
          {
            title: 'Digital Marketing Checklist',
            url: '/resources/digital-marketing-checklist.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['marketing', 'digital marketing', 'seo', 'social media'],
    createdAt: '2023-04-05T09:00:00Z',
    updatedAt: '2023-09-01T13:15:00Z'
  },
  // Data Science Courses
  {
    id: '5',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis and scientific computing.',
    thumbnail: '/images/courses/python-data-science.jpg',
    category: 'programming',
    level: 'intermediate',
    instructor: {
      id: '105',
      name: 'Rachel Kim',
      avatar: '/images/instructors/rachel-kim.jpg',
      bio: 'Data Science Instructor and Python Developer'
    },
    rating: 4.8,
    reviews: 750,
    students: 9000,
    price: 49.99,
    lessons: [
      {
        id: '501',
        title: 'Python Basics for Data Science',
        description: 'Introduction to Python programming for data analysis.',
        duration: 60,
        content: 'Python is a powerful language for data science and analytics...',
        videoUrl: 'https://example.com/videos/python-data-science-intro.mp4',
        resources: [
          {
            title: 'Python Data Science Handbook',
            url: '/resources/python-data-science-handbook.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['python', 'data science', 'pandas', 'numpy'],
    createdAt: '2023-05-15T11:00:00Z',
    updatedAt: '2023-10-10T15:45:00Z'
  },
  // Development Courses
  {
    id: '6',
    title: 'Full Stack Web Development',
    description: 'Build complete web applications using modern technologies.',
    thumbnail: '/images/courses/full-stack.jpg',
    category: 'programming',
    level: 'advanced',
    instructor: {
      id: '106',
      name: 'James Brown',
      avatar: '/images/instructors/james-brown.jpg',
      bio: 'Full Stack Developer and Technical Architect'
    },
    rating: 4.9,
    reviews: 1100,
    students: 13000,
    price: 69.99,
    lessons: [
      {
        id: '601',
        title: 'Full Stack Fundamentals',
        description: 'Introduction to full stack development concepts and architecture.',
        duration: 90,
        content: 'Full stack development involves both frontend and backend technologies...',
        videoUrl: 'https://example.com/videos/full-stack-intro.mp4',
        resources: [
          {
            title: 'Full Stack Development Guide',
            url: '/resources/full-stack-guide.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['full stack', 'web development', 'backend', 'frontend'],
    createdAt: '2023-06-20T13:00:00Z',
    updatedAt: '2023-11-15T17:30:00Z'
  },
  // Marketing Courses
  {
    id: '7',
    title: 'Social Media Marketing',
    description: 'Learn to create and execute effective social media marketing campaigns.',
    thumbnail: '/images/courses/social-media-marketing.jpg',
    category: 'business',
    level: 'intermediate',
    instructor: {
      id: '107',
      name: 'Lisa Chen',
      avatar: '/images/instructors/lisa-chen.jpg',
      bio: 'Social Media Marketing Expert and Content Creator'
    },
    rating: 4.7,
    reviews: 800,
    students: 10000,
    price: 39.99,
    lessons: [
      {
        id: '701',
        title: 'Introduction to Social Media Marketing',
        description: 'Understanding social media platforms and marketing strategies.',
        duration: 50,
        content: 'Social media marketing involves leveraging social platforms to reach and engage audiences...',
        videoUrl: 'https://example.com/videos/social-media-marketing-intro.mp4',
        resources: [
          {
            title: 'Social Media Marketing Strategy',
            url: '/resources/social-media-marketing-strategy.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['social media', 'marketing', 'content creation', 'strategy'],
    createdAt: '2023-07-25T14:00:00Z',
    updatedAt: '2023-12-20T18:45:00Z'
  },
  // Design Courses
  {
    id: '8',
    title: 'Graphic Design Essentials',
    description: 'Master the fundamentals of graphic design and visual communication.',
    thumbnail: '/images/courses/graphic-design.jpg',
    category: 'design',
    level: 'beginner',
    instructor: {
      id: '108',
      name: 'Mark Davis',
      avatar: '/images/instructors/mark-davis.jpg',
      bio: 'Professional Graphic Designer and Illustrator'
    },
    rating: 4.8,
    reviews: 900,
    students: 11000,
    price: 45.99,
    lessons: [
      {
        id: '801',
        title: 'Introduction to Graphic Design',
        description: 'Understanding the principles of graphic design and visual communication.',
        duration: 65,
        content: 'Graphic design involves creating visual content to communicate messages...',
        videoUrl: 'https://example.com/videos/graphic-design-intro.mp4',
        resources: [
          {
            title: 'Graphic Design Basics',
            url: '/resources/graphic-design-basics.pdf',
            type: 'pdf'
          }
        ]
      }
    ],
    tags: ['graphic design', 'visual design', 'illustration', 'communication'],
    createdAt: '2023-08-30T16:00:00Z',
    updatedAt: '2024-01-15T20:30:00Z'
  },
  {
    id: '9',
    title: 'Complete JavaScript Fundamentals',
    description: 'Master JavaScript from basics to advanced concepts with hands-on projects.',
    thumbnail: '/images/courses/javascript-fundamentals.jpg',
    category: 'programming',
    level: 'beginner',
    instructor: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: '/images/instructors/sarah-johnson.jpg',
      bio: 'Senior JavaScript Developer with 10+ years of experience'
    },
    rating: 4.8,
    reviews: 1250,
    students: 15000,
    price: 49.99,
    lessons: [
      {
        id: '101',
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript and its role in web development.',
        duration: 45,
        content: 'JavaScript is a programming language that powers the interactive elements on websites...',
        videoUrl: 'https://example.com/videos/js-intro.mp4',
        resources: [
          {
            title: 'JavaScript Cheatsheet',
            url: '/resources/js-cheatsheet.pdf',
            type: 'pdf'
          },
          {
            title: 'MDN JavaScript Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            type: 'link'
          }
        ],
        quiz: {
          questions: [
            {
              id: '1001',
              question: 'What is JavaScript?',
              options: [
                'A markup language',
                'A programming language',
                'A styling language',
                'A database language'
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: '102',
        title: 'Variables and Data Types',
        description: 'Learn about variables, constants, and different data types in JavaScript.',
        duration: 60,
        content: 'Variables are containers for storing data values...',
        videoUrl: 'https://example.com/videos/js-variables.mp4',
        resources: [
          {
            title: 'Variables Exercise',
            url: '/resources/variables-exercise.js',
            type: 'code'
          }
        ]
      }
    ],
    tags: ['javascript', 'web development', 'programming', 'frontend'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '10',
    title: 'React.js Mastery',
    description: 'Build modern web applications with React.js and its ecosystem.',
    thumbnail: '/images/courses/react-mastery.jpg',
    category: 'programming',
    level: 'intermediate',
    instructor: {
      id: '102',
      name: 'Michael Chen',
      avatar: '/images/instructors/michael-chen.jpg',
      bio: 'React.js Expert and Technical Lead at TechCorp'
    },
    rating: 4.9,
    reviews: 980,
    students: 12000,
    price: 59.99,
    lessons: [
      {
        id: '201',
        title: 'React Fundamentals',
        description: 'Introduction to React.js and its core concepts.',
        duration: 75,
        content: 'React is a JavaScript library for building user interfaces...',
        videoUrl: 'https://example.com/videos/react-intro.mp4',
        resources: [
          {
            title: 'React Documentation',
            url: 'https://reactjs.org/docs/getting-started.html',
            type: 'link'
          }
        ]
      },
      {
        id: '202',
        title: 'Components and Props',
        description: 'Learn how to create and use React components with props.',
        duration: 90,
        content: 'Components are the building blocks of React applications...',
        videoUrl: 'https://example.com/videos/react-components.mp4',
        quiz: {
          questions: [
            {
              id: '2001',
              question: 'What are React components?',
              options: [
                'HTML elements',
                'JavaScript functions that return UI elements',
                'CSS styles',
                'Database tables'
              ],
              correctAnswer: 1
            }
          ]
        }
      }
    ],
    tags: ['react', 'javascript', 'frontend', 'web development'],
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-07-05T09:45:00Z'
  },
  {
    id: '11',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamentals of user interface and user experience design.',
    thumbnail: '/images/courses/ui-ux-design.jpg',
    category: 'design',
    level: 'beginner',
    instructor: {
      id: '103',
      name: 'Emily Rodriguez',
      avatar: '/images/instructors/emily-rodriguez.jpg',
      bio: 'Award-winning UI/UX Designer with experience at top tech companies'
    },
    rating: 4.7,
    reviews: 750,
    students: 8500,
    price: 39.99,
    lessons: [
      {
        id: '301',
        title: 'Introduction to UI/UX Design',
        description: 'Understanding the basics of user interface and user experience design.',
        duration: 60,
        content: 'UI/UX design is about creating intuitive and engaging user experiences...',
        videoUrl: 'https://example.com/videos/ui-ux-intro.mp4',
        resources: [
          {
            title: 'Design Principles Guide',
            url: '/resources/design-principles.pdf',
            type: 'pdf'
          }
        ]
      },
      {
        id: '302',
        title: 'Color Theory and Typography',
        description: 'Learn how to use color and typography effectively in your designs.',
        duration: 75,
        content: 'Color and typography are fundamental elements of design...',
        videoUrl: 'https://example.com/videos/color-typography.mp4',
        quiz: {
          questions: [
            {
              id: '3001',
              question: 'What is the primary purpose of typography in UI design?',
              options: [
                'To make text look pretty',
                'To improve readability and hierarchy',
                'To save space',
                'To match brand colors'
              ],
              correctAnswer: 1
            }
          ]
        }
      }
    ],
    tags: ['design', 'ui/ux', 'visual design', 'user experience'],
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-08-12T11:30:00Z'
  }
]; 