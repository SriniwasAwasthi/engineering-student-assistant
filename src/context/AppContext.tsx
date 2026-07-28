import React, { createContext, useState, useEffect, useContext } from 'react';

export interface UserProfile {
  name: string;
  branch: 'CSE' | 'ECE' | 'EEE' | 'ME' | 'Civil';
  semester: number;
  interests: string[];
  careerGoal: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  unitsCompleted: number;
  totalUnits: number;
  goalGrade: string;
  credits: number;
  cieMarks?: number;
  seeMarks?: number;
  totalMarks?: number;
}

export interface AcademicResource {
  id: string;
  name: string;
  desc: string;
  url: string; // website link or base64 PDF string
  isPdf?: boolean;
  fileName?: string;
  subject?: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  type: string; // e.g. "Internal 1", "Semester End"
}

export interface TimetableClass {
  id: string;
  subject: string;
  time: string;
  room: string;
}

export interface TimetableDay {
  day: string;
  classes: TimetableClass[];
}

export interface AttendanceRecord {
  present: number;
  absent: number;
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface InternalMark {
  internal1: string;
  internal2: string;
  assignments: string;
  maxMarks: string;
}

export interface CollegeNote {
  id: string;
  subject: string;
  title: string;
  content: string;
  lastModified: string;
}

export interface MockTestAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface AcademicNotice {
  id: string;
  date: string;
  title: string;
  content: string;
  tag: 'Exam' | 'Placement' | 'General' | 'Event';
}

export interface CollegeEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'event' | 'holiday' | 'academic';
}

export interface SupportTicket {
  id: string;
  date: string;
  title: string;
  category: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

// New Interfaces
export interface AINotesEntry {
  id: string;
  subject: string;
  unit: number;
  topic: string;
  notesType: 'short' | 'exam' | 'questions' | 'revision' | 'formula';
  content: string;
  favorite: boolean;
  createdAt: string;
}

export interface PYQEntry {
  id: string;
  subject: string;
  unit: number;
  year: number;
  questionText: string;
  tags: ('Very Important' | 'Important' | 'Repeated' | 'Numerical' | 'Theory' | 'Long Answer' | 'Short Answer')[];
  bookmarked: boolean;
  frequency: number;
  createdAt: string;
}

export interface ExamPlan {
  id: string;
  examName: string;
  examDate: string;
  priority: 'High' | 'Medium' | 'Low';
  dailyStudyHours: number;
  subjectsProgress: {
    subjectId: string;
    subjectName: string;
    completionPercentage: number;
  }[];
  schedule: {
    dayNumber: number;
    date: string;
    tasks: { subjectName: string; topic: string; type: 'study' | 'revision' | 'mock' | 'buffer' }[];
  }[];
  createdAt: string;
}

export interface PlacementInterviewExperience {
  id: string;
  companyName: string;
  role: string;
  interviewDate: string;
  roundCount: number;
  questionsAsked: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  outcome: 'Selected' | 'Rejected' | 'Pending' | 'Ongoing';
  tips: string;
  tags: ('Aptitude' | 'DSA' | 'HR' | 'Project' | 'Core CS' | 'Coding Round' | 'Technical Round')[];
  bookmarked: boolean;
  createdAt: string;
}

export interface ExportHistoryLog {
  id: string;
  module: string;
  title: string;
  timestamp: string;
}

interface AppContextType {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  theme: 'light' | 'dark';
  studyTasks: StudyTask[];
  subjects: Subject[];
  exams: Exam[];
  timetable: TimetableDay[];
  attendance: Record<string, AttendanceRecord>; // subjectId -> attendance
  assignments: Assignment[];
  internalMarks: Record<string, InternalMark>; // subjectId -> marks
  notes: CollegeNote[];
  savedProjects: string[]; // projectIds
  savedQuestions: string[]; // questionIds
  mockTestAttempts: MockTestAttempt[];
  dailyChallengeStreak: number;
  dailyChallengeLastPlayed: string | null; // YYYY-MM-DD
  completedRoadmapMilestones: string[]; // milestoneIds
  notices: AcademicNotice[];
  events: CollegeEvent[];
  supportTickets: SupportTicket[];
  academicResources: AcademicResource[];
  
  // New States
  aiNotes: AINotesEntry[];
  pyqEntries: PYQEntry[];
  examPlans: ExamPlan[];
  interviewExperiences: PlacementInterviewExperience[];
  exportLogs: ExportHistoryLog[];

  // Handlers
  updateProfile: (profile: UserProfile) => void;
  toggleTheme: () => void;
  
