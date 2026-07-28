import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, FileText, HelpCircle, AlertTriangle, Briefcase, Calendar, ArrowRight } from 'lucide-react';

interface GlobalSearchProps {
  onNavigate: (screen: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const { aiNotes, pyqEntries, subjects, attendance, examPlans, interviewExperiences } = useApp();
  const [query, setQuery] = useState('');

  // Perform search matches across modules
  const matchingNotes = aiNotes.filter(
    n => n.topic.toLowerCase().includes(query.toLowerCase()) || n.subject.toLowerCase().includes(query.toLowerCase())
  );

  const matchingPYQs = pyqEntries.filter(
    q => q.questionText.toLowerCase().includes(query.toLowerCase()) || q.subject.toLowerCase().includes(query.toLowerCase())
  );

  const matchingInterviews = interviewExperiences.filter(
    e => e.companyName.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase()) || e.questionsAsked.some(q => q.toLowerCase().includes(query.toLowerCase()))
  );

  const matchingExams = examPlans.filter(
    p => p.examName.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults =
    matchingNotes.length > 0 ||
    matchingPYQs.length > 0 ||
    matchingInterviews.length > 0 ||
    matchingExams.length > 0;

  const showResults = query.trim().length > 0;

  return (
    <div className="relative w-full space-y-2 z-30">
      <div className="relative">
        <Search className="absolute left-4 top-3 text-slate-400" size={16} />
        <input
          key="universal-search-input"
          type="text"
          placeholder="Universal Search... Search notes, PYQs, attendance, exam plans, companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-card-bg text-xs font-semibold text-slate-705 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-primary focus:border-indigo-primary dark:focus:border-indigo-primary/40 shadow-md shadow-indigo-600/5 focus:shadow-lg transition-all duration-200"
        />
        {showResults && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white font-extrabold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Floating Results panel */}
      {showResults && (
        <div className="absolute left-0 right-0 bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-2xl shadow-2xl max-h-[350px] overflow-y-auto p-4 space-y-4 animate-scaleIn text-left">
          {hasResults ? (
            <>
              {/* Notes results */}
              {matchingNotes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-indigo-primary tracking-wider block">AI Academic Notes ({matchingNotes.length})</span>
                  <div className="space-y-1">
                    {matchingNotes.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setQuery('');
                          onNavigate('companion-notes');
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg cursor-pointer flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate flex items-center gap-1.5"><FileText size={13} className="text-slate-400 shrink-0" /> {n.topic}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PYQ results */}
              {matchingPYQs.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-card-border/40">
                  <span className="text-[9px] font-black uppercase text-orange-accent tracking-wider block">Question Bank PYQs ({matchingPYQs.length})</span>
                  <div className="space-y-1">
                    {matchingPYQs.slice(0, 3).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          setQuery('');
                          onNavigate('companion-pyq');
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg cursor-pointer flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate flex items-center gap-1.5"><HelpCircle size={13} className="text-slate-400 shrink-0" /> {q.questionText}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement experiences */}
              {matchingInterviews.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-card-border/40">
                  <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider block">Placement Interviews ({matchingInterviews.length})</span>
                  <div className="space-y-1">
                    {matchingInterviews.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setQuery('');
                          onNavigate('placement-interview');
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg cursor-pointer flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate flex items-center gap-1.5"><Briefcase size={13} className="text-slate-400 shrink-0" /> {e.companyName} - {e.role}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam plans */}
              {matchingExams.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/40 dark:border-slate-card-border/40">
                  <span className="text-[9px] font-black uppercase text-indigo-secondary tracking-wider block">Exam Strategy Plans ({matchingExams.length})</span>
                  <div className="space-y-1">
                    {matchingExams.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setQuery('');
                          onNavigate('planner-tasks');
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg cursor-pointer flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        <span className="truncate flex items-center gap-1.5"><Calendar size={13} className="text-slate-400 shrink-0" /> {p.examName} ({p.schedule.length} Days)</span>
                        <ArrowRight size={12} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 font-bold">No matching entries found.</div>
          )}
        </div>
      )}
    </div>
  );
};
export default GlobalSearch;
