// ============================================================
//  mockData.js  –  All static/mock data for the StudyAI app
//  When the real backend is ready, replace these with API calls.
// ============================================================

// ── Logged-in user ──────────────────────────────────────────
export const currentUser = {
  id: 1,
  name: 'Setu Sharma',
  firstName: 'Setu',
  email: 'setu.sharma@email.com',
  year: '4th Year B.Tech',
  avatar: null, // null = show initials fallback
};

// ── Quick-action cards shown on the Dashboard ───────────────
export const quickActions = [
  {
    id: 1,
    title: 'AI Tutor',
    description: 'Ask questions and learn from your study material.',
    buttonText: 'Start Learning →',
    route: '/ai-tutor',
    color: '#7c3aed',       // purple
    bgColor: '#f5f3ff',
    iconName: 'BrainCircuit',
  },
  {
    id: 2,
    title: 'Generate Quiz',
    description: 'Test your knowledge with AI-generated questions.',
    buttonText: 'Create Quiz →',
    route: '/quiz',
    color: '#2563eb',       // blue
    bgColor: '#eff6ff',
    iconName: 'ClipboardList',
  },
  {
    id: 3,
    title: 'Flashcards',
    description: 'Review important concepts quickly.',
    buttonText: 'Review Cards →',
    route: '/flashcards',
    color: '#059669',       // green
    bgColor: '#f0fdf4',
    iconName: 'BookOpen',
  },
  {
    id: 4,
    title: 'Summarize Notes',
    description: 'Get concise summaries of your study material.',
    buttonText: 'Generate Summary →',
    route: '/documents',
    color: '#d97706',       // amber
    bgColor: '#fffbeb',
    iconName: 'FileText',
  },
];

// ── Overall study progress stats ────────────────────────────
export const studyProgress = {
  overallPercent: 72,
  topicsCompleted: 12,
  quizzesCompleted: 8,
  questionsAnswered: 156,
};

// ── Subjects for "Continue Learning" section ────────────────
export const subjects = [
  {
    id: 1,
    name: 'Java OOP',
    percent: 72,
    topicsCompleted: 12,
    totalTopics: 16,
    color: '#f97316',   // orange
    bgColor: '#fff7ed',
    iconName: 'Code2',
  },
  {
    id: 2,
    name: 'DBMS',
    percent: 54,
    topicsCompleted: 8,
    totalTopics: 15,
    color: '#3b82f6',   // blue
    bgColor: '#eff6ff',
    iconName: 'Database',
  },
  {
    id: 3,
    name: 'DSA',
    percent: 46,
    topicsCompleted: 6,
    totalTopics: 13,
    color: '#8b5cf6',   // purple
    bgColor: '#f5f3ff',
    iconName: 'GitBranch',
  },
  {
    id: 4,
    name: 'React',
    percent: 78,
    topicsCompleted: 9,
    totalTopics: 12,
    color: '#06b6d4',   // cyan
    bgColor: '#ecfeff',
    iconName: 'Layers',
  },
];

// ── Uploaded documents ──────────────────────────────────────
export const documents = [
  {
    id: 1,
    name: 'Java OOP Notes.pdf',
    pages: 24,
    uploadedAt: '2 days ago',
    status: 'Ready',        // Ready | Processing | Error
    size: '1.2 MB',
  },
  {
    id: 2,
    name: 'DBMS Notes.pdf',
    pages: 18,
    uploadedAt: '2 days ago',
    status: 'Ready',
    size: '0.9 MB',
  },
  {
    id: 3,
    name: 'Spring Boot Guide.pdf',
    pages: 32,
    uploadedAt: '3 days ago',
    status: 'Processing',
    size: '2.1 MB',
  },
  {
    id: 4,
    name: 'DSA Notes.pdf',
    pages: 45,
    uploadedAt: '4 days ago',
    status: 'Ready',
    size: '3.4 MB',
  },
];

