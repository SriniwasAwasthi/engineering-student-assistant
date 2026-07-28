import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  AlertTriangle,
  Flame,
  Award,
  Lightbulb,
  Milestone,
  ArrowUpRight,
  Plus,
  BookOpen,
  Briefcase,
  FileText,
  History,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { GlobalSearch } from '../components/search/GlobalSearch';
import { AnalyticsLayer } from '../components/analytics/AnalyticsLayer';

interface DashboardProps {
  setActiveScreen: (screen: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveScreen }) => {
  const {
    userProfile,
    studyTasks,
    subjects,
    exams,
    attendance,
    savedProjects,
    mockTestAttempts,
    dailyChallengeStreak,
    completedRoadmapMilestones,
    notices,
    aiNotes,
    pyqEntries,
    examPlans,
    interviewExperiences,
    exportLogs,
    toggleStudyTask
  } = useApp();

  // Tab state
  const [activeDashboardTab, setActiveDashboardTab] = useState<'home' | 'analytics'>('home');

  // AI helper states
  const [helperQuery, setHelperQuery] = useState('');
  const [helperResponse, setHelperResponse] = useState('');
  const [helperLoading, setHelperLoading] = useState(false);

  // 1. Calculate Attendance averages & warnings
  const totalClasses = Object.values(attendance).reduce((acc, curr) => acc + curr.present + curr.absent, 0);
  const totalPresents = Object.values(attendance).reduce((acc, curr) => acc + curr.present, 0);
  const attendanceAvg = totalClasses > 0 ? Math.round((totalPresents / totalClasses) * 100) : 0;
  
  const subjectsBelowThreshold = subjects.filter((s) => {
    const rec = attendance[s.id];
    if (!rec) return false;
    const total = rec.present + rec.absent;
    if (total === 0) return false;
    return (rec.present / total) * 100 < 75;
  });

  // 2. Study Tasks summary
  const pendingTasks = studyTasks.filter((t) => !t.completed);

  // 3. Exam Countdowns
  const upcomingExams = exams
    .map((ex) => {
      const examDate = new Date(ex.date);
      const diffTime = examDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...ex, daysLeft: diffDays };
    })
    .filter((ex) => ex.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // 4. Career Roadmap calculation
  const totalMilestones = 8;
  const roadmapPercent = Math.round((completedRoadmapMilestones.length / totalMilestones) * 100);

  // 5. Academic Notices
  const recentNotice = notices[0];

  // 6. Suggestive Actions Engine
  const getFocusSuggestions = () => {
    const suggestions: string[] = [];

    // Check attendance status
    subjectsBelowThreshold.forEach(s => {
      const rec = attendance[s.id];
      const needed = Math.max(1, Math.ceil(3 * rec.absent - rec.present));
      suggestions.push(`Attendance in ${s.name} is low (${Math.round(rec.present / (rec.present + rec.absent) * 100)}%). Attend the next ${needed} lectures consecutively to reach 75%.`);
    });

    // Check syllabus progress
    subjects.forEach(s => {
      if (s.unitsCompleted <= 1) {
        suggestions.push(`Syllabus coverage is low in ${s.name}. Generate a strategic study plan to cover Unit 2-3.`);
      }
    });

    // Check nearest exam
    if (upcomingExams.length > 0 && upcomingExams[0].daysLeft <= 4) {
      suggestions.push(`Nearest exam "${upcomingExams[0].type}" for ${upcomingExams[0].subject} is in ${upcomingExams[0].daysLeft} days. Transition to revisions and solve PYQ sheets immediately!`);
    }

    if (suggestions.length === 0) {
      suggestions.push("All systems green! Maintain your current study streaks and continue quantitative practice logs.");
    }

    return suggestions.slice(0, 3);
  };

  const suggestions = getFocusSuggestions();

  // Local AI helper trigger
  const handleAIQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helperQuery.trim()) return;

    setHelperLoading(true);

    setTimeout(() => {
      const q = helperQuery.toLowerCase();
      let res = '';

      if (q.includes('dijkstra') || q.includes('shortest path')) {
        res = `<h3>Dijkstra's Algorithm Explainer</h3>
        <p><strong>Definition:</strong> Dijkstra's Algorithm is a greedy pathfinding routine finding the shortest path from a single source node to all other nodes in a weighted graph with non-negative edge weights.</p>
        <p><strong>Complexity:</strong> O((V + E) log V) using a binary min-priority queue.</p>
        <p><strong>Key Exam Tip:</strong> In theoretical exams, draw the graph step-by-step, listing visited sets and updating the distance matrix table on every node exploration.</p>`;
      } else if (q.includes('b-tree') || q.includes('indexing') || q.includes('index')) {
        res = `<h3>Database indexing Explainer</h3>
        <p><strong>Definition:</strong> Indices are special lookup tables used by database search engines to speed up data retrievals. They leverage B-Trees or B+ Trees structures.</p>
        <p><strong>B-Trees vs B+ Trees:</strong> In B-Trees, keys and values are stored in all nodes. In B+ Trees, data references are stored strictly in leaf nodes, which are linked as a list for rapid sequential scans.</p>`;
      } else if (q.includes('acid') || q.includes('transaction')) {
        res = `<h3>ACID Properties Explainer</h3>
        <p><strong>A - Atomicity:</strong> All changes succeed or fail as a single unit.</p>
        <p><strong>C - Consistency:</strong> State parameters remain valid after committing.</p>
        <p><strong>I - Isolation:</strong> Concurrency controls prevent multi-access collusions.</p>
        <p><strong>D - Durability:</strong> Log updates persist even after power or system failures.</p>`;
      } else if (q.includes('normal') || q.includes('nf') || q.includes('normalization')) {
        res = `<h3>Database Normalization Guide</h3>
        <p><strong>1NF:</strong> Atoms fields (no multi-valued attributes).</p>
        <p><strong>2NF:</strong> 1NF + Remove partial dependencies (every non-prime attribute is fully dependent on the primary key).</p>
        <p><strong>3NF:</strong> 2NF + Remove transitive dependencies.</p>
        <p><strong>BCNF:</strong> 3NF + Every determinant is a candidate key.</p>`;
      } else {
        res = `<h3>Syllabus Guide: "${helperQuery}"</h3>
        <p>Your query has been logged. Let's outline study recommendations for this topic:</p>
        <ul>
          <li><strong>Step 1:</strong> Read unit definitions and identify primary equations.</li>
          <li><strong>Step 2:</strong> Check the <strong>PYQ Analyzer</strong> to search for related questions in past exam papers.</li>
          <li><strong>Step 3:</strong> Compile a <strong>Revision Sheet</strong> using the notes generator tab.</li>
        </ul>`;
      }

      setHelperResponse(res);
      setHelperLoading(false);
    }, 700);
  };

  // Chart data
  const attendanceChartData = subjects.map((sub) => {
    const rec = attendance[sub.id] || { present: 0, absent: 0 };
    const total = rec.present + rec.absent;
    const percentage = total > 0 ? Math.round((rec.present / total) * 100) : 0;
    return {
      name: sub.code,
      'Attendance %': percentage
    };
  });

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left">
      {/* Search command bar */}
      <div className="max-w-2xl mx-auto w-full">
        <GlobalSearch onNavigate={setActiveScreen} />
      </div>

      {/* Header Profile Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-primary/10 via-indigo-secondary/5 to-transparent border border-indigo-primary/10 dark:border-indigo-primary/5">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-905 dark:text-white tracking-tight">
            Welcome back, <span className="text-gradient-primary">{userProfile?.name}</span>!
          </h1>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Stream: <span className="text-indigo-primary font-extrabold">{userProfile?.branch}</span> | Semester: <span className="text-orange-accent font-extrabold">{userProfile?.semester}</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200/50 dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveDashboardTab('home')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
              activeDashboardTab === 'home'
                ? 'bg-indigo-primary text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-805'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveDashboardTab('analytics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition ${
              activeDashboardTab === 'analytics'
                ? 'bg-indigo-primary text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-805'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* RENDER ANALYTICS TAB OVERLAY */}
      {activeDashboardTab === 'analytics' ? (
        <AnalyticsLayer />
      ) : (
        <>
          {/* Attendance critical warning alerts */}
          {subjectsBelowThreshold.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-455 flex items-center gap-3 animate-fadeIn">
              <AlertTriangle className="shrink-0 text-rose-500" size={20} />
              <div className="text-xs font-bold">
                <span className="font-black uppercase">Low Attendance Alert:</span> You are below 75% target in {subjectsBelowThreshold.length} subjects. Open the predictor dashboard to calculate target shortfall values.
              </div>
            </div>
          )}

          {/* Quick Metrics stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-450 uppercase block tracking-wider font-black">AI Notes</span>
                <span className="text-2xl font-black text-slate-805 dark:text-white">{aiNotes.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-primary/10 text-indigo-primary">
                <FileText size={18} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-455 block uppercase tracking-wider font-black">PYQ Questions</span>
                <span className="text-2xl font-black text-slate-805 dark:text-white">{pyqEntries.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-accent/10 text-orange-accent">
                <BookOpen size={18} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-black">Placements logged</span>
                <span className="text-2xl font-black text-slate-805 dark:text-white">{interviewExperiences.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                <Briefcase size={18} />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-455 block uppercase tracking-wider font-black">Document Exports</span>
                <span className="text-2xl font-black text-slate-805 dark:text-white">{exportLogs.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <History size={18} />
              </div>
            </div>
          </div>

          {/* Main Dashboard Panel row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Suggested actions & daily focus */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Streaks & Focus list */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Flame className="text-orange-accent animate-glow" size={20} />
                    <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">Today's Focus & Productivity</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-xl bg-orange-accent/10 text-orange-accent text-xs font-black">
                    Streak: {dailyChallengeStreak} Days
                  </span>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {studyTasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleStudyTask(t.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition duration-150 select-none ${
                        t.completed
                          ? 'bg-slate-100/30 dark:bg-slate-dark-bg/20 border-slate-200/50 opacity-70'
                          : 'bg-slate-50 dark:bg-slate-dark-bg border-slate-250 dark:border-slate-card-border hover:border-indigo-primary/30'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <span className={`text-xs font-bold block truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-250'}`}>
                          {t.task}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-350 font-bold block uppercase mt-0.5">{t.subject}</span>
                      </div>
                      <div className={t.completed ? 'text-indigo-primary' : 'text-slate-400'}>
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action suggestions */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">Suggested Actions</h3>
                <div className="space-y-3">
                  {suggestions.map((sug, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-2xl flex gap-3 text-xs leading-relaxed font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-primary shrink-0 mt-1.5" />
                      <span className="text-slate-655 dark:text-slate-350">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* AI helper box column */}
            <div className="space-y-6">
              
              {/* Quick Actions widget */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Workspace Modules</h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-black">
                  <button
                    onClick={() => setActiveScreen('companion-ai-notes')}
                    className="p-3 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-center hover:bg-indigo-primary/10 transition"
                  >
                    AI Notes
                  </button>
                  <button
                    onClick={() => setActiveScreen('companion-pyq')}
                    className="p-3 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-center hover:bg-indigo-primary/10 transition"
                  >
                    PYQ Analyzer
                  </button>
                  <button
                    onClick={() => setActiveScreen('companion-attendance-predict')}
                    className="p-3 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-center hover:bg-indigo-primary/10 transition"
                  >
                    Attendance
                  </button>
                  <button
                    onClick={() => setActiveScreen('planner-strategy')}
                    className="p-3 bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border rounded-xl text-center hover:bg-indigo-primary/10 transition"
                  >
                    Exam Planner
                  </button>
                </div>
              </div>

              {/* AI helper panel */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-indigo-primary" size={18} />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Active Study Assistant</h3>
                </div>

                <form onSubmit={handleAIQuery} className="relative">
                  <input
                    type="text"
                    placeholder="Ask study queries (e.g. explain normal forms)..."
                    value={helperQuery}
                    onChange={(e) => setHelperQuery(e.target.value)}
                    required
                    className="w-full pl-3 pr-10 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={helperLoading || !helperQuery.trim()}
                    className="absolute right-2.5 top-2 text-indigo-primary disabled:opacity-30"
                  >
                    <Send size={15} />
                  </button>
                </form>

                {helperLoading && (
                  <div className="text-center py-4 text-xs text-slate-400 font-bold">Consulting local study models...</div>
                )}

                {helperResponse && !helperLoading && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border text-[11px] leading-relaxed space-y-2 animate-fadeIn max-h-[180px] overflow-y-auto">
                    <div 
                      className="prose prose-sm dark:prose-invert space-y-1"
                      dangerouslySetInnerHTML={{ __html: helperResponse }}
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setHelperResponse('');
                          setHelperQuery('');
                        }}
                        className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-650"
                      >
                        Clear Query
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
