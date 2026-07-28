import React, { useState } from 'react';
import { useApp, PlacementInterviewExperience } from '../../context/AppContext';
import { Plus, Search, Bookmark, Trash2, Download, Briefcase, Award, Star } from 'lucide-react';
import { exportDocumentToPDF } from '../export/ExportSystem';

export const InterviewRepository: React.FC = () => {
  const { interviewExperiences, addInterviewExperience, toggleBookmarkInterview, deleteInterviewExperience, logExportDocument } = useApp();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [interviewDate, setInterviewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [roundCount, setRoundCount] = useState<number>(3);
  const [questionInput, setQuestionInput] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [outcome, setOutcome] = useState<'Selected' | 'Rejected' | 'Pending' | 'Ongoing'>('Selected');
  const [tips, setTips] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['DSA', 'Technical Round']);

  const tagOptions = [
    'Aptitude',
    'DSA',
    'HR',
    'Project',
    'Core CS',
    'Coding Round',
    'Technical Round'
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !questionInput.trim()) return;

    // Parse questions
    const questions = questionInput
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    addInterviewExperience({
      companyName: companyName.trim(),
      role: role.trim(),
      interviewDate,
      roundCount,
      questionsAsked: questions,
      difficulty,
      outcome,
      tips: tips.trim(),
      tags: selectedTags as any[]
    });

    // Reset Form
    setCompanyName('');
    setQuestionInput('');
    setTips('');
    setSelectedTags(['DSA', 'Technical Round']);
    setShowAddForm(false);
    alert('Interview experience saved to placements repository!');
  };

  // Get unique companies list
  const getCompaniesList = () => {
    const list = new Set<string>();
    interviewExperiences.forEach(e => list.add(e.companyName));
    return Array.from(list);
  };

  // Filter entries
  const filteredEntries = interviewExperiences.filter((e) => {
    const matchesSearch =
      e.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.questionsAsked.some((q) => q.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompany = selectedCompany === 'All' || e.companyName === selectedCompany;
    const matchesDifficulty = selectedDifficulty === 'All' || e.difficulty === selectedDifficulty;
    const matchesBookmark = !bookmarksOnly || e.bookmarked;

    return matchesSearch && matchesCompany && matchesDifficulty && matchesBookmark;
  });

  // Extract commonly asked questions
  const getCommonQuestions = () => {
    const allQs: string[] = [];
    filteredEntries.forEach(e => allQs.push(...e.questionsAsked));
    return allQs.slice(0, 5); // Return a seed selection
  };

  const handleExportPDF = (exp: PlacementInterviewExperience) => {
    const questionsHtml = exp.questionsAsked
      .map((q) => `<li style="margin-bottom: 6px;">${q}</li>`)
      .join('');

    const payload = {
      title: `Interview Review - ${exp.companyName}`,
      subtitle: `${exp.role} | Date: ${exp.interviewDate}`,
      metadata: [
        { label: 'Company', value: exp.companyName },
        { label: 'Role Profile', value: exp.role },
        { label: 'Difficulty Level', value: exp.difficulty },
        { label: 'Outcome Status', value: exp.outcome }
      ],
      htmlContent: `
        <h3>Rounds Structure</h3>
        <p>Total Interview Rounds: <strong>${exp.roundCount} Rounds</strong></p>

        <h3>Questions Asked during Interview</h3>
        <ul>
          ${questionsHtml}
        </ul>

        <h3>Preparation Tips & Advice</h3>
        <p style="background: #f8fafc; border-left: 4px solid #f97316; padding: 12px; border-radius: 8px; font-style: italic;">
          "${exp.tips || 'No tips provided.'}"
        </p>

        <h3>Categorization Tags</h3>
        <div style="margin-top: 10px;">
          ${exp.tags
            .map(
              (t) =>
                `<span style="display: inline-block; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #475569; margin-right: 4px;">${t}</span>`
            )
            .join('')}
        </div>
      `
    };

    exportDocumentToPDF(payload, logExportDocument, 'Placement Interview Repository');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Search and Grid list */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search header controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">Interview Experience Archive</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition"
            >
              <Plus size={14} /> Log Experience
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search company, role, question keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-755 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Companies</option>
              {getCompaniesList().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-755 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-[10px] text-slate-500 font-extrabold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={bookmarksOnly}
              onChange={(e) => setBookmarksOnly(e.target.checked)}
              className="rounded text-indigo-primary focus:ring-0"
            />
            <span>Show Bookmarked Experiences Only</span>
          </label>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((e) => (
            <div
              key={e.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between gap-4 group hover:border-indigo-primary/30 transition duration-150 text-left"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-805 dark:text-white group-hover:text-indigo-primary transition">
                      {e.companyName}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">{e.role}</span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleBookmarkInterview(e.id)}
                      className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        e.bookmarked ? 'text-indigo-primary' : 'text-slate-400'
                      }`}
                    >
                      <Bookmark size={14} fill={e.bookmarked ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => deleteInterviewExperience(e.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    e.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : e.difficulty === 'Medium'
                      ? 'bg-orange-accent/10 text-orange-accent'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {e.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[8px] font-black uppercase">
                    {e.outcome}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-dark-bg text-slate-400 text-[8px] font-bold">
                    {e.roundCount} Rounds
                  </span>
                </div>

                {/* Question Summary */}
                <div className="space-y-1 pt-1.5 border-t border-slate-200/40 dark:border-slate-card-border/40 text-[11px] leading-relaxed">
                  <strong className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Sample Questions</strong>
                  <ul className="list-disc pl-4 text-slate-600 dark:text-slate-350 space-y-0.5">
                    {e.questionsAsked.slice(0, 2).map((q, idx) => (
                      <li key={idx} className="truncate">{q}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-slate-450 font-bold">{e.interviewDate}</span>
                <button
                  onClick={() => handleExportPDF(e)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-[9px] font-black text-slate-650 dark:text-slate-400 flex items-center gap-1 transition"
                >
                  <Download size={11} /> Print Report
                </button>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs font-bold bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-3xl md:col-span-2">
              No interview experiences tracked yet.
            </div>
          )}
        </div>
      </div>

      {/* Placement Insights Sidebar */}
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 text-left">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Placement Repository Insights</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-orange-accent/10 text-orange-accent shrink-0">
                <Briefcase size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Companies Tracked</span>
                <span className="text-xl font-black text-slate-800 dark:text-white block">
                  {getCompaniesList().length} Companies
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Keep logging interviews to expand placement intelligence.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-primary/10 text-indigo-primary shrink-0">
                <Award size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Most Asked Questions</span>
                
                <ul className="list-disc pl-4 text-[10px] text-slate-500 dark:text-slate-400 space-y-1 mt-1 font-bold">
                  {getCommonQuestions().map((q, idx) => (
                    <li key={idx} className="truncate max-w-[200px]" title={q}>{q}</li>
                  ))}
                  {getCommonQuestions().length === 0 && (
                    <li>No interview questions registered yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Interview Experience Modal Drawer */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-3xl max-w-lg w-full p-6 space-y-4 animate-scaleIn text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-card-border pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Log Placement Experience</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-450 hover:text-slate-800 dark:hover:text-white text-xs font-black"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Microsoft, TCS..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Role Profile</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Intern, ASE..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-355 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-705 dark:text-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Rounds Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={roundCount}
                    onChange={(e) => setRoundCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-705 dark:text-slate-350 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-705 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-extrabold text-slate-600 dark:text-slate-400">Interview Outcome</label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-705 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Questions Asked (One per line)</label>
                <textarea
                  required
                  placeholder="e.g. Reverse a linked list&#10;What are ACID properties?"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Preparation Tips & Key Takeaways</label>
                <textarea
                  placeholder="e.g. Practice graph algorithms, revise DBMS normalizations..."
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-extrabold text-slate-600 dark:text-slate-400">Topic Categorization Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                          active
                            ? 'bg-indigo-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-655 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-card-border">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-card-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl shadow"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterviewRepository;