// ── Recent activity feed ─────────────────────────────────────
export const recentActivity = [
  {
    id: 1,
    type: 'quiz',          // quiz | flashcard | upload | question
    title: 'Quiz completed',
    detail: 'Java OOP  •  Score: 8/10',
    time: '2 hours ago',
    iconName: 'CheckCircle2',
    iconColor: '#22c55e',
  },
  {
    id: 2,
    type: 'flashcard',
    title: 'Flashcards studied',
    detail: 'DBMS  •  5 cards reviewed',
    time: '4 hours ago',
    iconName: 'BookOpen',
    iconColor: '#3b82f6',
  },
  {
    id: 3,
    type: 'upload',
    title: 'Document uploaded',
    detail: 'Spring Boot Notes.pdf',
    time: 'Yesterday',
    iconName: 'Upload',
    iconColor: '#8b5cf6',
  },
  {
    id: 4,
    type: 'question',
    title: 'Asked a question',
    detail: '"Explain inheritance in Java"',
    time: 'Yesterday',
    iconName: 'MessageSquare',
    iconColor: '#f97316',
  },
];

// ── AI Tutor – initial message + sample conversation ─────────
export const initialAIMessage = {
  id: 0,
  role: 'ai',
  text: `Hello! 👋 I'm your AI study assistant.\n\nI can help you understand your study material, explain concepts, generate quizzes, create flashcards, and summarize your notes.\n\nSelect a document above and ask me anything!`,
  time: 'Just now',
};

export const sampleConversation = [
  {
    id: 1,
    role: 'user',
    text: 'Explain polymorphism in simple language.',
    time: '10:32 AM',
  },
  {
    id: 2,
    role: 'ai',
    text: `Great question! **Polymorphism** means "many forms". In Java, it allows one interface to be used for different types of objects.\n\nThere are two types:\n\n**1. Compile-time (Static) Polymorphism** – Method Overloading\n**2. Run-time (Dynamic) Polymorphism** – Method Overriding\n\nHere's a quick example:`,
    code: `// Method Overloading (Compile-time)
class Calculator {
    int add(int a, int b)       { return a + b; }
    double add(double a, double b) { return a + b; }
}

// Method Overriding (Run-time)
class Animal {
    void sound() { System.out.println("Some sound"); }
}
class Dog extends Animal {
    @Override
    void sound() { System.out.println("Woof!"); }
}`,
    time: '10:32 AM',
  },
];

// ── Quiz questions ───────────────────────────────────────────
export const quizQuestions = [
  {
    id: 1,
    question: 'Which concept allows an object to take multiple forms?',
    options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
    correctIndex: 1,
    explanation:
      'Polymorphism allows an object to take multiple forms. It is one of the four pillars of OOP and enables methods to behave differently based on the calling object.',
  },
  {
    id: 2,
    question: 'What does the keyword "extends" do in Java?',
    options: [
      'Creates an interface',
      'Implements an interface',
      'Inherits a class',
      'Overloads a method',
    ],
    correctIndex: 2,
    explanation:
      '"extends" is used for class inheritance. A subclass inherits the fields and methods of the superclass.',
  },
  {
    id: 3,
    question: 'Which of the following is NOT a feature of OOP?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'],
    correctIndex: 2,
    explanation:
      'Compilation is a process, not an OOP feature. The four pillars of OOP are Encapsulation, Polymorphism, Inheritance, and Abstraction.',
  },
  {
    id: 4,
    question: 'What is encapsulation?',
    options: [
      'Hiding internal implementation details',
      'Creating multiple objects',
      'Overriding methods',
      'Defining constructors',
    ],
    correctIndex: 0,
    explanation:
      'Encapsulation bundles data and methods together, and hides the internal state of the object from the outside. It is achieved using private fields and public getters/setters.',
  },
  {
    id: 5,
    question: 'Which access modifier makes a member accessible only within the same class?',
    options: ['public', 'protected', 'default', 'private'],
    correctIndex: 3,
    explanation:
      'The "private" access modifier restricts access to within the declaring class only.',
  },
  {
    id: 6,
    question: 'What is an abstract class?',
    options: [
      'A class that cannot be instantiated and may contain abstract methods',
      'A class with only static methods',
      'A class that implements all interfaces',
      'A class with a private constructor',
    ],
    correctIndex: 0,
    explanation:
      'An abstract class cannot be instantiated directly. It can have both abstract methods (without body) and concrete methods (with body).',
  },
  {
    id: 7,
    question: 'What is the output of: System.out.println(10 + 20 + "30");',
    options: ['"102030"', '"3030"', '"30" + 30', '3030'],
    correctIndex: 1,
    explanation:
      'Java evaluates left to right. 10 + 20 = 30 (int), then 30 + "30" = "3030" (string concatenation).',
  },
  {
    id: 8,
    question: 'Which keyword is used to prevent method overriding?',
    options: ['static', 'final', 'abstract', 'private'],
    correctIndex: 1,
    explanation:
      'The "final" keyword on a method prevents it from being overridden in subclasses.',
  },
  {
    id: 9,
    question: 'What is a constructor?',
    options: [
      'A method that returns the class object',
      'A special method called automatically when an object is created',
      'A static method in every class',
      'A method that destroys an object',
    ],
    correctIndex: 1,
    explanation:
      'A constructor is a special method with the same name as the class. It is automatically invoked when an object is created using "new".',
  },
  {
    id: 10,
    question: 'Which of the following supports multiple inheritance in Java?',
    options: ['Class', 'Abstract Class', 'Interface', 'Enum'],
    correctIndex: 2,
    explanation:
      'Java does not support multiple inheritance through classes to avoid the diamond problem. However, a class can implement multiple interfaces.',
  },
];