  // Study Planner
  addStudyTask: (task: Omit<StudyTask, 'id' | 'completed'>) => void;
  toggleStudyTask: (id: string) => void;
  deleteStudyTask: (id: string) => void;
  addSubject: (sub: Omit<Subject, 'id' | 'unitsCompleted'>) => void;
  updateSubject: (sub: Subject) => void;
  updateSubjectUnits: (id: string, unitsCompleted: number) => void;
  deleteSubject: (id: string) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  deleteExam: (id: string) => void;
  
  // College Companion
  updateTimetable: (dayName: string, classes: TimetableClass[]) => void;
  logAttendance: (subjectId: string, status: 'present' | 'absent' | 'reset') => void;
  addAssignment: (assign: Omit<Assignment, 'id' | 'completed'>) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
  updateInternalMarks: (subjectId: string, marks: InternalMark) => void;
  addNote: (note: Omit<CollegeNote, 'id' | 'lastModified'>) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'date' | 'status'>) => void;
  addNotice: (notice: Omit<AcademicNotice, 'id' | 'date'>) => void;
  updateNotice: (notice: AcademicNotice) => void;
  deleteNotice: (id: string) => void;
  addAcademicResource: (res: Omit<AcademicResource, 'id'>) => void;
  deleteAcademicResource: (id: string) => void;
  
  // Placement Prep
  toggleSaveQuestion: (id: string) => void;
  addMockTestAttempt: (attempt: Omit<MockTestAttempt, 'id' | 'date'>) => void;
  registerDailyChallengePlayed: (score: number) => void;
  
  // Project Generator
  toggleSaveProject: (id: string) => void;
  
  // Roadmap
  toggleMilestone: (id: string) => void;
  
  // New Handlers
  saveAINote: (note: Omit<AINotesEntry, 'id' | 'createdAt' | 'favorite'>) => void;
  toggleFavoriteNote: (id: string) => void;
  deleteAINote: (id: string) => void;
  addPYQQuestion: (pyq: Omit<PYQEntry, 'id' | 'createdAt' | 'bookmarked'>) => void;
  toggleBookmarkPYQ: (id: string) => void;
  deletePYQQuestion: (id: string) => void;
  addExamPlan: (plan: ExamPlan) => void;
  deleteExamPlan: (id: string) => void;
  addInterviewExperience: (exp: Omit<PlacementInterviewExperience, 'id' | 'createdAt' | 'bookmarked'>) => void;
  toggleBookmarkInterview: (id: string) => void;
  deleteInterviewExperience: (id: string) => void;
  logExportDocument: (module: string, title: string) => void;
  setAttendanceCount: (subjectId: string, present: number, absent: number) => void;
  importBackupData: (backup: any) => boolean;

  // Reset
  resetAllData: () => void;
}

const defaultTimetable: TimetableDay[] = [
  { day: 'Monday', classes: [
    { id: 'c1', subject: 'Database Management Systems', time: '09:00 AM - 10:00 AM', room: 'LH-301' },
    { id: 'c2', subject: 'Finite Automata and Formal Languages', time: '10:15 AM - 11:15 AM', room: 'LH-301' },
    { id: 'c3', subject: 'Analysis and Design of Algorithms', time: '11:30 AM - 12:30 PM', room: 'LH-302' }
  ]},
  { day: 'Tuesday', classes: [
    { id: 'c4', subject: 'Microprocessors and Microcontrollers', time: '09:00 AM - 10:00 AM', room: 'LAB-2' },
    { id: 'c5', subject: 'Database Management Systems', time: '11:30 AM - 12:30 PM', room: 'LH-301' }
  ]},
  { day: 'Wednesday', classes: [
    { id: 'c6', subject: 'Finite Automata and Formal Languages', time: '09:00 AM - 10:00 AM', room: 'LH-301' },
    { id: 'c7', subject: 'Analysis and Design of Algorithms', time: '10:15 AM - 11:15 AM', room: 'LH-302' },
    { id: 'c8', subject: 'Universal Human Values', time: '02:00 PM - 03:00 PM', room: 'LH-104' }
  ]},
  { day: 'Thursday', classes: [
    { id: 'c9', subject: 'Microprocessors and Microcontrollers', time: '09:00 AM - 10:00 AM', room: 'LH-301' },
    { id: 'c10', subject: 'Database Management Systems', time: '10:15 AM - 11:15 AM', room: 'LH-301' }
  ]},
  { day: 'Friday', classes: [
    { id: 'c11', subject: 'Analysis and Design of Algorithms', time: '09:00 AM - 10:00 AM', room: 'LAB-5' },
    { id: 'c12', subject: 'Biology for Engineers', time: '02:00 PM - 03:00 PM', room: 'LH-102' }
  ]}
];

