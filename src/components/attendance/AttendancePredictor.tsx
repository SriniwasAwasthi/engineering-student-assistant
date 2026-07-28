import React, { useState } from 'react';
import { useApp, Subject } from '../../context/AppContext';
import { Check, Edit, Plus, AlertCircle, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import { exportDocumentToPDF } from '../export/ExportSystem';

export const AttendancePredictor: React.FC = () => {
  const { subjects, attendance, setAttendanceCount, logExportDocument } = useApp();

  // Active editing state for inline inputs
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editPresent, setEditPresent] = useState(0);
  const [editAbsent, setEditAbsent] = useState(0);

  // Future simulation states
  const [simulationAbsences, setSimulationAbsences] = useState<number>(0);
  const [simulationPresents, setSimulationPresents] = useState<number>(0);

  // Helper to calculate statistics
  const getSubjectAttendanceStats = (subId: string, extraPresent = 0, extraAbsent = 0) => {
    const record = attendance[subId] || { present: 0, absent: 0 };
    const present = record.present + extraPresent;
    const absent = record.absent + extraAbsent;
    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

    // Safety / warning thresholds:
    // Safe: >= 80%
    // Warning: 75% - 79%
    // Critical: < 75%
    let warningLevel: 'Safe' | 'Warning' | 'Critical' = 'Safe';
    let warningColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    
    if (percentage < 75) {
      warningLevel = 'Critical';
      warningColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    } else if (percentage < 80) {
      warningLevel = 'Warning';
      warningColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }

    // Min classes needed to reach 75%:
    // Formula: (Present + X) / (Total + X) >= 0.75 => Present + X >= 0.75 * Total + 0.75 * X => 0.25 * X >= 0.75 * Total - Present => X >= 3 * Absent - Present
    let classesNeededTo75 = 0;
    if (percentage < 75) {
      classesNeededTo75 = Math.max(0, Math.ceil(3 * absent - present));
    }

    // Safe misses (how many consecutive classes can be missed before falling below 75%):
    // Formula: Present / (Total + Y) >= 0.75 => Present >= 0.75 * Total + 0.75 * Y => 0.75 * Y <= Present - 0.75 * Total => Y <= (Present - 0.75 * Total) / 0.75 => Y <= (Present - 3 * Absent) / 3
    let safeMisses = 0;
    if (percentage >= 75) {
      safeMisses = Math.max(0, Math.floor((present - 3 * absent) / 3));
    }

    return {
      present,
      absent,
      total,
      percentage,
      warningLevel,
      warningColor,
      classesNeededTo75,
      safeMisses
    };
  };

  const handleEditClick = (sub: Subject) => {
    const record = attendance[sub.id] || { present: 0, absent: 0 };
    setEditingSubId(sub.id);
    setEditPresent(record.present);
    setEditAbsent(record.absent);
  };

  const handleSaveLogs = (subId: string) => {
    setAttendanceCount(subId, Math.max(0, editPresent), Math.max(0, editAbsent));
    setEditingSubId(null);
  };

  // Cumulative Average Attendance
  const getOverallStats = () => {
    let totalClasses = 0;
    let totalPresents = 0;
    let criticalSubjects = 0;

    subjects.forEach((sub) => {
      const stats = getSubjectAttendanceStats(sub.id);
      totalClasses += stats.total;
      totalPresents += stats.present;
      if (stats.percentage < 75) {
        criticalSubjects += 1;
      }
    });

    const average = totalClasses > 0 ? Math.round((totalPresents / totalClasses) * 100) : 0;
    return { average, criticalSubjects, totalClasses };
  };

  const overall = getOverallStats();

  const handleExportPDF = () => {
    const rowsHtml = subjects
      .map((sub) => {
        const stats = getSubjectAttendanceStats(sub.id);
        const alertTag =
          stats.percentage < 75
            ? `<span style="color: #ef4444; font-weight: bold;">CRITICAL (Needs ${stats.classesNeededTo75} classes)</span>`
            : stats.percentage < 80
            ? `<span style="color: #f59e0b; font-weight: bold;">WARNING (Safe misses: ${stats.safeMisses})</span>`
            : `<span style="color: #10b981; font-weight: bold;">SAFE (Safe misses: ${stats.safeMisses})</span>`;

        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: bold;">${sub.name}<br/><span style="font-size: 10px; color: #64748b;">${sub.code}</span></td>
          <td style="padding: 12px; text-align: center;">${stats.present}</td>
          <td style="padding: 12px; text-align: center;">${stats.absent}</td>
          <td style="padding: 12px; text-align: center;">${stats.total}</td>
          <td style="padding: 12px; text-align: center; font-weight: bold; font-size: 14px;">${stats.percentage}%</td>
          <td style="padding: 12px; text-align: right;">${alertTag}</td>
        </tr>
      `;
      })
      .join('');

    const payload = {
      title: 'Active Attendance Audit Statement',
      subtitle: `Syllabus terms logs and compliance tracking report.`,
      metadata: [
        { label: 'Overall Attendance Avg', value: `${overall.average}%` },
        { label: 'Critical Subjects Count', value: overall.criticalSubjects },
        { label: 'Total Audited Lectures', value: overall.totalClasses }
      ],
      htmlContent: `
        <h3>Attendance Breakdown Sheet</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
              <th style="padding: 12px;">Subject Details</th>
              <th style="padding: 12px; text-align: center;">Presents</th>
              <th style="padding: 12px; text-align: center;">Absents</th>
              <th style="padding: 12px; text-align: center;">Total Lectures</th>
              <th style="padding: 12px; text-align: center;">Attendance %</th>
              <th style="padding: 12px; text-align: right;">Compliance Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `
    };

    exportDocumentToPDF(payload, logExportDocument, 'Attendance Predictor');
  };

  return (
    <div className="space-y-6">
      {/* Overview Dashboard Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${overall.average >= 75 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {overall.average >= 75 ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-905 dark:text-white tracking-tight">Active Attendance Scorecard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Your overall average attendance stands at <strong className="text-indigo-primary">{overall.average}%</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center px-4 py-2 border-r border-slate-200 dark:border-slate-card-border">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black">Under 75% Target</span>
            <span className="text-lg font-black text-rose-500">{overall.criticalSubjects} Subjects</span>
          </div>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition"
          >
            <Download size={14} /> Export Audit Sheet
          </button>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const stats = getSubjectAttendanceStats(sub.id);
          const isEditing = editingSubId === sub.id;

          return (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-3">
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white truncate" title={sub.name}>
                    {sub.name}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                    {sub.code}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0 ${stats.warningColor}`}>
                  {stats.warningLevel}
                </span>
              </div>

              {/* Progress Ring or Numerical Details */}
              <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200/50 dark:border-slate-card-border/50 rounded-2xl">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-black">Attendance</span>
                  <span className={`text-2xl font-black ${stats.percentage >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stats.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-black">Lectures</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stats.present} P / {stats.absent} A ({stats.total} total)
                  </span>
                </div>
              </div>

              {/* Predictive Insight Box */}
              <div className="text-xs space-y-2 flex-1 justify-center flex flex-col min-h-[48px]">
                {stats.percentage < 75 ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-500 font-bold leading-relaxed flex items-start gap-2">
                    <AlertCircle className="shrink-0 mt-0.5" size={13} />
                    <span>
                      Critical! You must attend the next <strong>{stats.classesNeededTo75}</strong> lectures consecutively to hit 75%.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-500 font-bold leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="shrink-0 mt-0.5" size={13} />
                    <span>
                      {stats.safeMisses > 0 ? (
                        <>
                          Safe! You can miss up to <strong>{stats.safeMisses}</strong> upcoming lectures safely without falling below 75%.
                        </>
                      ) : (
                        <>On the line! Missing the next class will drop you below 75%.</>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Editing Controls */}
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-card-border/40">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Presents</label>
                        <input
                          type="number"
                          value={editPresent}
                          onChange={(e) => setEditPresent(Number(e.target.value))}
                          className="w-full text-center px-2 py-1.5 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-lg text-xs font-black text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Absents</label>
                        <input
                          type="number"
                          value={editAbsent}
                          onChange={(e) => setEditAbsent(Number(e.target.value))}
                          className="w-full text-center px-2 py-1.5 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-lg text-xs font-black text-slate-800 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSubId(null)}
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-card-border text-[10px] font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveLogs(sub.id)}
                        className="flex-1 py-1.5 rounded-lg bg-indigo-primary text-white text-[10px] font-extrabold flex items-center justify-center gap-1"
                      >
                        <Check size={12} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(sub)}
                    className="w-full py-2 bg-slate-100/50 dark:bg-slate-dark-bg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-350 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5 transition duration-150"
                  >
                    <Edit size={12} /> Edit Logs & Targets
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Calculator Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
        <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">Active Absence Simulator</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          Simulate the future impact of misses or presents across all courses dynamically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Simulate Future Absences (Miss Classes):</span>
                <span className="text-rose-500 font-mono font-black">{simulationAbsences} Lectures</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={simulationAbsences}
                onChange={(e) => setSimulationAbsences(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-card-border rounded-lg appearance-none cursor-pointer accent-indigo-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Simulate Future Presents (Attend Classes):</span>
                <span className="text-emerald-500 font-mono font-black">{simulationPresents} Lectures</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={simulationPresents}
                onChange={(e) => setSimulationPresents(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-card-border rounded-lg appearance-none cursor-pointer accent-indigo-primary"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border space-y-3">
            <h4 className="text-xs font-black uppercase text-indigo-primary block tracking-wider">Simulation Results</h4>
            
            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {subjects.map((sub) => {
                const curStats = getSubjectAttendanceStats(sub.id);
                const simStats = getSubjectAttendanceStats(sub.id, simulationPresents, simulationAbsences);
                const isDown = simStats.percentage < curStats.percentage;
                
                return (
                  <div key={sub.id} className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-655 dark:text-slate-400 truncate max-w-[150px]">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{curStats.percentage}%</span>
                      <span className="text-slate-350">➔</span>
                      <span className={simStats.percentage >= 75 ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}>
                        {simStats.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AttendancePredictor;