// ── Flashcard deck ───────────────────────────────────────────
export const flashcards = [
  {
    id: 1,
    question: 'What is Polymorphism?',
    answer:
      'Polymorphism means "many forms". It allows objects of different classes to be treated as objects of a common superclass. It enables one interface to represent different underlying forms (data types).',
  },
  {
    id: 2,
    question: 'What is Encapsulation?',
    answer:
      'Encapsulation is wrapping data (variables) and methods together in a single unit (class), and restricting direct access to some components. It is achieved using private fields with public getters and setters.',
  },
  {
    id: 3,
    question: 'What is Inheritance?',
    answer:
      'Inheritance is a mechanism where a new class (subclass) acquires properties and behaviors of an existing class (superclass). It promotes code reusability and is achieved with the "extends" keyword.',
  },
  {
    id: 4,
    question: 'What is Abstraction?',
    answer:
      'Abstraction means hiding complex implementation details and showing only the necessary features of an object. In Java, it is achieved using abstract classes and interfaces.',
  },
  {
    id: 5,
    question: 'What is the difference between == and .equals() in Java?',
    answer:
      '== compares object references (memory addresses). .equals() compares the actual content/values. For String comparison, always use .equals().',
  },
  {
    id: 6,
    question: 'What is method overloading?',
    answer:
      'Method overloading is defining multiple methods with the same name but different parameters (type, number, or order) in the same class. It is compile-time polymorphism.',
  },
  {
    id: 7,
    question: 'What is method overriding?',
    answer:
      'Method overriding is when a subclass provides a specific implementation of a method already defined in the superclass, with the same name and signature. It is run-time polymorphism.',
  },
  {
    id: 8,
    question: 'What is an interface in Java?',
    answer:
      'An interface is a blueprint of a class containing abstract methods (and constants). It supports multiple inheritance. A class implements an interface using the "implements" keyword.',
  },
  {
    id: 9,
    question: 'What is the "super" keyword?',
    answer:
      'The "super" keyword refers to the parent class. It is used to call the parent class constructor (super()), access parent class methods (super.method()), and access parent class fields.',
  },
  {
    id: 10,
    question: 'What is a static method?',
    answer:
      'A static method belongs to the class, not to any object. It can be called without creating an instance: ClassName.methodName(). It cannot access instance variables directly.',
  },
];

// ── Progress page – subject-wise performance ────────────────
export const subjectProgressData = [
  { subject: 'Java',       percent: 82, color: '#f97316' },
  { subject: 'DBMS',       percent: 66, color: '#3b82f6' },
  { subject: 'DSA',        percent: 54, color: '#8b5cf6' },
  { subject: 'React',      percent: 74, color: '#06b6d4' },
  { subject: 'Spring Boot',percent: 48, color: '#22c55e' },
];

// Weekly study hours (Mon–Sun)
export const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 4.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 3.0 },
  { day: 'Fri', hours: 5.0 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 3.5 },
];

export const weakTopics = ['Recursion', 'Normalization', 'Spring Boot'];

export const quizPerformanceSummary = {
  averageScore: 80,
  totalQuizzes: 8,
  bestSubject: 'Java OOP',
};

// ── Study material selection for AI Tutor dropdown ───────────
export const studyMaterials = [
  { id: 1, label: 'Java OOP Notes' },
  { id: 2, label: 'DBMS Notes' },
  { id: 3, label: 'Spring Boot Guide' },
  { id: 4, label: 'DSA Notes' },
];
