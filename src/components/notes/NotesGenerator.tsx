import React, { useState } from 'react';
import { useApp, AINotesEntry } from '../../context/AppContext';
import { Sparkles, Copy, Download, Trash2, Heart, Search, FileText, Check } from 'lucide-react';
import { exportDocumentToPDF } from '../export/ExportSystem';

export const NotesGenerator: React.FC = () => {
  const { subjects, aiNotes, saveAINote, toggleFavoriteNote, deleteAINote, logExportDocument } = useApp();

  // Generator states
  const [subject, setSubject] = useState(subjects[0]?.name || '');
  const [unit, setUnit] = useState<number>(1);
  const [topic, setTopic] = useState('');
  const [notesType, setNotesType] = useState<'short' | 'exam' | 'questions' | 'revision' | 'formula'>('short');
  const [generating, setGenerating] = useState(false);
  const [activeNote, setActiveNote] = useState<Omit<AINotesEntry, 'id' | 'createdAt' | 'favorite'> | null>(null);

  // Library/saved notes states
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generate Fallback Academic Content
  const generateAcademicNotes = (sub: string, ut: number, top: string, type: string) => {
    const cleanTopic = top.trim() || 'Core Principles';
    const subClean = sub.toLowerCase();
    
    // Structured content generation matching notes type
    let html = '';
    
    if (type === 'short') {
      html = `
        <h2>Summary Guide: ${cleanTopic}</h2>
        <p>This study module covers the fundamental concepts of <strong>${cleanTopic}</strong> in module ${ut} of <strong>${sub}</strong>.</p>
        
        <h3>1. Primary Overview</h3>
        <p>Understanding this topic requires identifying the core components, their relations, and execution models. These elements establish the base bounds for academic analysis.</p>
        
        <h3>2. Essential Takeaways</h3>
        <ul>
          <li><strong>Fundamental Rule:</strong> Core functions must preserve structural integrity across all operation states.</li>
          <li><strong>Optimal Performance Bounds:</strong> Minimizing time latency and data overheads.</li>
          <li><strong>Standard Validation:</strong> Compliance with logical constraints and design specifications.</li>
        </ul>

        <h3>3. Illustrative Diagram Overview</h3>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 4px solid #4f46e5; font-family: monospace; font-size: 11px;">
[Input Parameters] ---> [Execution / Processing Pipeline] ---> [Result Validation]
                             | (Constraints check)
                             v
                       [Error State / Recovery]
        </pre>
      `;
    } else if (type === 'exam') {
      html = `
        <h2>Comprehensive Exam Preparation: ${cleanTopic}</h2>
        <p><strong>Subject:</strong> ${sub} | <strong>Module:</strong> ${ut}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
        
        <h3>1. Deep-Dive Definitions</h3>
        <p>In standard academic evaluations, <em>${cleanTopic}</em> represents a key pillar. Its theoretical layout is supported by relational modeling, functional dependencies, and architectural limits.</p>
        
        <h3>2. Core Sub-Topics & Concepts</h3>
        <p><strong>A. Architecture & Constraints:</strong> Defines constraints that govern operational states. These include domain constraints, entity integrity, and structural rules.</p>
        <p><strong>B. Operational Complexity:</strong> Evaluating how inputs scale. Ensure proper complexity boundaries (typically O(N) or O(log N) operations).</p>
        
        <h3>3. Detailed Step-by-Step Implementation</h3>
        <ol>
          <li>Initialize the variables and declare bounds.</li>
          <li>Execute relational mapping and functional assertions.</li>
          <li>Validate the outputs against expected database schema guidelines.</li>
          <li>Handle exceptional cases (null checks, boundary conditions).</li>
        </ol>
      `;
    } else if (type === 'questions') {
      html = `
        <h2>Important Examination Questions: ${cleanTopic}</h2>
        
        <div style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
          <p><strong>Q1. Explain the fundamental design principles of ${cleanTopic} in the context of ${sub}. [8 Marks]</strong></p>
          <p><em>Answer Outline:</em> Start with the definition of ${cleanTopic}. Detail the 3 main sub-components. Draw the block diagram outlining input processing, and summarize performance trade-offs under constraints.</p>
        </div>

        <div style="margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc;">
          <p><strong>Q2. Differentiate between static constraints and dynamic validations in ${cleanTopic}. [6 Marks]</strong></p>
          <p><em>Answer Outline:</em> Static constraints represent rules defined in schema configurations (e.g. key constraints). Dynamic validations represent checks evaluated during execution flow (e.g. data range triggers).</p>
        </div>
      `;
    } else if (type === 'revision') {
      html = `
        <h2>Quick Revision Checklist: ${cleanTopic}</h2>
        <p>Review these critical keywords and formulas immediately before entering the exam hall.</p>
        
        <h3>1. High-Priority Keywords</h3>
        <ul>
          <li><strong>ACID / Integrity Bounds:</strong> Essential conditions ensuring consistent database data operations.</li>
          <li><strong>Structural Invariance:</strong> Property showing that properties remain constant under state shifts.</li>
          <li><strong>Concurrency Rules:</strong> Techniques regulating parallel operations securely.</li>
        </ul>

        <h3>2. Key Mistakes to Avoid</h3>
        <ul>
          <li>Forgetting boundary value checks.</li>
          <li>Neglecting constraint validation schemas.</li>
          <li>Miscalculating operational complexity.</li>
        </ul>
      `;
    } else {
      // Formula sheet
      html = `
        <h2>Formula & Notation Sheet: ${cleanTopic}</h2>
        <p>Important mathematical equations and complexity bounds for ${sub}.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 10px; border: 1px solid #e2e8f0;">Component</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0;">Mathematical Formula / Expression</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0;">Time Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Worst Case Bounds</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;">T(n) = aT(n/b) + f(n)</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #ef4444; font-weight: bold;">O(n log n)</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Space Complexity</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-family: monospace;">S(n) = O(V + E)</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #10b981; font-weight: bold;">O(N)</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    return html;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);

    setTimeout(() => {
      const generatedHtml = generateAcademicNotes(subject, unit, topic, notesType);
      
      const newNote: Omit<AINotesEntry, 'id' | 'createdAt' | 'favorite'> = {
        subject,
        unit,
        topic: topic.trim(),
        notesType,
        content: generatedHtml
      };
      
      setActiveNote(newNote);
      setGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    if (!activeNote) return;
    saveAINote(activeNote);
    setActiveNote(null);
    setTopic('');
    alert('Academic note saved successfully to your Local Library!');
  };

  const handleCopy = (id: string, text: string) => {
    // Strip HTML tags for clean copy
    const div = document.createElement('div');
    div.innerHTML = text;
    const cleanText = div.textContent || div.innerText || '';
    
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = (note: AINotesEntry | Omit<AINotesEntry, 'id' | 'createdAt' | 'favorite'>) => {
    const payload = {
      title: `${note.notesType.toUpperCase()} Notes - ${note.topic}`,
      subtitle: `${note.subject} | Module ${note.unit}`,
      metadata: [
        { label: 'Subject', value: note.subject },
        { label: 'Syllabus Module', value: `Module ${note.unit}` },
        { label: 'Export Date', value: new Date().toLocaleDateString() }
      ],
      htmlContent: note.content
    };

    exportDocumentToPDF(payload, logExportDocument, 'AI Notes Generator');
  };

  // Filter notes library
  const filteredNotes = aiNotes.filter((n) => {
    const matchesSearch =
      n.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = !favoritesOnly || n.favorite;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input panel & active generator */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-primary" size={20} />
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">AI Academic Notes Generator</h3>
          </div>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Course Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Syllabus Module</label>
              <select
                value={unit}
                onChange={(e) => setUnit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((u) => (
                  <option key={u} value={u}>
                    Module {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Topic Name</label>
              <input
                type="text"
                placeholder="e.g. ACID Properties, Dijkstra Shortest Path, Normalization..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Notes Layout Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'short', name: 'Short Notes' },
                  { id: 'exam', name: 'Exam Prep' },
                  { id: 'questions', name: 'Imp Qs & Ans' },
                  { id: 'revision', name: 'Revision Sheet' },
                  { id: 'formula', name: 'Formula Sheet' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNotesType(t.id as any)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-black transition ${
                      notesType === t.id
                        ? 'bg-indigo-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                disabled={generating || !topic.trim()}
                className="px-6 py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles size={14} /> {generating ? 'Compiling Notes...' : 'Generate Academic Notes'}
              </button>
            </div>
          </form>
        </div>

        {/* Generated Note View */}
        {activeNote && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-card-border">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">Generated Notes: {activeNote.topic}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeNote.subject} | Module {activeNote.unit} | {activeNote.notesType}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy('active', activeNote.content)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
                  title="Copy to clipboard"
                >
                  {copiedId === 'active' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => handleExport(activeNote)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
                  title="Export to PDF"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 p-4 bg-slate-50/50 dark:bg-slate-dark-bg/60 border border-slate-200/50 dark:border-slate-card-border/50 rounded-2xl overflow-y-auto max-h-[300px]"
              dangerouslySetInnerHTML={{ __html: activeNote.content }}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveNote(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-card-border rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl shadow transition"
              >
                Save to Library
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Library of saved notes */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 h-fit">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Saved Library</h3>
          <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[10px] font-black">{filteredNotes.length} notes</span>
        </div>

        {/* Search bar & filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search topic or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-[10px] text-slate-500 font-extrabold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              className="rounded text-indigo-primary focus:ring-0"
            />
            <span>Show Favorites Only</span>
          </label>
        </div>

        {/* List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {filteredNotes.map((n) => (
            <div
              key={n.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between gap-3 group hover:border-indigo-primary/30 transition duration-150"
            >
              <div className="overflow-hidden">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-black text-slate-805 dark:text-slate-200 block truncate group-hover:text-indigo-primary transition">
                    {n.topic}
                  </span>
                  
                  <button
                    onClick={() => toggleFavoriteNote(n.id)}
                    className={`p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 shrink-0 transition ${
                      n.favorite ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart size={13} fill={n.favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-505 font-bold uppercase tracking-wider block mt-0.5">{n.subject} | Module {n.unit} | {n.notesType}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/40 dark:border-slate-card-border/40">
                <span className="text-[9px] text-slate-400 font-medium">{new Date(n.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(n.id, n.content)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    title="Copy Text"
                  >
                    {copiedId === n.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handleExport(n)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    title="Print PDF"
                  >
                    <Download size={12} />
                  </button>
                  <button
                    onClick={() => deleteAINote(n.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500"
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
              No saved notes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotesGenerator;
