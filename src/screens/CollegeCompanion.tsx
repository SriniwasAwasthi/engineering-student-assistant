import React, { useState, useEffect } from 'react';
import { useApp, TimetableClass, CollegeNote, Assignment, SupportTicket, Subject, AcademicNotice, CollegeEvent } from '../context/AppContext';
import {
  Clock,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  Bell,
  FileText,
  LifeBuoy,
  Link,
  Plus,
  Check,
  Circle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { NotesGenerator } from '../components/notes/NotesGenerator';
import { PYQAnalyzer } from '../components/pyq/PYQAnalyzer';
import { AttendancePredictor } from '../components/attendance/AttendancePredictor';

interface CollegeCompanionProps {
  activeTab?: 'schedule' | 'attendance-predict' | 'assignments' | 'curriculum' | 'notices' | 'notes' | 'ai-notes' | 'pyq' | 'subjects' | 'resources';
  setActiveTab?: (tab: 'schedule' | 'attendance-predict' | 'assignments' | 'curriculum' | 'notices' | 'notes' | 'ai-notes' | 'pyq' | 'subjects' | 'resources') => void;
}


export const CollegeCompanion: React.FC<CollegeCompanionProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}) => {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    timetable,
    attendance,
    logAttendance,
    assignments,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
    internalMarks,
    updateInternalMarks,
    notes,
    addNote,
    updateNote,
    deleteNote,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    events,
    academicResources,
    addAcademicResource,
    deleteAcademicResource
  } = useApp();

  const [localActiveTab, setLocalActiveTab] = useState<'schedule' | 'attendance-predict' | 'assignments' | 'curriculum' | 'notices' | 'notes' | 'ai-notes' | 'pyq' | 'subjects' | 'resources'>('schedule');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setLocalActiveTab;

  // Timetable day selection
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Assignment states
  const [assignSubject, setAssignSubject] = useState('');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');

  // Notes states
  const [noteSubject, setNoteSubject] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [selectedNotesFolder, setSelectedNotesFolder] = useState('All');

  // GPA Calculator States
  const [cgpaSemesters, setCgpaSemesters] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('esa_cgpa_semesters');
      return stored ? JSON.parse(stored) : ['', '', '', '', '', '', '', ''];
    } catch (e) {
      return ['', '', '', '', '', '', '', ''];
    }
  });

  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>({});

  // Subjects CRUD states
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCredits, setSubCredits] = useState(3);
  const [subGoalGrade, setSubGoalGrade] = useState('A');
  const [subCieMarks, setSubCieMarks] = useState(50);
  const [subSeeMarks, setSubSeeMarks] = useState(50);
  const [subTotalMarks, setSubTotalMarks] = useState(100);

  // Notice Composer states
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContentState, setNoticeContentState] = useState('');
  const [noticeTag, setNoticeTag] = useState<'Exam' | 'Placement' | 'General' | 'Event'>('General');
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  // Resource Vault states
  const [resName, setResName] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resSubject, setResSubject] = useState('');
  const [resIsPdf, setResIsPdf] = useState(false);
  const [resPdfFile, setResPdfFile] = useState<File | null>(null);
  const [resPdfBase64, setResPdfBase64] = useState('');
  const [resUploadError, setResUploadError] = useState('');
  const [filterResSubject, setFilterResSubject] = useState('All');

  useEffect(() => {
    localStorage.setItem('esa_cgpa_semesters', JSON.stringify(cgpaSemesters));
  }, [cgpaSemesters]);

  useEffect(() => {
    if (subjects.length > 0) {
      if (!assignSubject) setAssignSubject(subjects[0].name);
      if (!noteSubject) setNoteSubject(subjects[0].name);
      if (!resSubject) setResSubject(subjects[0].name);
    }
  }, [subjects]);

  useEffect(() => {
    setSubTotalMarks(subCieMarks + subSeeMarks);
  }, [subCieMarks, subSeeMarks]);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignSubject) return;
    addAssignment({
      subject: assignSubject,
      title: assignTitle.trim(),
      dueDate: assignDueDate || new Date().toISOString().split('T')[0]
    });
    setAssignTitle('');
    setAssignDueDate('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim() || !noteSubject) return;
    
    if (editingNoteId) {
      updateNote(editingNoteId, noteTitle.trim(), noteContent.trim());
      setEditingNoteId(null);
    } else {
      addNote({
        subject: noteSubject,
        title: noteTitle.trim(),
        content: noteContent.trim()
      });
    }
    setNoteTitle('');
    setNoteContent('');
  };

  const handleEditNoteClick = (note: CollegeNote) => {
    setEditingNoteId(note.id);
    setNoteSubject(note.subject);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  // Subjects CRUD handlers
  const handleEditSubjectClick = (sub: Subject) => {
    setEditingSubjectId(sub.id);
    setSubCode(sub.code);
    setSubName(sub.name);
    setSubCredits(sub.credits);
    setSubGoalGrade(sub.goalGrade);
    setSubCieMarks(sub.cieMarks ?? 50);
    setSubSeeMarks(sub.seeMarks ?? 50);
    setSubTotalMarks(sub.totalMarks ?? 100);
  };

  const handleCancelSubjectEdit = () => {
    setEditingSubjectId(null);
    setSubCode('');
    setSubName('');
    setSubCredits(3);
    setSubGoalGrade('A');
    setSubCieMarks(50);
    setSubSeeMarks(50);
    setSubTotalMarks(100);
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCode.trim() || !subName.trim()) return;

    if (editingSubjectId) {
      const existing = subjects.find(s => s.id === editingSubjectId);
      updateSubject({
        id: editingSubjectId,
        code: subCode.trim(),
        name: subName.trim(),
        credits: subCredits,
        goalGrade: subGoalGrade,
        cieMarks: subCieMarks,
        seeMarks: subSeeMarks,
        totalMarks: subTotalMarks,
        unitsCompleted: existing ? existing.unitsCompleted : 0,
        totalUnits: existing ? existing.totalUnits : 5,
      });
      setEditingSubjectId(null);
    } else {
      addSubject({
        code: subCode.trim(),
        name: subName.trim(),
        credits: subCredits,
        goalGrade: subGoalGrade,
        cieMarks: subCieMarks,
        seeMarks: subSeeMarks,
        totalMarks: subTotalMarks,
        totalUnits: 5,
      });
    }

    setSubCode('');
    setSubName('');
    setSubCredits(3);
    setSubGoalGrade('A');
    setSubCieMarks(50);
    setSubSeeMarks(50);
    setSubTotalMarks(100);
  };

  // Notice board CRUD handlers
  const handleEditNoticeClick = (notice: AcademicNotice) => {
    setEditingNoticeId(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContentState(notice.content);
    setNoticeTag(notice.tag);
  };

  const handleCancelNoticeEdit = () => {
    setEditingNoticeId(null);
    setNoticeTitle('');
    setNoticeContentState('');
    setNoticeTag('General');
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContentState.trim()) return;

    if (editingNoticeId) {
      updateNotice({
        id: editingNoticeId,
        title: noticeTitle.trim(),
        content: noticeContentState.trim(),
        tag: noticeTag,
        date: new Date().toISOString().split('T')[0]
      });
      setEditingNoticeId(null);
    } else {
      addNotice({
        title: noticeTitle.trim(),
        content: noticeContentState.trim(),
        tag: noticeTag
      });
    }

    setNoticeTitle('');
    setNoticeContentState('');
    setNoticeTag('General');
  };

  // Resources Vault PDF upload & URL handlers
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setResUploadError('Only PDF files are supported.');
      setResPdfFile(null);
      setResPdfBase64('');
      return;
    }

    // Limit to 1.5MB
    if (file.size > 1.5 * 1024 * 1024) {
      setResUploadError('File is too large! Maximum PDF size is 1.5MB to preserve offline quota.');
      setResPdfFile(null);
      setResPdfBase64('');
      return;
    }

    setResPdfFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResPdfBase64(reader.result);
      }
    };
    reader.onerror = () => {
      setResUploadError('Error reading PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resSubject) return;

    if (resIsPdf) {
      if (!resPdfBase64) {
        setResUploadError('Please select a valid PDF file under 1.5MB.');
        return;
      }
      addAcademicResource({
        name: resName.trim(),
        desc: resDesc.trim(),
        url: resPdfBase64,
        isPdf: true,
        fileName: resPdfFile?.name || 'document.pdf',
        subject: resSubject
      });
    } else {
      if (!resUrl.trim()) {
        setResUploadError('Please enter a valid website URL.');
        return;
      }
      addAcademicResource({
        name: resName.trim(),
        desc: resDesc.trim(),
        url: resUrl.trim(),
        isPdf: false,
        subject: resSubject
      });
    }

    setResName('');
    setResDesc('');
    setResUrl('');
    setResSubject(subjects[0]?.name || '');
    setResIsPdf(false);
    setResPdfFile(null);
    setResPdfBase64('');
    setResUploadError('');
  };

  // SGPA grade points lookup table
  const gradePointsMap: Record<string, number> = {
    'S': 10,
    'A+': 9,
    'A': 8,
    'B': 7,
    'C': 6,
    'D': 5,
    'E': 4,
    'F': 0
  };

  // Calculate SGPA dynamically from grade inputs
  const calculateSgpa = () => {
    let totalCredits = 0;
    let weightedPoints = 0;

    subjects.forEach((sub) => {
      const grade = subjectGrades[sub.id];
      if (grade && grade !== 'PP') {
        const points = gradePointsMap[grade] ?? 0;
        weightedPoints += sub.credits * points;
        totalCredits += sub.credits;
      }
    });

    return totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
  };

  // Calculate Cumulative CGPA
  const calculateCgpa = () => {
    const validSgpas = cgpaSemesters
      .map(s => parseFloat(s))
      .filter(num => !isNaN(num) && num > 0);
    
    if (validSgpas.length === 0) return '0.00';
    const sum = validSgpas.reduce((acc, val) => acc + val, 0);
    return (sum / validSgpas.length).toFixed(2);
  };

  const handleCgpaSemChange = (index: number, val: string) => {
    const updated = [...cgpaSemesters];
    updated[index] = val;
    setCgpaSemesters(updated);
  };

  const handleSyncSgpaToSemester = (semIndex: number) => {
    const sgpa = calculateSgpa();
    if (sgpa === '0.00') {
      alert("Calculated SGPA is 0.00. Please select expected grades for your subjects first before syncing.");
      return;
    }
    if (confirm(`Do you want to sync the calculated SGPA of ${sgpa} to Semester ${semIndex + 1}?`)) {
      handleCgpaSemChange(semIndex, sgpa);
    }
  };

  // Helper to calculate individual attendance %
  const getAttendanceStats = (subjectId: string) => {
    const record = attendance[subjectId] || { present: 0, absent: 0 };
    const total = record.present + record.absent;
    const percentage = total > 0 ? Math.round((record.present / total) * 100) : 100; // default to 100 if no classes
    return { record, total, percentage };
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">College Companion</h1>
          <p className="text-xs text-slate-505 dark:text-slate-400 font-bold">Manage class timetables, attendance registers, internal marks, and academic requests.</p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-200/50 dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border p-1 rounded-2xl gap-1.5 overflow-x-auto shrink-0 select-none">
          {['subjects', 'schedule', 'attendance-predict', 'assignments', 'curriculum', 'notices', 'notes', 'ai-notes', 'pyq', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-primary text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'schedule'
                ? 'Timetable'
                : tab === 'attendance-predict'
                ? 'Attendance Predictor'
                : tab === 'notices'
                ? 'Notice Board'
                : tab === 'curriculum'
                ? 'Curriculum & CGPA'
                : tab === 'notes'
                ? 'Manual Notes'
                : tab === 'ai-notes'
                ? 'AI Notes'
                : tab === 'pyq'
                ? 'PYQ Analyzer'
                : tab === 'subjects'
                ? 'Subjects'
                : tab === 'resources'
                ? 'Study Resources'
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Panels */}

      {/* SCHEDULE & ATTENDANCE */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Attendance list */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Attendance Register</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const { record, total, percentage } = getAttendanceStats(sub.id);
                const isBelow = percentage < 75;

                return (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <span className="text-xs font-black text-slate-800 dark:text-white block truncate">{sub.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold block">{sub.code}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                        isBelow ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {percentage}%
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                      <span>Attended: {record.present} / {total}</span>
                      {isBelow && (
                        <span className="text-rose-500 text-[10px] font-black flex items-center gap-0.5">
                          <AlertTriangle size={12} /> Low!
                        </span>
                      )}
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-card-border overflow-hidden">
                      <div className={`h-full ${isBelow ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }} />
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => logAttendance(sub.id, 'present')}
                        className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-border text-[10px] font-black hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300 transition duration-150"
                      >
                        + Present
                      </button>
                      <button
                        onClick={() => logAttendance(sub.id, 'absent')}
                        className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-border text-[10px] font-black hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 transition duration-150"
                      >
                        + Absent
                      </button>
                      <button
                        onClick={() => logAttendance(sub.id, 'reset')}
                        className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-border text-[10px] text-slate-400 hover:text-rose-500"
                        title="Reset attendance"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Schedule timetable */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Timetable</h3>
              
              {/* Day filter chips */}
              <div className="flex flex-wrap gap-1.5">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-black transition duration-150 ${
                      selectedDay === day
                        ? 'bg-indigo-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Class list */}
              <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1 pt-1">
                {timetable
                  .find((t) => t.day === selectedDay)
                  ?.classes.map((cls) => {
                    const matchedSubject = subjects.find(s => s.name.toLowerCase() === cls.subject.toLowerCase() || s.code.toLowerCase() === cls.subject.toLowerCase());
                    return (
                      <div key={cls.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-indigo-primary/10 text-indigo-primary shrink-0">
                            <Clock size={16} />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{cls.subject}</h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">{cls.time}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-card-border text-slate-500 font-black inline-block mt-1">{cls.room}</span>
                          </div>
                        </div>

                        {matchedSubject && (
                          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-card-border/40 space-y-2">
                            {(() => {
                              const { record, total, percentage } = getAttendanceStats(matchedSubject.id);
                              const isBelow = percentage < 75;
                              return (
                                <>
                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-slate-500 dark:text-slate-400">Attendance: {record.present}/{total} ({percentage}%)</span>
                                    {isBelow ? (
                                      <span className="text-rose-500 font-black">Low!</span>
                                    ) : (
                                      <span className="text-emerald-500 font-black">On Track</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => logAttendance(matchedSubject.id, 'present')}
                                      className="flex-1 py-1 rounded-lg border border-slate-200 dark:border-slate-card-border text-[9px] font-black hover:bg-emerald-500/10 hover:text-emerald-500 dark:hover:text-emerald-400 text-slate-605 dark:text-slate-300 transition duration-150"
                                    >
                                      + Present
                                    </button>
                                    <button
                                      onClick={() => logAttendance(matchedSubject.id, 'absent')}
                                      className="flex-1 py-1 rounded-lg border border-slate-200 dark:border-slate-card-border text-[9px] font-black hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 text-slate-650 dark:text-slate-300 transition duration-150"
                                    >
                                      + Absent
                                    </button>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {(!timetable.find((t) => t.day === selectedDay) ||
                  timetable.find((t) => t.day === selectedDay)?.classes.length === 0) && (
                  <div className="text-xs text-slate-400 py-12 text-center font-bold">No lectures scheduled. Enjoy your day!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENTS & MARKS */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Assignments list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Add Assignment form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4">Add Assignment</h3>
              <form onSubmit={handleAddAssignment} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Subject</label>
                  <select
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab compilation report..."
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1 flex-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={assignDueDate}
                      onChange={(e) => setAssignDueDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-indigo-primary text-white font-extrabold text-xs hover:bg-indigo-secondary transition duration-200"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            {/* Assignments checklist */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Assignment Tracker</h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition duration-200 ${
                      a.completed
                        ? 'bg-slate-100/30 dark:bg-slate-dark-bg/30 border-slate-100 dark:border-slate-card-border/30 opacity-70'
                        : 'bg-slate-50 dark:bg-slate-dark-bg border-slate-200 dark:border-slate-card-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => toggleAssignment(a.id)}
                        className={`transition duration-150 ${
                          a.completed ? 'text-indigo-primary' : 'text-slate-404 hover:text-slate-600'
                        }`}
                      >
                        {a.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                      </button>
                      <div className="overflow-hidden">
                        <span className={`text-xs font-bold block truncate ${a.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {a.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{a.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550">Due: {a.dueDate}</span>
                      <button
                        onClick={() => deleteAssignment(a.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                {assignments.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                    No assignments added yet.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Internal marks tracker */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Internal Marks Tracker</h3>
            
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {subjects.map((sub) => {
                const marks = internalMarks[sub.id] || { internal1: '', internal2: '', assignments: '', maxMarks: '20' };

                const handleChange = (key: keyof typeof marks, value: string) => {
                  updateInternalMarks(sub.id, {
                    ...marks,
                    [key]: value
                  });
                };

                return (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border space-y-3">
                    <div className="overflow-hidden">
                      <span className="text-xs font-black text-slate-800 dark:text-white block truncate">{sub.name}</span>
                      <span className="text-[9px] text-slate-400 font-bold block">{sub.code}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">CIE-1</label>
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="n/a"
                          value={marks.internal1}
                          onChange={(e) => handleChange('internal1', e.target.value)}
                          className="w-full text-center px-1 py-1.5 border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-dark-bg rounded-lg text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">CIE-2</label>
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="n/a"
                          value={marks.internal2}
                          onChange={(e) => handleChange('internal2', e.target.value)}
                          className="w-full text-center px-1 py-1.5 border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-dark-bg rounded-lg text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assign.</label>
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="n/a"
                          value={marks.assignments}
                          onChange={(e) => handleChange('assignments', e.target.value)}
                          className="w-full text-center px-1 py-1.5 border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-dark-bg rounded-lg text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CURRICULUM SYLLABUS SCHEME & CGPA CALCULATOR */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Curriculum Scheme & Evaluation</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-bold">Approved syllabus, course codes, and credits distribution details.</p>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-indigo-primary/10 border border-indigo-primary/20 text-xs font-black text-indigo-primary dark:text-indigo-secondary inline-block w-fit">
                Total Credits: {subjects.reduce((sum, sub) => sum + sub.credits, 0)}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-card-border rounded-2xl bg-slate-50/20 dark:bg-slate-dark-bg/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-dark-bg/60 border-b border-slate-200 dark:border-slate-card-border text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Sl. No.</th>
                    <th className="py-3 px-4">Course Code</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4 text-center">Credits</th>
                    <th className="py-3 px-4 text-center">CIE Marks</th>
                    <th className="py-3 px-4 text-center">SEE Marks</th>
                    <th className="py-3 px-4 text-center">Total Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-card-border/40 font-semibold text-slate-705 dark:text-slate-300">
                  {subjects.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-500/5 transition duration-150">
                      <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-black text-indigo-primary dark:text-indigo-secondary">{sub.code}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-100 font-bold">{sub.name}</td>
                      <td className="py-3 px-4 text-center font-extrabold text-orange-accent text-sm">{sub.credits}</td>
                      <td className="py-3 px-4 text-center">{sub.cieMarks ?? 50}</td>
                      <td className="py-3 px-4 text-center">{sub.seeMarks ?? 50}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">{sub.totalMarks ?? 100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SGPA & CGPA Calculator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. SGPA Semester Grade Calculator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap size={22} className="text-indigo-primary" />
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active Semester SGPA Calculator</h3>
                  <p className="text-[11px] text-slate-400 font-bold">Select expected grades for current subjects to compute SGPA</p>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200/60 dark:border-slate-card-border/60 rounded-xl">
                    <div className="overflow-hidden">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block truncate">{sub.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold block">{sub.code} | Credits: {sub.credits}</span>
                    </div>

                    <select
                      value={subjectGrades[sub.id] || ''}
                      onChange={(e) => setSubjectGrades(prev => ({ ...prev, [sub.id]: e.target.value }))}
                      className="px-3 py-1.5 border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-card-bg rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                    >
                      <option value="">Grade?</option>
                      <option value="S">S (10)</option>
                      <option value="A+">A+ (9)</option>
                      <option value="A">A (8)</option>
                      <option value="B">B (7)</option>
                      <option value="C">C (6)</option>
                      <option value="D">D (5)</option>
                      <option value="E">E (4)</option>
                      <option value="F">F (0)</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-card-border/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Calculated SGPA</span>
                  <span className="text-2xl font-black text-indigo-primary">{calculateSgpa()}</span>
                </div>
                <div className="flex gap-1.5">
                  <select
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        handleSyncSgpaToSemester(Number(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-100 dark:bg-slate-dark-bg rounded-xl text-xs font-black text-slate-700 dark:text-slate-350 focus:outline-none"
                  >
                    <option value="">Sync to CGPA...</option>
                    <option value="0">Sem 1</option>
                    <option value="1">Sem 2</option>
                    <option value="2">Sem 3</option>
                    <option value="3">Sem 4</option>
                    <option value="4">Sem 5</option>
                    <option value="5">Sem 6</option>
                    <option value="6">Sem 7</option>
                    <option value="7">Sem 8</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. CGPA Multi-Semester Tracker */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={22} className="text-orange-accent" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Cumulative CGPA Tracker</h3>
                    <p className="text-[11px] text-slate-400 font-bold">Input your SGPA for each completed semester</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {cgpaSemesters.map((val, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block tracking-tight">Sem {idx + 1}</label>
                      <input
                        type="text"
                        placeholder="0.00"
                        value={val}
                        onChange={(e) => handleCgpaSemChange(idx, e.target.value)}
                        className="w-full text-center px-1.5 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-black text-slate-805 dark:text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-card-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Cumulative CGPA</span>
                  <span className="text-2xl font-black text-orange-accent">{calculateCgpa()}</span>
                </div>
                <button
                  onClick={() => {
                    setCgpaSemesters(['', '', '', '', '', '', '', '']);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-dark-bg rounded-xl text-xs font-black text-slate-650 dark:text-slate-400"
                >
                  Reset Grid
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NOTICE BOARD & EVENTS */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notice board */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="text-indigo-primary" size={20} />
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Department Announcement Notice Board</h3>
            </div>
            
            <div className="space-y-4">
              {notices.map((n) => (
                <div key={n.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        n.tag === 'Exam'
                          ? 'bg-rose-500/10 text-rose-500'
                          : n.tag === 'Placement'
                          ? 'bg-orange-accent/10 text-orange-accent'
                          : n.tag === 'Event'
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-indigo-primary/10 text-indigo-primary'
                      }`}>
                        {n.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{n.date}</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEditNoticeClick(n)}
                        className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-[9px] font-bold text-indigo-primary dark:text-indigo-secondary hover:bg-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this notice?")) {
                            deleteNotice(n.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{n.title}</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                  No announcements posted yet.
                </div>
              )}
            </div>
          </div>

          {/* Events Calendar & Notice Composer */}
          <div className="space-y-6">
            {/* Notice Composer */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {editingNoticeId ? '🔄 Edit Announcement' : '📢 Compose Notice'}
              </h3>
              <form onSubmit={handleNoticeSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Notice Title</label>
                  <input
                    type="text"
                    placeholder="e.g. CIE-2 Schedule..."
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Tag / Category</label>
                  <select
                    value={noticeTag}
                    onChange={(e) => setNoticeTag(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam</option>
                    <option value="Placement">Placement</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Content Body</label>
                  <textarea
                    rows={4}
                    placeholder="Type the notice details..."
                    value={noticeContentState}
                    onChange={(e) => setNoticeContentState(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {editingNoticeId && (
                    <button
                      type="button"
                      onClick={handleCancelNoticeEdit}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border text-slate-650 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200"
                  >
                    {editingNoticeId ? 'Save Changes' : 'Post Notice'}
                  </button>
                </div>
              </form>
            </div>

            {/* Events Calendar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Academic Event Calendar</h3>
              <div className="space-y-3.5">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-card-border/50 flex gap-3.5 items-start bg-slate-50/50 dark:bg-slate-dark-bg/40">
                    <div className="p-2.5 rounded-xl bg-orange-accent/10 text-orange-accent shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-805 dark:text-slate-200">{ev.title}</h5>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">Date: {ev.date}</span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTES ORGANIZER */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note creator form */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4">
              {editingNoteId ? 'Edit Study Note' : 'Create Study Note'}
            </h3>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Subject Folder</label>
                <select
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. ACID properties, Normal forms..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Content Body</label>
                <textarea
                  rows={6}
                  placeholder="Type notes summary guidelines..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                />
              </div>

              <div className="flex gap-2">
                {editingNoteId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNoteId(null);
                      setNoteTitle('');
                      setNoteContent('');
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-card-border text-slate-650 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200"
                >
                  {editingNoteId ? 'Save Edits' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Notes display */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Saved Notes</h3>
            
            {/* Folder Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedNotesFolder('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition duration-150 ${
                  selectedNotesFolder === 'All'
                    ? 'bg-indigo-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                📂 All Folders ({notes.length})
              </button>
              {subjects.map((sub) => {
                const count = notes.filter(n => n.subject === sub.name).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedNotesFolder(sub.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition duration-150 ${
                      selectedNotesFolder === sub.name
                        ? 'bg-indigo-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    📁 {sub.name.length > 25 ? `${sub.name.slice(0, 25)}...` : sub.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1">
              {(() => {
                const filteredNotes = selectedNotesFolder === 'All' ? notes : notes.filter(n => n.subject === selectedNotesFolder);
                return (
                  <>
                    {filteredNotes.map((note) => (
                      <div key={note.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[8px] font-black uppercase max-w-[120px] truncate">
                              {note.subject}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold">{new Date(note.lastModified).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-white line-clamp-1">{note.title}</h4>
                          <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-2 line-clamp-4 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        </div>

                        <div className="flex gap-2 border-t border-slate-200/50 dark:border-slate-card-border/50 pt-2 shrink-0">
                          <button
                            onClick={() => handleEditNoteClick(note)}
                            className="flex-1 py-1 rounded-lg border border-slate-200 dark:border-slate-card-border text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredNotes.length === 0 && (
                      <div className="col-span-full py-16 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl flex flex-col items-center justify-center gap-2">
                        <FolderOpen size={24} className="text-slate-400/80" />
                        No study notes saved in this folder.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* SUBJECTS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Subject Form */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {editingSubjectId ? '🔄 Edit Subject Details' : '➕ Add New Subject'}
            </h3>
            
            <form onSubmit={handleSubjectSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. 22CS41"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Database Management Systems"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Credits</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={subCredits}
                    onChange={(e) => setSubCredits(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Goal Grade</label>
                  <select
                    value={subGoalGrade}
                    onChange={(e) => setSubGoalGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="S">S</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="PP">PP</option>
                    <option value="NP">NP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">CIE Marks</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={subCieMarks}
                    onChange={(e) => setSubCieMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">SEE Marks</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={subSeeMarks}
                    onChange={(e) => setSubSeeMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Total Marks</label>
                  <input
                    type="number"
                    min={0}
                    value={subTotalMarks}
                    onChange={(e) => setSubTotalMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {editingSubjectId && (
                  <button
                    type="button"
                    onClick={handleCancelSubjectEdit}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border text-slate-650 dark:text-slate-400 font-extrabold text-xs hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200"
                >
                  {editingSubjectId ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>

          {/* Subjects Table List */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active Subjects & Evaluation Scheme</h3>
            
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-card-border rounded-2xl bg-slate-50/20 dark:bg-slate-dark-bg/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-dark-bg/60 border-b border-slate-200 dark:border-slate-card-border text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Sl. No.</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4 text-center">Credits</th>
                    <th className="py-3 px-4 text-center">CIE</th>
                    <th className="py-3 px-4 text-center">SEE</th>
                    <th className="py-3 px-4 text-center">Total</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-card-border/40 font-semibold text-slate-705 dark:text-slate-300">
                  {subjects.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-500/5 transition duration-150">
                      <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-black text-indigo-primary dark:text-indigo-secondary">{sub.code}</td>
                      <td className="py-3 px-4 text-slate-805 dark:text-slate-100 font-bold">{sub.name}</td>
                      <td className="py-3 px-4 text-center font-extrabold text-orange-accent text-sm">{sub.credits}</td>
                      <td className="py-3 px-4 text-center">{sub.cieMarks ?? 50}</td>
                      <td className="py-3 px-4 text-center">{sub.seeMarks ?? 50}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">{sub.totalMarks ?? 100}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditSubjectClick(sub)}
                            className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-[10px] font-bold text-indigo-primary dark:text-indigo-secondary hover:bg-slate-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${sub.name}?`)) {
                                deleteSubject(sub.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                        No subjects found. Please add a subject using the form.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RESOURCE VAULT */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Resources Form */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">🎒 Add Study Resource</h3>
            
            {resUploadError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold leading-normal">
                ⚠️ {resUploadError}
              </div>
            )}

            <form onSubmit={handleResourceSubmit} className="space-y-3.5">
              <div className="flex bg-slate-100 dark:bg-slate-dark-bg p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setResIsPdf(false);
                    setResUploadError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    !resIsPdf
                      ? 'bg-indigo-primary text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🔗 Website Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResIsPdf(true);
                    setResUploadError('');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                    resIsPdf
                      ? 'bg-indigo-primary text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📄 PDF File
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Resource Name</label>
                <input
                  type="text"
                  placeholder="e.g. Core Java Reference Book"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Helpful for Module 3 and 4..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider">Associated Subject</label>
                <select
                  value={resSubject}
                  onChange={(e) => setResSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                  {subjects.length === 0 && (
                    <option value="">No subjects active</option>
                  )}
                </select>
              </div>

              {!resIsPdf ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/syllabus"
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    required={!resIsPdf}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider block">PDF File (Max 1.5MB)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-primary/10 file:text-indigo-primary hover:file:bg-indigo-primary/20 cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-400 font-medium leading-normal mt-1">
                    ⚠️ Files are stored locally in the browser. Large files will exceed storage quotas. Limit size strictly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs transition duration-200 mt-2"
              >
                Add Resource
              </button>
            </form>
          </div>

          {/* Resources List display */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Resource Files & Links</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-400">Filter:</span>
                <select
                  value={filterResSubject}
                  onChange={(e) => setFilterResSubject(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Subjects</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {(() => {
                const filteredResources = filterResSubject === 'All' ? academicResources : academicResources.filter(r => r.subject === filterResSubject);
                return (
                  <>
                    {filteredResources.map((res) => (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border hover:border-indigo-primary/30 dark:hover:border-indigo-primary/20 flex items-center justify-between gap-4 transition duration-200"
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[8px] font-black uppercase">
                              {res.isPdf ? '📄 PDF Document' : '🔗 Website URL'}
                            </span>
                            {res.subject && (
                              <span className="px-2 py-0.5 rounded bg-orange-accent/10 text-orange-accent text-[8px] font-black uppercase truncate max-w-[150px]">
                                {res.subject}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-black text-slate-805 dark:text-slate-200 line-clamp-1">{res.name}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold mt-0.5">{res.desc}</p>
                          {res.isPdf && res.fileName && (
                            <span className="text-[9px] text-slate-400 font-bold block mt-1">File: {res.fileName}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {res.isPdf ? (
                            <a
                              href={res.url}
                              download={res.fileName || 'resource.pdf'}
                              className="px-3 py-2 rounded-xl bg-indigo-primary/10 text-indigo-primary hover:bg-indigo-primary/20 text-[10px] font-black transition"
                            >
                              Download PDF
                            </a>
                          ) : (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-indigo-primary/10 text-indigo-primary hover:bg-indigo-primary/20 text-[10px] font-black transition"
                            >
                              Open Link
                            </a>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${res.name}?`)) {
                                deleteAcademicResource(res.id);
                              }
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredResources.length === 0 && (
                      <div className="text-center py-16 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                        No resources saved for this subject.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* NEW INTEGRATED MODULES */}
      {activeTab === 'attendance-predict' && <AttendancePredictor />}
      {activeTab === 'ai-notes' && <NotesGenerator />}
      {activeTab === 'pyq' && <PYQAnalyzer />}
    </div>
  );
};
export default CollegeCompanion;