const defaultNotices: AcademicNotice[] = [
  { id: 'n_1', date: '2026-06-15', title: 'CIE-2 Exam Time Table Released', content: 'Second internal test starts next Monday. Check notice boards or resource links for detailed slot distributions.', tag: 'Exam' },
  { id: 'n_2', date: '2026-06-12', title: 'Google Interview Shortlist Out', content: 'Shortlisted engineering students for the preliminary interview round must submit their updated resume templates by Wednesday evening.', tag: 'Placement' },
  { id: 'n_3', date: '2026-06-10', title: 'Annual Project Exhibition (Virasat)', content: 'Submit your major/mini project abstracts along with technology stack requirements to the HOD office by Friday.', tag: 'Event' }
];

const defaultEvents: CollegeEvent[] = [
  { id: 'ev_1', date: '2026-06-25', title: 'CIE-2 Internal Exams', description: 'Continuous internal evaluation exams for all subjects.', type: 'academic' },
  { id: 'ev_2', date: '2026-07-02', title: 'HackFest Annual College Hackathon', description: '36-hour coding and hardware prototyping challenge with industry judges.', type: 'event' },
  { id: 'ev_3', date: '2026-07-15', title: 'Summer Vacation Break Starts', description: 'End of regular academic session.', type: 'holiday' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage wrapper
  const getLocal = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`esa_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const setLocal = <T,>(key: string, value: T) => {
    localStorage.setItem(`esa_${key}`, JSON.stringify(value));
  };

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getLocal('profile', null));
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => getLocal('onboarded', false));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getLocal('theme', 'dark'));

  // Database lists
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => getLocal('study_tasks', [
    { id: 't_def_1', subject: 'Database Management Systems', task: 'Revise normalizations & SQL joins', priority: 'High', completed: false, dueDate: '' },
    { id: 't_def_2', subject: 'Finite Automata and Formal Languages', task: 'Draw DFA for odd numbers of 1s', priority: 'Medium', completed: true, dueDate: '' },
    { id: 't_def_3', subject: 'Analysis and Design of Algorithms', task: 'Write Dynamic Programming recursion for LCS', priority: 'High', completed: false, dueDate: '' }
  ]));

  const [subjects, setSubjects] = useState<Subject[]>(() => getLocal('subjects', [
    { id: 'sub_1', name: 'Microprocessors and Microcontrollers', code: '22CS41', unitsCompleted: 2, totalUnits: 5, goalGrade: 'A', credits: 3 },
    { id: 'sub_2', name: 'Database Management Systems', code: '22CS42', unitsCompleted: 3, totalUnits: 5, goalGrade: 'A+', credits: 4 },
    { id: 'sub_3', name: 'Analysis and Design of Algorithms', code: '22CS43', unitsCompleted: 4, totalUnits: 5, goalGrade: 'S', credits: 4 },
    { id: 'sub_4', name: 'Microprocessors and Microcontrollers Lab', code: '22CSL44', unitsCompleted: 1, totalUnits: 5, goalGrade: 'A', credits: 1 },
    { id: 'sub_5', name: 'Finite Automata and Formal Languages', code: '22CS45A', unitsCompleted: 2, totalUnits: 5, goalGrade: 'A', credits: 3 },
    { id: 'sub_6', name: 'Biology for Engineers', code: '22BSC46', unitsCompleted: 3, totalUnits: 5, goalGrade: 'B', credits: 3 },
    { id: 'sub_7', name: 'Universal Human Values', code: '22UHV47', unitsCompleted: 1, totalUnits: 5, goalGrade: 'A', credits: 1 },
    { id: 'sub_8', name: 'Web Application Development', code: '22CSAE481', unitsCompleted: 2, totalUnits: 5, goalGrade: 'A+', credits: 1 },
    { id: 'sub_9', name: 'National Service Scheme(NSS)', code: '22NS49', unitsCompleted: 1, totalUnits: 5, goalGrade: 'PP', credits: 0 }
  ]));

  const [exams, setExams] = useState<Exam[]>(() => getLocal('exams', [
    { id: 'ex_1', subject: 'Database Management Systems', date: '2026-06-25', type: 'Internal 2' },
    { id: 'ex_2', subject: 'Analysis and Design of Algorithms', date: '2026-06-27', type: 'Internal 2' }
  ]));

  const [timetable, setTimetable] = useState<TimetableDay[]>(() => getLocal('timetable', defaultTimetable));

  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>(() => getLocal('attendance', {
    'sub_1': { present: 18, absent: 2 },
    'sub_2': { present: 22, absent: 3 },
    'sub_3': { present: 20, absent: 1 },
    'sub_4': { present: 10, absent: 0 },
    'sub_5': { present: 16, absent: 4 },
    'sub_6': { present: 14, absent: 2 },
    'sub_7': { present: 8, absent: 0 },
    'sub_8': { present: 12, absent: 1 },
    'sub_9': { present: 6, absent: 0 }
  }));

  const [assignments, setAssignments] = useState<Assignment[]>(() => getLocal('assignments', [
    { id: 'a_1', subject: 'Database Management Systems', title: 'ER Diagram for Hospital System', dueDate: '2026-06-20', completed: false },
    { id: 'a_2', subject: 'Microprocessors and Microcontrollers', title: '8086 Assembly Program for Sorting Array', dueDate: '2026-06-18', completed: true }
  ]));

  const [internalMarks, setInternalMarks] = useState<Record<string, InternalMark>>(() => getLocal('internal_marks', {
    'sub_1': { internal1: '38', internal2: '42', assignments: '10', maxMarks: '50' },
    'sub_2': { internal1: '40', internal2: '45', assignments: '10', maxMarks: '50' },
    'sub_3': { internal1: '42', internal2: '44', assignments: '10', maxMarks: '50' },
    'sub_4': { internal1: '45', internal2: '48', assignments: '10', maxMarks: '50' },
    'sub_5': { internal1: '35', internal2: '38', assignments: '9', maxMarks: '50' },
    'sub_6': { internal1: '36', internal2: '40', assignments: '8', maxMarks: '50' },
    'sub_7': { internal1: '45', internal2: '46', assignments: '10', maxMarks: '50' },
    'sub_8': { internal1: '48', internal2: '47', assignments: '10', maxMarks: '50' }
  }));

  const [notes, setNotes] = useState<CollegeNote[]>(() => getLocal('notes', [
    { id: 'n_def_1', subject: 'Database Management Systems', title: 'Transaction ACID Properties', content: 'Atomicity (All or nothing), Consistency (State remains valid), Isolation (Independent execution), Durability (Committed updates are safe).', lastModified: '2026-06-14T10:30:00Z' }
  ]));

  const [savedProjects, setSavedProjects] = useState<string[]>(() => getLocal('saved_projects', []));
  const [savedQuestions, setSavedQuestions] = useState<string[]>(() => getLocal('saved_questions', []));
  const [mockTestAttempts, setMockTestAttempts] = useState<MockTestAttempt[]>(() => getLocal('mock_test_attempts', []));
  const [dailyChallengeStreak, setDailyChallengeStreak] = useState<number>(() => getLocal('challenge_streak', 0));
  const [dailyChallengeLastPlayed, setDailyChallengeLastPlayed] = useState<string | null>(() => getLocal('challenge_last_played', null));
  const [completedRoadmapMilestones, setCompletedRoadmapMilestones] = useState<string[]>(() => getLocal('roadmap_milestones', []));
  
  const [notices, setNotices] = useState<AcademicNotice[]>(() => getLocal('notices', defaultNotices));
  const [events] = useState<CollegeEvent[]>(defaultEvents);

  const defaultAcademicResources: AcademicResource[] = [
    { id: 'res_1', name: 'University Syllabus Document (PDF)', desc: 'Official evaluation scheme & credits distribution.', url: 'https://vtu.ac.in/' },
    { id: 'res_2', name: 'Previous Year Question Bank (PYQ)', desc: 'Past 5 years exam papers for revision.', url: 'https://vtu.ac.in/' },
    { id: 'res_3', name: 'NPTEL online engineering lectures', desc: 'Syllabus reference tutorials from professors.', url: 'https://nptel.ac.in/' },
    { id: 'res_4', name: 'Virtual Labs simulation console', desc: 'Interactive remote simulation tools for ECE/ME.', url: 'https://vlab.co.in/' }
  ];
  const [academicResources, setAcademicResources] = useState<AcademicResource[]>(() => getLocal('academic_resources', defaultAcademicResources));
  
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => getLocal('support_tickets', [
    { id: 'st_1', date: '2026-06-11', title: 'CGPA Correction in Portal', category: 'Academics', description: 'Request to update my 3rd-semester marksheet calculation.', status: 'Resolved' }
  ]));

  // New states with seed data
  const [aiNotes, setAiNotes] = useState<AINotesEntry[]>(() => getLocal('ai_notes', [
    {
      id: 'n_seed_1',
      subject: 'Database Management Systems',
      unit: 1,
      topic: 'Relational Model Constraints',
      notesType: 'revision',
      content: `<h3>Unit 1 Revision: Relational Model Constraints</h3>
      <p>In the relational model, constraints define the rules for valid data states.</p>
      <ul>
        <li><strong>Domain Constraint:</strong> Defines the set of permissible values for each attribute.</li>
        <li><strong>Key Constraint:</strong> Minimal set of attributes that uniquely identify a tuple (Super Key, Candidate Key, Primary Key).</li>
        <li><strong>Entity Integrity Constraint:</strong> No primary key value can be NULL.</li>
        <li><strong>Referential Integrity Constraint:</strong> A foreign key value must match a primary key value in the referenced table, or be NULL.</li>
      </ul>`,
      favorite: true,
      createdAt: new Date().toISOString()
    }
  ]));

  const [pyqEntries, setPyqEntries] = useState<PYQEntry[]>(() => getLocal('pyq_entries', [
    {
      id: 'pyq_seed_1',
      subject: 'Analysis and Design of Algorithms',
      unit: 3,
      year: 2024,
      questionText: 'Explain the working of Dijkstra\'s algorithm with an example. Analyze its time complexity.',
      tags: ['Very Important', 'Repeated', 'Numerical', 'Theory', 'Long Answer'],
      bookmarked: true,
      frequency: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'pyq_seed_2',
      subject: 'Database Management Systems',
      unit: 2,
      year: 2023,
      questionText: 'State 1NF, 2NF, 3NF, and BCNF with suitable examples.',
      tags: ['Very Important', 'Repeated', 'Theory', 'Long Answer'],
      bookmarked: false,
      frequency: 4,
      createdAt: new Date().toISOString()
    }
  ]));

  const [examPlans, setExamPlans] = useState<ExamPlan[]>(() => getLocal('exam_plans', []));

  const [interviewExperiences, setInterviewExperiences] = useState<PlacementInterviewExperience[]>(() => getLocal('interview_experiences', [
    {
      id: 'int_seed_1',
      companyName: 'Google',
      role: 'Associate Software Engineer',
      interviewDate: '2026-04-15',
      roundCount: 4,
      questionsAsked: ['Find the shortest path in a grid with obstacles', 'Implement a rate limiter', 'Behavioral: Tell me about a time you handled conflict in a team'],
      difficulty: 'Hard',
      outcome: 'Selected',
      tips: 'Practice graph algorithms and dynamic programming. Focus on writing clean code and explaining your design clearly.',
      tags: ['DSA', 'HR', 'Coding Round', 'Technical Round'],
      bookmarked: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'int_seed_2',
      companyName: 'Microsoft',
      role: 'Software Engineering Intern',
      interviewDate: '2026-05-10',
      roundCount: 3,
      questionsAsked: ['Reverse a linked list in groups of K', 'Design a scalable URL shortener', 'Explain DBMS indexing and B-Trees'],
      difficulty: 'Medium',
      outcome: 'Selected',
      tips: 'Solidify your core computer science fundamentals (OS, DBMS, Computer Networks). Speak out loud during the coding rounds.',
      tags: ['DSA', 'Core CS', 'Technical Round'],
      bookmarked: false,
      createdAt: new Date().toISOString()
    }
  ]));

  const [exportLogs, setExportLogs] = useState<ExportHistoryLog[]>(() => getLocal('export_logs', []));

  // Syncing changes to localStorage
  useEffect(() => { setLocal('profile', userProfile); }, [userProfile]);
  useEffect(() => { setLocal('onboarded', isOnboarded); }, [isOnboarded]);
  useEffect(() => { setLocal('study_tasks', studyTasks); }, [studyTasks]);
  useEffect(() => { setLocal('subjects', subjects); }, [subjects]);
  useEffect(() => { setLocal('exams', exams); }, [exams]);
  useEffect(() => { setLocal('timetable', timetable); }, [timetable]);
  useEffect(() => { setLocal('attendance', attendance); }, [attendance]);
  useEffect(() => { setLocal('assignments', assignments); }, [assignments]);
  useEffect(() => { setLocal('internal_marks', internalMarks); }, [internalMarks]);
  useEffect(() => { setLocal('notes', notes); }, [notes]);
  useEffect(() => { setLocal('saved_projects', savedProjects); }, [savedProjects]);
  useEffect(() => { setLocal('saved_questions', savedQuestions); }, [savedQuestions]);
  useEffect(() => { setLocal('mock_test_attempts', mockTestAttempts); }, [mockTestAttempts]);
  useEffect(() => { setLocal('challenge_streak', dailyChallengeStreak); }, [dailyChallengeStreak]);
  useEffect(() => { setLocal('challenge_last_played', dailyChallengeLastPlayed); }, [dailyChallengeLastPlayed]);
  useEffect(() => { setLocal('roadmap_milestones', completedRoadmapMilestones); }, [completedRoadmapMilestones]);
  useEffect(() => { setLocal('support_tickets', supportTickets); }, [supportTickets]);
  useEffect(() => { setLocal('notices', notices); }, [notices]);
  useEffect(() => { setLocal('academic_resources', academicResources); }, [academicResources]);
  
  // Syncing new states
  useEffect(() => { setLocal('ai_notes', aiNotes); }, [aiNotes]);
  useEffect(() => { setLocal('pyq_entries', pyqEntries); }, [pyqEntries]);
  useEffect(() => { setLocal('exam_plans', examPlans); }, [examPlans]);
  useEffect(() => { setLocal('interview_experiences', interviewExperiences); }, [interviewExperiences]);
  useEffect(() => { setLocal('export_logs', exportLogs); }, [exportLogs]);

  // Handle Root Theme Classes
  useEffect(() => {
    setLocal('theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarded(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Study Planner actions
  const addStudyTask = (task: Omit<StudyTask, 'id' | 'completed'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
      completed: false
    };
    setStudyTasks((prev) => [newTask, ...prev]);
  };

  const toggleStudyTask = (id: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteStudyTask = (id: string) => {
    setStudyTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addSubject = (sub: Omit<Subject, 'id' | 'unitsCompleted'>) => {
    const newSub: Subject = {
      ...sub,
      id: `sub_${Date.now()}`,
      unitsCompleted: 0
    };
    setSubjects((prev) => [...prev, newSub]);
    
    // Set default empty attendance & marks
    setAttendance((prev) => ({ ...prev, [newSub.id]: { present: 0, absent: 0 } }));
    setInternalMarks((prev) => ({
      ...prev,
      [newSub.id]: { internal1: '', internal2: '', assignments: '', maxMarks: '50' }
    }));
  };

  const updateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const updateSubjectUnits = (id: string, unitsCompleted: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, unitsCompleted } : s))
    );
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams((prev) => [...prev, { ...exam, id: `exam_${Date.now()}` }]);
  };

  const deleteExam = (id: string) => {
    setExams((prev) => prev.filter((ex) => ex.id !== id));
  };

  // College Companion Actions
  const updateTimetable = (dayName: string, classes: TimetableClass[]) => {
    setTimetable((prev) =>
      prev.map((item) => (item.day === dayName ? { ...item, classes } : item))
    );
  };

  const logAttendance = (subjectId: string, status: 'present' | 'absent' | 'reset') => {
    setAttendance((prev) => {
      const record = prev[subjectId] || { present: 0, absent: 0 };
      if (status === 'present') {
        return { ...prev, [subjectId]: { ...record, present: record.present + 1 } };
      } else if (status === 'absent') {
        return { ...prev, [subjectId]: { ...record, absent: record.absent + 1 } };
      } else {
        return { ...prev, [subjectId]: { present: 0, absent: 0 } };
      }
    });
  };

  const addAssignment = (assign: Omit<Assignment, 'id' | 'completed'>) => {
    setAssignments((prev) => [
      { ...assign, id: `assign_${Date.now()}`, completed: false },
      ...prev
    ]);
  };

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateInternalMarks = (subjectId: string, marks: InternalMark) => {
    setInternalMarks((prev) => ({ ...prev, [subjectId]: marks }));
  };

  const addNote = (note: Omit<CollegeNote, 'id' | 'lastModified'>) => {
    setNotes((prev) => [
      { ...note, id: `note_${Date.now()}`, lastModified: new Date().toISOString() },
      ...prev
    ]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, title, content, lastModified: new Date().toISOString() } : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const addSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'date' | 'status'>) => {
    setSupportTickets((prev) => [
      {
        ...ticket,
        id: `ticket_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Open'
      },
      ...prev
    ]);
  };

  const addNotice = (notice: Omit<AcademicNotice, 'id' | 'date'>) => {
    const newNotice: AcademicNotice = {
      ...notice,
      id: `notice_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const updateNotice = (updated: AcademicNotice) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const addAcademicResource = (res: Omit<AcademicResource, 'id'>) => {
    const newRes: AcademicResource = {
      ...res,
      id: `res_${Date.now()}`
    };
    setAcademicResources((prev) => [newRes, ...prev]);
  };

  const deleteAcademicResource = (id: string) => {
    setAcademicResources((prev) => prev.filter((r) => r.id !== id));
  };

  // Placement Prep Actions
  const toggleSaveQuestion = (id: string) => {
    setSavedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const addMockTestAttempt = (attempt: Omit<MockTestAttempt, 'id' | 'date'>) => {
    setMockTestAttempts((prev) => [
      {
        ...attempt,
        id: `attempt_${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
  };

  const registerDailyChallengePlayed = (score: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setDailyChallengeLastPlayed(todayStr);
    
    // Increment streak if yesterday was played or no plays yet
    if (dailyChallengeLastPlayed) {
      const lastPlay = new Date(dailyChallengeLastPlayed);
      const diffTime = Math.abs(new Date(todayStr).getTime() - lastPlay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        setDailyChallengeStreak((prev) => prev + 1);
      } else {
        setDailyChallengeStreak(1);
      }
    } else {
      setDailyChallengeStreak(1);
    }
  };

  // Project Generator Actions
  const toggleSaveProject = (id: string) => {
    setSavedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Roadmap Actions
  const toggleMilestone = (id: string) => {
    setCompletedRoadmapMilestones((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  // New Handlers
  const saveAINote = (note: Omit<AINotesEntry, 'id' | 'createdAt' | 'favorite'>) => {
    const newNote: AINotesEntry = {
      ...note,
      id: `ai_note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      favorite: false
    };
    setAiNotes(prev => [newNote, ...prev]);
  };

  const toggleFavoriteNote = (id: string) => {
    setAiNotes(prev => prev.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));
  };

  const deleteAINote = (id: string) => {
    setAiNotes(prev => prev.filter(n => n.id !== id));
  };

  const addPYQQuestion = (pyq: Omit<PYQEntry, 'id' | 'createdAt' | 'bookmarked'>) => {
    const newPyq: PYQEntry = {
      ...pyq,
      id: `pyq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      bookmarked: false
    };
    setPyqEntries(prev => [newPyq, ...prev]);
  };

  const toggleBookmarkPYQ = (id: string) => {
    setPyqEntries(prev => prev.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q));
  };

  const deletePYQQuestion = (id: string) => {
    setPyqEntries(prev => prev.filter(q => q.id !== id));
  };

  const addExamPlan = (plan: ExamPlan) => {
    setExamPlans(prev => [plan, ...prev]);
  };

  const deleteExamPlan = (id: string) => {
    setExamPlans(prev => prev.filter(p => p.id !== id));
  };

  const addInterviewExperience = (exp: Omit<PlacementInterviewExperience, 'id' | 'createdAt' | 'bookmarked'>) => {
    const newExp: PlacementInterviewExperience = {
      ...exp,
      id: `int_exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      bookmarked: false
    };
    setInterviewExperiences(prev => [newExp, ...prev]);
  };

  const toggleBookmarkInterview = (id: string) => {
    setInterviewExperiences(prev => prev.map(e => e.id === id ? { ...e, bookmarked: !e.bookmarked } : e));
  };

  const deleteInterviewExperience = (id: string) => {
    setInterviewExperiences(prev => prev.filter(e => e.id !== id));
  };

  const logExportDocument = (module: string, title: string) => {
    const newLog: ExportHistoryLog = {
      id: `export_${Date.now()}`,
      module,
      title,
      timestamp: new Date().toISOString()
    };
    setExportLogs(prev => [newLog, ...prev]);
  };

  const setAttendanceCount = (subjectId: string, present: number, absent: number) => {
    setAttendance(prev => ({
      ...prev,
      [subjectId]: { present, absent }
    }));
  };

  const importBackupData = (backup: any): boolean => {
    try {
      if (!backup || typeof backup !== 'object') return false;
      
      if (backup.userProfile) setUserProfile(backup.userProfile);
      if (backup.isOnboarded !== undefined) setIsOnboarded(backup.isOnboarded);
      if (backup.studyTasks) setStudyTasks(backup.studyTasks);
      if (backup.subjects) setSubjects(backup.subjects);
      if (backup.exams) setExams(backup.exams);
      if (backup.timetable) setTimetable(backup.timetable);
      if (backup.attendance) setAttendance(backup.attendance);
      if (backup.assignments) setAssignments(backup.assignments);
      if (backup.internalMarks) setInternalMarks(backup.internalMarks);
      if (backup.notes) setNotes(backup.notes);
      if (backup.savedProjects) setSavedProjects(backup.savedProjects);
      if (backup.savedQuestions) setSavedQuestions(backup.savedQuestions);
      if (backup.mockTestAttempts) setMockTestAttempts(backup.mockTestAttempts);
      if (backup.dailyChallengeStreak !== undefined) setDailyChallengeStreak(backup.dailyChallengeStreak);
      if (backup.dailyChallengeLastPlayed !== undefined) setDailyChallengeLastPlayed(backup.dailyChallengeLastPlayed);
      if (backup.completedRoadmapMilestones) setCompletedRoadmapMilestones(backup.completedRoadmapMilestones);
      if (backup.supportTickets) setSupportTickets(backup.supportTickets);
      
      // New states
      if (backup.aiNotes) setAiNotes(backup.aiNotes);
      if (backup.pyqEntries) setPyqEntries(backup.pyqEntries);
      if (backup.examPlans) setExamPlans(backup.examPlans);
      if (backup.interviewExperiences) setInterviewExperiences(backup.interviewExperiences);
      if (backup.exportLogs) setExportLogs(backup.exportLogs);
      if (backup.notices) setNotices(backup.notices);
      if (backup.academicResources) setAcademicResources(backup.academicResources);
      
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('esa_profile');
    localStorage.removeItem('esa_onboarded');
    localStorage.removeItem('esa_study_tasks');
    localStorage.removeItem('esa_subjects');
    localStorage.removeItem('esa_exams');
    localStorage.removeItem('esa_timetable');
    localStorage.removeItem('esa_attendance');
    localStorage.removeItem('esa_assignments');
    localStorage.removeItem('esa_internal_marks');
    localStorage.removeItem('esa_notes');
    localStorage.removeItem('esa_saved_projects');
    localStorage.removeItem('esa_saved_questions');
    localStorage.removeItem('esa_mock_test_attempts');
    localStorage.removeItem('esa_challenge_streak');
    localStorage.removeItem('esa_challenge_last_played');
    localStorage.removeItem('esa_roadmap_milestones');
    localStorage.removeItem('esa_support_tickets');
    
    // New local storage removals
    localStorage.removeItem('esa_ai_notes');
    localStorage.removeItem('esa_pyq_entries');
    localStorage.removeItem('esa_exam_plans');
    localStorage.removeItem('esa_interview_experiences');
    localStorage.removeItem('esa_export_logs');
    localStorage.removeItem('esa_notices');
    localStorage.removeItem('esa_academic_resources');

    setUserProfile(null);
    setIsOnboarded(false);
    setStudyTasks([]);
    setSubjects([]);
    setExams([]);
    setTimetable(defaultTimetable);
    setAttendance({});
    setAssignments([]);
    setInternalMarks({});
    setNotes([]);
    setSavedProjects([]);
    setSavedQuestions([]);
    setMockTestAttempts([]);
    setDailyChallengeStreak(0);
    setDailyChallengeLastPlayed(null);
    setCompletedRoadmapMilestones([]);
    setSupportTickets([]);
    
    // Reset state lists
    setAiNotes([]);
    setPyqEntries([]);
    setExamPlans([]);
    setInterviewExperiences([]);
    setExportLogs([]);
    setNotices(defaultNotices);
    setAcademicResources(defaultAcademicResources);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        isOnboarded,
        theme,
        studyTasks,
        subjects,
        exams,
        timetable,
        attendance,
        assignments,
        internalMarks,
        notes,
        savedProjects,
        savedQuestions,
        mockTestAttempts,
        dailyChallengeStreak,
        dailyChallengeLastPlayed,
        completedRoadmapMilestones,
        notices,
        events,
        supportTickets,
        academicResources,
        aiNotes,
        pyqEntries,
        examPlans,
        interviewExperiences,
        exportLogs,
        updateProfile,
        toggleTheme,
        addStudyTask,
        toggleStudyTask,
        deleteStudyTask,
        addSubject,
        updateSubject,
        updateSubjectUnits,
        deleteSubject,
        addExam,
        deleteExam,
        updateTimetable,
        logAttendance,
        addAssignment,
        toggleAssignment,
        deleteAssignment,
        updateInternalMarks,
        addNote,
        updateNote,
        deleteNote,
        addSupportTicket,
        addNotice,
        updateNotice,
        deleteNotice,
        addAcademicResource,
        deleteAcademicResource,
        toggleSaveQuestion,
        addMockTestAttempt,
        registerDailyChallengePlayed,
        toggleSaveProject,
        toggleMilestone,
        saveAINote,
        toggleFavoriteNote,
        deleteAINote,
        addPYQQuestion,
        toggleBookmarkPYQ,
        deletePYQQuestion,
        addExamPlan,
        deleteExamPlan,
        addInterviewExperience,
        toggleBookmarkInterview,
        deleteInterviewExperience,
        logExportDocument,
        setAttendanceCount,
        importBackupData,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
