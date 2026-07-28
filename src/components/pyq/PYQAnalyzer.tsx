import React, { useState } from 'react';
import { useApp, PYQEntry } from '../../context/AppContext';
import { Plus, Search, Bookmark, Trash2, Download, Award, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { exportDocumentToPDF } from '../export/ExportSystem';

export const PYQAnalyzer: React.FC = () => {
  const { subjects, pyqEntries, addPYQQuestion, toggleBookmarkPYQ, deletePYQQuestion, logExportDocument } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState<string>('All'); // maps to module
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Modal drawer state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || '');
  const [newUnit, setNewUnit] = useState<number>(1);
  const [newYear, setNewYear] = useState<number>(2024);
  const [newText, setNewText] = useState('');
  const [newFrequency, setNewFrequency] = useState<number>(1);
  const [newTags, setNewTags] = useState<string[]>([]);

  // Available tag options
  const tagOptions = [
    'Very Important',
    'Important',
    'Repeated',
    'Numerical',
    'Theory',
    'Long Answer',
    'Short Answer'
  ];

  const handleAddTag = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(prev => prev.filter(t => t !== tag));
    } else {
      setNewTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newSubject) return;

    addPYQQuestion({
      subject: newSubject,
      unit: newUnit,
      year: newYear,
      questionText: newText.trim(),
      frequency: newFrequency,
      tags: newTags as any[]
    });

    setNewText('');
    setNewTags([]);
    setNewFrequency(1);
    setShowAddForm(false);
    alert('PYQ logged and analyzed successfully!');
  };

  // Filter PYQ entries
  const filteredEntries = pyqEntries.filter((q) => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesUnit = selectedUnit === 'All' || q.unit === Number(selectedUnit);
    const matchesYear = selectedYear === 'All' || q.year === Number(selectedYear);
    const matchesTag = selectedTag === 'All' || q.tags.includes(selectedTag as any);
    return matchesSearch && matchesSubject && matchesUnit && matchesYear && matchesTag;
  });

  // Calculate stats for charts
  const getSubjectList = () => {
    const list = new Set<string>();
    pyqEntries.forEach(q => list.add(q.subject));
    return Array.from(list);
  };

  // Module weightage data based on active subject or all
  const getUnitChartData = () => {
    const unitCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    pyqEntries
      .filter(q => selectedSubject === 'All' || q.subject === selectedSubject)
      .forEach(q => {
        if (q.unit >= 1 && q.unit <= 5) {
          unitCounts[q.unit as 1 | 2 | 3 | 4 | 5] += q.frequency;
        }
      });

    return Object.keys(unitCounts).map(u => ({
      name: `Module ${u}`,
      'Question Weight': unitCounts[Number(u) as 1 | 2 | 3 | 4 | 5]
    }));
  };

  // Find most repeated chapters
  const getSyllabusSummary = () => {
    const unitCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const subEntries = pyqEntries.filter(q => selectedSubject === 'All' || q.subject === selectedSubject);
    
    subEntries.forEach(q => {
      if (q.unit >= 1 && q.unit <= 5) {
        unitCounts[q.unit as 1 | 2 | 3 | 4 | 5] += q.frequency;
      }
    });

    const sortedUnits = Object.entries(unitCounts).sort((a, b) => b[1] - a[1]);
    const maxUnit = sortedUnits[0];

    return {
      total: subEntries.length,
      repeated: subEntries.filter(q => q.frequency > 1).length,
      importantUnit: maxUnit && maxUnit[1] > 0 ? maxUnit[0] : 'n/a',
      importantUnitWeight: maxUnit ? maxUnit[1] : 0
    };
  };

  const summary = getSyllabusSummary();

  const handleExportReport = () => {
    const itemsHtml = filteredEntries
      .map(
        (q, idx) => `
        <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #4f46e5; margin-bottom: 6px;">
            <span>Q${idx + 1}. Module ${q.unit} | Exam Year: ${q.year}</span>
            <span style="color: #f97316;">Repeated ${q.frequency}x</span>
          </div>
          <p style="margin: 0; font-size: 13px; color: #1e293b;">${q.questionText}</p>
          <div style="margin-top: 8px;">
            ${q.tags
              .map(
                (t) =>
                  `<span style="display: inline-block; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; color: #475569; margin-right: 4px; text-transform: uppercase;">${t}</span>`
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');

    const payload = {
      title: `PYQ Revision Report - ${selectedSubject === 'All' ? 'All Subjects' : selectedSubject}`,
      subtitle: `Filtered previous years exam questions tracker.`,
      metadata: [
        { label: 'Selected Subject', value: selectedSubject },
        { label: 'Module Scope', value: selectedUnit },
        { label: 'Questions Count', value: filteredEntries.length },
        { label: 'Important Module Focus', value: summary.importantUnit !== 'n/a' ? `Module ${summary.importantUnit}` : 'None' }
      ],
      htmlContent: `
        <h3>Question Breakdown</h3>
        ${filteredEntries.length > 0 ? itemsHtml : '<p>No questions selected under current filters.</p>'}
      `
    };

    exportDocumentToPDF(payload, logExportDocument, 'PYQ Analyzer');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Previous Year Question Bank</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition"
            >
              <Plus size={14} /> Log PYQ
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search question keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-705 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {getSubjectList().map((s) => (
                <option key={s} value={s}>
                  {s.slice(0, 20)}...
                </option>
              ))}
            </select>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-705 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Modules</option>
              {[1, 2, 3, 4, 5].map((u) => (
                <option key={u} value={u}>
                  Module {u}
                </option>
              ))}
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-750 dark:text-slate-300 focus:outline-none"
            >
              <option value="All">All Tags</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Question cards */}
        <div className="space-y-3">
          {filteredEntries.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-3 group hover:border-indigo-primary/30 transition duration-150"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[9px] font-black uppercase tracking-wider">
                      Module {q.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold">{q.year} Board Exam</span>
                    {q.frequency > 1 && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[9px] font-black">
                        Repeated {q.frequency}x
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 leading-relaxed">
                    {q.questionText}
                  </h4>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleBookmarkPYQ(q.id)}
                    className={`p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                      q.bookmarked ? 'text-indigo-primary' : 'text-slate-400 hover:text-indigo-primary'
                    }`}
                  >
                    <Bookmark size={15} fill={q.bookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => deletePYQQuestion(q.id)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Subject Tag */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2.5 border-t border-slate-200/40 dark:border-slate-card-border/40">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[200px]" title={q.subject}>
                  {q.subject}
                </span>

                <div className="flex flex-wrap gap-1">
                  {q.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-dark-bg text-slate-500 dark:text-slate-400 text-[8px] font-extrabold uppercase tracking-tight">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs font-bold bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-3xl">
              No questions matched the active filters.
            </div>
          )}
        </div>
      </div>

      {/* Analytics Column */}
      <div className="space-y-6">
        {/* Weightage Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Syllabus Insights</h3>
            <button
              onClick={handleExportReport}
              disabled={filteredEntries.length === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-card-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
              title="Export Report PDF"
            >
              <Download size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-orange-accent/10 text-orange-accent shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Exam Hotspot</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  {summary.importantUnit !== 'n/a'
                    ? `Module ${summary.importantUnit} is heavily repeated!`
                    : 'Log more questions to find hotspots.'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  It represents a total weight of {summary.importantUnitWeight} repeats.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-primary/10 text-indigo-primary shrink-0">
                <Award size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Chapter Weightage Summary</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-bold">
                  {summary.importantUnit !== 'n/a'
                    ? `Syllabus focus: Prioritize revisions in Module ${summary.importantUnit}. Numerical and Theory items are common in CIE sheets.`
                    : 'Select a subject and add past exam questions to build weight charts.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recharts Chart */}
        {pyqEntries.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">PYQ Weight by Module</h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getUnitChartData()}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                  />
                  <Bar dataKey="Question Weight" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Log PYQ Modal Drawer */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-3xl max-w-lg w-full p-6 space-y-4 animate-scaleIn text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-card-border pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Log Previous Year Question</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-450 hover:text-slate-800 dark:hover:text-white text-xs font-black"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Module (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newUnit}
                      onChange={(e) => setNewUnit(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Year</label>
                    <input
                      type="number"
                      min="2010"
                      max="2027"
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Question Text</label>
                <textarea
                  placeholder="Type the exam question details exactly..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Repeat Count (Frequency)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {tagOptions.map((tag) => {
                    const active = newTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition ${
                          active
                            ? 'bg-indigo-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-655 dark:text-slate-400 hover:bg-slate-205'
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PYQAnalyzer;
