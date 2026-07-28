import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  placementQuestions,
  codingQuestions,
  companyPrepPaths,
  interviewQA,
  resumeChecklist,
  MultipleChoiceQuestion,
  CodingQuestion
} from '../data/placementData';
import {
  Award,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle,
  Code,
  Bookmark,
  ChevronDown,
  Timer,
  BarChart2,
  ListTodo,
  Sparkles,
  BookOpen,
  Flame,
  CheckCircle2,
  Circle,
  Copy,
  Check
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { InterviewRepository } from '../components/interviews/InterviewRepository';

interface PlacementPrepProps {
  activeTab?: 'challenge' | 'mcq' | 'coding' | 'mock' | 'interview' | 'interview-repo' | 'analytics';
  setActiveTab?: (tab: 'challenge' | 'mcq' | 'coding' | 'mock' | 'interview' | 'interview-repo' | 'analytics') => void;
}

export const PlacementPrep: React.FC<PlacementPrepProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}) => {
  const {
    savedQuestions,
    toggleSaveQuestion,
    mockTestAttempts,
    addMockTestAttempt,
    dailyChallengeStreak,
    dailyChallengeLastPlayed,
    registerDailyChallengePlayed
  } = useApp();

  const [localActiveTab, setLocalActiveTab] = useState<'challenge' | 'mcq' | 'coding' | 'mock' | 'interview' | 'interview-repo' | 'analytics'>('challenge');

  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setLocalActiveTab;

  // MCQ Filter States
  const [selectedMcqCategory, setSelectedMcqCategory] = useState<string>('All');
  const [selectedMcqDifficulty, setSelectedMcqDifficulty] = useState<string>('All');
  
  // MCQ Interactive States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Daily Challenge States (Enhanced)
  const [challengeCategory, setChallengeCategory] = useState<string>('All');
  const [challengeQuestions, setChallengeQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [challengeStep, setChallengeStep] = useState<number>(-1); // -1 = Start screen, 0-9 = questions, 10 = result
  const [challengeAnswers, setChallengeAnswers] = useState<number[]>([]);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeSecondsElapsed, setChallengeSecondsElapsed] = useState<number>(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  // Coding Sandbox States
  const [selectedCodeId, setSelectedCodeId] = useState<string>(codingQuestions[0].id);
  const [userCode, setUserCode] = useState<string>(codingQuestions[0].starterCode);
  const [codeConsoleOutput, setCodeConsoleOutput] = useState<string>('');
  const [showCodingSolution, setShowCodingSolution] = useState<boolean>(false);

  // Timed Mock Test States
  const [mockQuestions, setMockQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [mockActive, setMockActive] = useState<boolean>(false);
  const [mockTimeLeft, setMockTimeLeft] = useState<number>(300); // 5 mins for mini mock
  const [mockStep, setMockStep] = useState<number>(0);
  const [mockAnswers, setMockAnswers] = useState<number[]>([]);

  // AI Resume Bullet Generator States
  const [resProjTitle, setResProjTitle] = useState('');
  const [resProjTech, setResProjTech] = useState('');
  const [resProjImpact, setResProjImpact] = useState('');
  const [generatedBullets, setGeneratedBullets] = useState<string[]>([]);
  const [copiedBullets, setCopiedBullets] = useState(false);

  // Resume Checklist State
  const [localResumeChecklist, setLocalResumeChecklist] = useState(() => {
    try {
      const stored = localStorage.getItem('esa_resume_checklist');
      return stored ? JSON.parse(stored) : resumeChecklist;
    } catch (e) {
      return resumeChecklist;
    }
  });

  useEffect(() => {
    localStorage.setItem('esa_resume_checklist', JSON.stringify(localResumeChecklist));
  }, [localResumeChecklist]);

  // Sync code editor template when problem changes
  useEffect(() => {
    const p = codingQuestions.find((q) => q.id === selectedCodeId);
    if (p) {
      setUserCode(p.starterCode);
      setCodeConsoleOutput('');
      setShowCodingSolution(false);
    }
  }, [selectedCodeId]);

  // Timed mock runner
  useEffect(() => {
    let timer: any = null;
    if (mockActive && mockTimeLeft > 0) {
      timer = setInterval(() => {
        setMockTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (mockActive && mockTimeLeft === 0) {
      handleFinishMockTest();
    }
    return () => clearInterval(timer);
  }, [mockActive, mockTimeLeft]);

  // Daily challenge timer
  useEffect(() => {
    let timer: any = null;
    if (challengeStep >= 0 && challengeStep <= 9) {
      timer = setInterval(() => {
        setChallengeSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [challengeStep]);

  // 1. Initialize Daily Challenge
  const handleStartChallenge = () => {
    // Filter by category if selected
    let bank = [...placementQuestions];
    if (challengeCategory !== 'All') {
      bank = bank.filter(q => q.category === challengeCategory);
    }

    // Shuffle and pick 10
    const shuffled = bank.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    // Fallback in case of small pool
    if (selected.length < 10) {
      const extra = [...placementQuestions]
        .filter(q => !selected.some(s => s.id === q.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 10 - selected.length);
      selected.push(...extra);
    }

    setChallengeQuestions(selected);
    setChallengeAnswers(new Array(10).fill(-1));
    setChallengeStep(0);
    setChallengeScore(0);
    setChallengeSecondsElapsed(0);
    setWeakTopics([]);
  };

  const handleSelectChallengeAnswer = (questionIndex: number, optionIndex: number) => {
    const updated = [...challengeAnswers];
    updated[questionIndex] = optionIndex;
    setChallengeAnswers(updated);
  };

  const handleNextChallenge = () => {
    if (challengeStep < 9) {
      setChallengeStep((prev) => prev + 1);
    } else {
      // Calculate Score & diagnose Weak Topics
      let finalScore = 0;
      const incorrectTopics: string[] = [];

      challengeQuestions.forEach((q, idx) => {
        if (challengeAnswers[idx] === q.correctAnswer) {
          finalScore += 1;
        } else {
          // Add clean topic (e.g. strip main category prefix)
          const topicClean = q.topic.includes(' - ') ? q.topic.split(' - ')[1] : q.topic;
          if (!incorrectTopics.includes(topicClean)) {
            incorrectTopics.push(topicClean);
          }
        }
      });

      setChallengeScore(finalScore);
      setWeakTopics(incorrectTopics);
      setChallengeStep(10);
      registerDailyChallengePlayed(finalScore);
      
      // Save to mockTestAttempts for graphs and history
      addMockTestAttempt({
        score: finalScore,
        total: 10,
        accuracy: finalScore * 10,
        timeSpentSeconds: challengeSecondsElapsed
      });
    }
  };

  // 2. Timed Mock Test logic
  const handleStartMockTest = () => {
    const shuffled = [...placementQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5); // 5 question mini mock
    setMockQuestions(selected);
    setMockAnswers(new Array(5).fill(-1));
    setMockTimeLeft(300);
    setMockStep(0);
    setMockActive(true);
  };

  const handleFinishMockTest = () => {
    setMockActive(false);
    let finalScore = 0;
    mockQuestions.forEach((q, idx) => {
      if (mockAnswers[idx] === q.correctAnswer) {
        finalScore += 1;
      }
    });

    addMockTestAttempt({
      score: finalScore,
      total: 5,
      accuracy: Math.round((finalScore / 5) * 100),
      timeSpentSeconds: 300 - mockTimeLeft
    });

    alert(`Mock Test completed! You scored ${finalScore}/5.`);
  };

  // 3. Coding compiler simulation
  const handleRunCode = () => {
    setCodeConsoleOutput('Compiling code files...\nRunning unit test cases...');
    
    setTimeout(() => {
      const p = codingQuestions.find((q) => q.id === selectedCodeId);
      if (!p) return;
      
      const codeClean = userCode.replace(/\s+/g, '');
      
      if (p.id === 'code_1') {
        const hasMap = codeClean.includes('Map') || codeClean.includes('map');
        const hasFor = codeClean.includes('for');
        if (hasMap && hasFor) {
          setCodeConsoleOutput(`✓ Test Case 1 Passed: Input [2, 7, 11, 15] Target 9 -> Output [0, 1]\n✓ Test Case 2 Passed: Input [3, 2, 4] Target 6 -> Output [1, 2]\n\nSuccess: Code executed successfully with 0ms lag.`);
        } else {
          setCodeConsoleOutput(`✗ Test Case 1 Failed: Expected [0, 1], received []\nReason: Starter function returned default empty array. Please implement map matching logic.`);
        }
      } else if (p.id === 'code_4') {
        const hasStack = codeClean.includes('stack') || codeClean.includes('pop') || codeClean.includes('push');
        if (hasStack) {
          setCodeConsoleOutput(`✓ Test Case 1 Passed: Input "()[]{}" -> Output true\n✓ Test Case 2 Passed: Input "(]" -> Output false\n\nSuccess: Parentheses parsing verified.`);
        } else {
          setCodeConsoleOutput(`✗ Test Case 1 Failed\nReason: Enforce matching character sequence constraints.`);
        }
      } else {
        setCodeConsoleOutput(`✓ Test Case 1 Passed\n✓ Test Case 2 Passed\n\nSuccess: Output matched with expected template variables.`);
      }
    }, 800);
  };

  // 4. MCQ Filter match
  const filteredMcqs = placementQuestions.filter((q) => {
    const matchCat = selectedMcqCategory === 'All' || q.category === selectedMcqCategory;
    const matchDiff = selectedMcqDifficulty === 'All' || q.difficulty === selectedMcqDifficulty;
    return matchCat && matchDiff;
  });

  // Toggle Resume checklist item
  const toggleResumeCheck = (id: string) => {
    setLocalResumeChecklist((prev: any) =>
      prev.map((item: any) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // 5. ATS Resume Bullet Generator
  const handleGenerateBullets = () => {
    if (!resProjTitle || !resProjTech) return;
    
    const techs = resProjTech.split(',').map(t => t.trim());
    const primaryTech = techs[0] || 'core technologies';
    const secondaryTech = techs.slice(1, 4).join(', ') || 'supporting platforms';
    const impactText = resProjImpact || 'optimizing processing efficiency and API response times';

    const bullets = [
      `• **Designed and developed** a high-performance **${resProjTitle}** leveraging **${primaryTech}** and **${secondaryTech}** to solve critical data bottlenecks.`,
      `• **Engineered** structured database tables and integrated REST API connections, resulting in a **35% reduction** in query latency and data load overheads.`,
      `• **Implemented** automated client workflows and secure state management models, directly **${impactText}**.`,
      `• **Configured** complete Git version control branches and configured containerized deployment strategies, ensuring **100% offline-first application stability**.`
    ];

    setGeneratedBullets(bullets);
  };

  const handleCopyBullets = () => {
    const text = generatedBullets.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  // Performance Charts Data
  const averageAccuracy = mockTestAttempts.length > 0
    ? Math.round(mockTestAttempts.reduce((acc, curr) => acc + curr.accuracy, 0) / mockTestAttempts.length)
    : 0;

  const mockTestChartData = mockTestAttempts.map((attempt, idx) => ({
    name: `Test ${idx + 1}`,
    'Accuracy %': attempt.accuracy
  })).reverse();

  // Radar metrics for topics strength
  const radarChartData = [
    { subject: 'Aptitude', A: 80, B: 100, fullMark: 100 },
    { subject: 'Logical', A: 70, B: 100, fullMark: 100 },
    { subject: 'Verbal', A: 85, B: 100, fullMark: 100 },
    { subject: 'Coding', A: 60, B: 100, fullMark: 100 },
    { subject: 'Interview', A: 75, B: 100, fullMark: 100 }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Placement Training Hub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Crack coding interviews, quantitative aptitude, and resume verification audits.</p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-200/50 dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border p-1 rounded-2xl gap-1.5 overflow-x-auto shrink-0 select-none">
          {['challenge', 'mcq', 'coding', 'mock', 'interview', 'interview-repo', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setChallengeStep(-1);
                setMockActive(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-primary text-white shadow'
                  : 'text-slate-655 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'challenge'
                ? 'Daily Challenge'
                : tab === 'mcq'
                ? 'Question Bank'
                : tab === 'mock'
                ? 'Mock Test'
                : tab === 'interview'
                ? 'Resume Q&A'
                : tab === 'interview-repo'
                ? 'Interview Repository'
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Screen panels */}

      {/* DAILY CHALLENGE */}
      {activeTab === 'challenge' && (
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
          {challengeStep === -1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-orange-accent/15 text-orange-accent flex items-center justify-center mx-auto animate-glow">
                <Zap size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Daily Placement Quiz</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Take a timed 10-question quiz. Choose a specific topic category or launch a mixed set below.
                </p>
              </div>

              {/* Category selector */}
              <div className="space-y-1.5 text-left max-w-sm mx-auto">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Select Quiz Topic</label>
                <select
                  value={challengeCategory}
                  onChange={(e) => setChallengeCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-dark-bg border border-slate-250 dark:border-slate-card-border rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                >
                  <option value="All">Mixed Topics (Recommended)</option>
                  <option value="aptitude">Quantitative Aptitude</option>
                  <option value="logical">Logical Reasoning</option>
                  <option value="verbal">Verbal Ability</option>
                  <option value="interview">CS Core Basics</option>
                </select>
              </div>

              {/* Streak Tracker info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border max-w-sm mx-auto flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Quiz Streak:</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 dark:text-white">
                  {dailyChallengeStreak} Days <Flame className="text-orange-accent" size={18} />
                </span>
              </div>

              <button
                onClick={handleStartChallenge}
                className="w-full max-w-sm py-3.5 rounded-2xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-sm transition duration-200 shadow-lg shadow-indigo-600/10"
              >
                Start Daily Challenge
              </button>
            </div>
          )}

          {challengeStep >= 0 && challengeStep <= 9 && challengeQuestions.length > 0 && (
            <div className="space-y-6">
              {/* Steps Progress */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Question {challengeStep + 1} of 10</span>
                <span className="flex items-center gap-1 font-mono text-[13px] text-slate-500 font-extrabold">
                  <Timer size={14} /> {Math.floor(challengeSecondsElapsed / 60)}:{(challengeSecondsElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-indigo-primary" style={{ width: `${(challengeStep + 1) * 10}%` }} />
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[9px] font-black uppercase tracking-wider">
                    {challengeQuestions[challengeStep].category === 'aptitude' ? 'Quantitative' : challengeQuestions[challengeStep].category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-orange-accent/15 text-orange-accent text-[9px] font-black uppercase tracking-wider">
                    {challengeQuestions[challengeStep].difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                  {challengeQuestions[challengeStep].question}
                </h4>
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {challengeQuestions[challengeStep].options.map((opt, idx) => {
                  const selected = challengeAnswers[challengeStep] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectChallengeAnswer(challengeStep, idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition duration-200 flex items-center justify-between ${
                        selected
                          ? 'border-indigo-primary bg-indigo-primary/5 dark:bg-indigo-primary/10 text-indigo-primary'
                          : 'border-slate-250 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg/85 text-slate-700 dark:text-slate-350'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selected ? 'border-indigo-primary bg-indigo-primary text-white' : 'border-slate-350 dark:border-slate-550'
                      }`}>
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation button */}
              <button
                onClick={handleNextChallenge}
                disabled={challengeAnswers[challengeStep] === -1}
                className="w-full py-3.5 rounded-2xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-sm transition duration-200 disabled:opacity-50"
              >
                {challengeStep === 9 ? 'Submit Challenge' : 'Next Question'}
              </button>
            </div>
          )}

          {challengeStep === 10 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-primary/10 text-indigo-primary flex items-center justify-center mx-auto animate-glow">
                <Award size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Challenge Complete!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Here is your scoring breakdown:</p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg/60 max-w-sm mx-auto grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score</div>
                  <div className="text-lg font-black text-slate-800 dark:text-white">{challengeScore} / 10</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</div>
                  <div className="text-lg font-black text-indigo-primary">{challengeScore * 10}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Speed</div>
                  <div className="text-lg font-black text-orange-accent">{Math.floor(challengeSecondsElapsed / 60)}:{(challengeSecondsElapsed % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>

              {/* Weak Topics Diagnosis */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-left max-w-sm mx-auto space-y-1">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">Diagnosed Weak Topics</span>
                {weakTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {weakTopics.map((topic, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black">{topic}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 font-bold">Perfect score! No weak topics found.</p>
                )}
              </div>

              <div className="flex gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => setChallengeStep(-1)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-card-border text-slate-700 dark:text-slate-350 font-extrabold text-xs hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setChallengeStep(-1);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs"
                >
                  Performance Analytics
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUESTION BANK MCQ */}
      {activeTab === 'mcq' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters column */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Filters</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</label>
              <select
                value={selectedMcqCategory}
                onChange={(e) => setSelectedMcqCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-xs font-bold text-slate-750 dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="aptitude">Quantitative Aptitude</option>
                <option value="logical">Logical Reasoning</option>
                <option value="verbal">Verbal Ability</option>
                <option value="interview">CS Core Basics</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Difficulty</label>
              <select
                value={selectedMcqDifficulty}
                onChange={(e) => setSelectedMcqDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-xs font-bold text-slate-750 dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
                <option value="Extremely Hard">Extremely Hard</option>
              </select>
            </div>

            {/* Progress metrics */}
            <div className="border-t border-slate-100 dark:border-slate-card-border/60 pt-4 space-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Bank Stats</span>
              <div>Total Bank Size: <span className="text-slate-800 dark:text-white font-extrabold">{placementQuestions.length} questions</span></div>
              <div>Filtered Results: <span className="text-slate-800 dark:text-white font-extrabold">{filteredMcqs.length}</span></div>
            </div>
          </div>

          {/* Questions column */}
          <div className="lg:col-span-3 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredMcqs.map((q) => {
              const answeredIdx = selectedAnswers[q.id];
              const isAnswered = answeredIdx !== undefined;
              const isSaved = savedQuestions.includes(q.id);

              return (
                <div key={q.id} className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                  
                  {/* Top tags */}
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-primary/10 text-indigo-primary text-[9px] font-black uppercase tracking-wider">
                        {q.category === 'aptitude' ? 'Quantitative' : q.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-orange-accent/15 text-orange-accent text-[9px] font-black uppercase tracking-wider">
                        {q.difficulty}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => toggleSaveQuestion(q.id)}
                      className={`p-1.5 rounded-lg transition duration-150 ${
                        isSaved ? 'text-orange-accent bg-orange-accent/10' : 'text-slate-405 hover:text-slate-250'
                      }`}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>

                  {/* Topic & Question */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{q.topic}</h5>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{q.question}</p>
                  </div>

                  {/* MCQ options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = answeredIdx === oIdx;
                      const isCorrect = oIdx === q.correctAnswer;
                      
                      let btnClass = 'border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-700 dark:text-slate-350';
                      
                      if (isAnswered) {
                        if (isCorrect) {
                          btnClass = 'border-emerald-500 bg-emerald-500/5 text-emerald-500';
                        } else if (isOptionSelected) {
                          btnClass = 'border-rose-500 bg-rose-500/5 text-rose-500';
                        } else {
                          btnClass = 'border-slate-200/40 dark:border-slate-card-border/40 text-slate-400/40 pointer-events-none';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition duration-200 ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isCorrect && <CheckCircle className="text-emerald-500 shrink-0" size={16} />}
                          {isAnswered && isOptionSelected && !isCorrect && <XCircle className="text-rose-500 shrink-0" size={16} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanations button */}
                  {isAnswered && (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowExplanation((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                        className="text-xs font-bold text-indigo-primary hover:underline flex items-center gap-1"
                      >
                        {showExplanation[q.id] ? 'Hide Explanation' : 'View Explanation'}
                        <ChevronDown size={14} className={`transform transition-transform ${showExplanation[q.id] ? 'rotate-180' : ''}`} />
                      </button>
                      {showExplanation[q.id] && (
                        <div className="mt-3 p-4 rounded-2xl bg-indigo-primary/5 dark:bg-indigo-primary/10 border border-indigo-primary/10 text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* CODING PRACTICE SANDBOX */}
      {activeTab === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem description panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 max-h-[500px] overflow-y-auto pr-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Problem</h4>
            
            <div className="flex flex-col gap-2">
              {codingQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedCodeId(q.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-200 font-bold ${
                    selectedCodeId === q.id
                      ? 'border-indigo-primary bg-indigo-primary/5 text-indigo-primary'
                      : 'border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-705 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-black block">{q.title}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{q.topic} | <strong className="text-orange-accent">{q.difficulty}</strong></span>
                </button>
              ))}
            </div>

            <hr className="border-slate-250 dark:border-slate-card-border" />

            {/* Render selected problem description */}
            {(() => {
              const q = codingQuestions.find((c) => c.id === selectedCodeId);
              if (!q) return null;
              return (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-white">{q.title}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-black">{q.difficulty}</span>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{q.description}</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-200">Constraints</h5>
                    <pre className="p-3 bg-slate-100 dark:bg-slate-dark-bg rounded-xl font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-400">{q.constraints}</pre>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-200">Sample IO</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-slate-100 dark:bg-slate-dark-bg rounded-xl">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Input</label>
                        <pre className="font-mono text-[10px] text-slate-650 dark:text-slate-300">{q.sampleInput}</pre>
                      </div>
                      <div className="p-3 bg-slate-100 dark:bg-slate-dark-bg rounded-xl">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Output</label>
                        <pre className="font-mono text-[10px] text-slate-650 dark:text-slate-300">{q.sampleOutput}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Code Editor and Output Console */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex-1 flex flex-col justify-between space-y-3 min-h-[320px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-card-border">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-355 font-bold text-xs font-mono">
                  <Code size={16} /> index.ts
                </div>
                
                <button
                  onClick={() => setShowCodingSolution(!showCodingSolution)}
                  className="text-[10px] font-black text-orange-accent hover:underline"
                >
                  {showCodingSolution ? 'Show Editor' : 'Reveal Solution'}
                </button>
              </div>

              {!showCodingSolution ? (
                <textarea
                  rows={14}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-dark-bg/80 border border-slate-200 dark:border-slate-card-border text-slate-800 dark:text-slate-300 p-4 font-mono text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-primary leading-relaxed resize-y"
                />
              ) : (
                <pre className="w-full bg-slate-50 dark:bg-slate-dark-bg/80 border border-slate-200 dark:border-slate-card-border text-indigo-700 dark:text-indigo-300 p-4 font-mono text-[11px] rounded-2xl overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                  {codingQuestions.find((q) => q.id === selectedCodeId)?.solution}
                </pre>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleRunCode}
                  className="px-6 py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200"
                >
                  Run Tests
                </button>
              </div>
            </div>

            {/* Console output window */}
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-dark-bg/80 border border-slate-200 dark:border-slate-card-border text-left">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2 font-mono">Console Output</span>
              <pre className="font-mono text-xs text-slate-700 dark:text-slate-350 whitespace-pre-wrap leading-relaxed min-h-[60px]">
                {codeConsoleOutput || 'Click "Run Tests" to execute unit templates...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TIMED MOCK TEST */}
      {activeTab === 'mock' && (
        <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
          {!mockActive ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-primary/10 text-indigo-primary flex items-center justify-center mx-auto animate-glow">
                <Timer size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Timed Placement Mock Assessment</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Evaluate yourself with a timed, 5-question mini placement test. Results will compile in your performance dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs font-bold border border-slate-100 dark:border-slate-card-border p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-dark-bg/60">
                <div>
                  <span className="text-slate-400 uppercase tracking-widest text-[8px] block">Questions</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">5 MCQs</span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-widest text-[8px] block">Duration</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">5 Minutes</span>
                </div>
              </div>

              <button
                onClick={handleStartMockTest}
                className="w-full max-w-xs py-3.5 rounded-2xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-sm transition duration-200 shadow-lg"
              >
                Launch Mock Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timing details */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Question {mockStep + 1} of 5</span>
                <span className="flex items-center gap-1 text-orange-accent font-mono text-sm font-black">
                  <Timer size={16} /> {Math.floor(mockTimeLeft / 60)}:{(mockTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="w-full h-1 bg-slate-100 dark:bg-slate-dark-bg rounded-full overflow-hidden">
                <div className="h-full bg-indigo-primary" style={{ width: `${(mockStep + 1) * 20}%` }} />
              </div>

              {/* Question */}
              {mockQuestions.length > 0 && (
                <div className="space-y-4">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[9px] font-black uppercase">
                    {mockQuestions[mockStep].category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                    {mockQuestions[mockStep].question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {mockQuestions[mockStep].options.map((opt, idx) => {
                      const selected = mockAnswers[mockStep] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            const updated = [...mockAnswers];
                            updated[mockStep] = idx;
                            setMockAnswers(updated);
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition duration-150 ${
                            selected
                              ? 'border-indigo-primary bg-indigo-primary/5 dark:bg-indigo-primary/10 text-indigo-primary'
                              : 'border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-705 dark:text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination controls */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-card-border">
                {mockStep > 0 && (
                  <button
                    onClick={() => setMockStep((prev) => prev - 1)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-card-border rounded-xl text-xs font-extrabold text-slate-650 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Previous
                  </button>
                )}
                {mockStep < 4 ? (
                  <button
                    onClick={() => setMockStep((prev) => prev + 1)}
                    disabled={mockAnswers[mockStep] === -1}
                    className="flex-1 py-3 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleFinishMockTest}
                    disabled={mockAnswers[mockStep] === -1}
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl disabled:opacity-50"
                  >
                    Finish Test
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* INTERVIEW Q&A & RESUME CHECKLIST */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collapsible Q&A */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-primary" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Structured HR & Technical Q&As</h3>
              </div>

              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                {interviewQA.map((qa) => (
                  <details key={qa.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-250 dark:border-slate-card-border group">
                    <summary className="text-xs font-black text-slate-800 dark:text-slate-200 list-none flex justify-between items-center cursor-pointer select-none">
                      <span>[{qa.category}] {qa.question}</span>
                      <ChevronDown size={16} className="text-slate-405 group-open:rotate-180 transition-transform duration-150 shrink-0" />
                    </summary>
                    <div className="mt-3 text-xs leading-relaxed space-y-3 border-t border-slate-350/20 pt-3">
                      <p className="text-slate-500 dark:text-slate-350"><strong className="text-indigo-primary">Answer:</strong> {qa.suggestedAnswer}</p>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Key Points to Highlight</span>
                        <ul className="list-disc pl-4 text-slate-550 dark:text-slate-400 space-y-0.5">
                          {qa.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Resume Checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 h-fit">
              <div className="flex items-center gap-2">
                <ListTodo size={20} className="text-orange-accent" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">ATS Resume Checklist</h3>
              </div>

              <div className="space-y-2.5">
                {localResumeChecklist.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => toggleResumeCheck(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition duration-150 select-none ${
                      item.completed
                        ? 'bg-slate-100/30 dark:bg-slate-dark-bg/20 border-slate-200/50 opacity-70'
                        : 'bg-slate-50 dark:bg-slate-dark-bg border-slate-250 dark:border-slate-card-border hover:border-indigo-primary/30'
                    }`}
                  >
                    <div className={item.completed ? 'text-indigo-primary' : 'text-slate-405'}>
                      {item.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <span className={`text-xs font-bold leading-relaxed ${item.completed ? 'line-through text-slate-400' : 'text-slate-705 dark:text-slate-300'}`}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Resume Bullet generator section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-primary" />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">STAR Resume Bullet Point Generator</h3>
                <p className="text-xs text-slate-400 font-bold">Generate high-impact bullet points for your resume based on your engineering projects</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Project / Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Campus Navigation App"
                  value={resProjTitle}
                  onChange={(e) => setResProjTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Core Technologies used (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Express, Leaflet.js"
                  value={resProjTech}
                  onChange={(e) => setResProjTech(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Main Accomplishment / Impact</label>
                <input
                  type="text"
                  placeholder="e.g. reduced route latency by 40% using Dijkstra"
                  value={resProjImpact}
                  onChange={(e) => setResProjImpact(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateBullets}
                disabled={!resProjTitle || !resProjTech}
                className="px-6 py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200 disabled:opacity-50"
              >
                Generate ATS Bullets
              </button>
            </div>

            {generatedBullets.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-indigo-primary dark:text-indigo-secondary tracking-wider">Generated Resume Bullets (STAR format)</span>
                  <button
                    onClick={handleCopyBullets}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-card-bg hover:bg-slate-100 border border-slate-200 dark:border-slate-card-border text-[9px] font-black text-slate-650 dark:text-slate-400 flex items-center gap-1 transition"
                  >
                    {copiedBullets ? (
                      <>
                        <Check size={11} className="text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-750 dark:text-slate-300 font-medium leading-relaxed">
                  {generatedBullets.map((bullet, idx) => {
                    // Quick parser to bold standard **text**
                    const parts = bullet.split('**');
                    return (
                      <p key={idx}>
                        {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-primary dark:text-indigo-secondary">{p}</strong> : p)}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PERFORMANCE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Numbers block */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between space-y-4 h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Performance Summary</h3>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Accuracy</span>
                <span className="text-3xl font-black text-indigo-primary">{averageAccuracy}%</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Tests Taken</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{mockTestAttempts.length}</span>
              </div>
            </div>
          </div>

          {/* Graph blocks */}
          <div className="md:col-span-2 space-y-6">
            {/* Accuracy line/area chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Accuracy Trend</h4>
              <div className="h-44 w-full">
                {mockTestAttempts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTestChartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                      />
                      <Area type="monotone" dataKey="Accuracy %" stroke="#4f46e5" fill="rgba(79, 70, 229, 0.1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-400 h-full flex items-center justify-center">No quiz or test attempt logs available. Play a challenge first!</div>
                )}
              </div>
            </div>

            {/* Radar chart of strong topics */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Topic Strengths</h4>
              <div className="h-48 w-full flex justify-center">
                <ResponsiveContainer width="80%" height="100%">
                  <RadarChart data={radarChartData}>
                    <PolarGrid stroke="#222e47" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                    <Tooltip
                      contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                    />
                    <Radar name="Proficiency %" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interview-repo' && <InterviewRepository />}
    </div>
  );
};
export default PlacementPrep;
