import React, { useState } from 'react';
import { useApp, ExamPlan } from '../../context/AppContext';
import { Calendar, Sparkles, Download, Trash2, AlertCircle, Clock, BookOpen, RotateCcw } from 'lucide-react';
import { exportDocumentToPDF } from '../export/ExportSystem';

export const ExamStrategy: React.FC = () => {
  const { subjects, examPlans, addExamPlan, deleteExamPlan, logExportDocument } = useApp();

  // Generator input states
  const [examName, setExamName] = useState('Final Semester Exams');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks from now default
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [dailyHours, setDailyHours] = useState(4);
  const [subjectCompletion, setSubjectCompletion] = useState<Record<string, number>>(() => {
    const initials: Record<string, number> = {};
    subjects.forEach((s) => {
      initials[s.id] = Math.round((s.unitsCompleted / s.totalUnits) * 100);
    });
    return initials;
  });

  const [activePlan, setActivePlan] = useState<ExamPlan | null>(null);

  const handleCompletionChange = (subId: string, value: number) => {
    setSubjectCompletion((prev) => ({
      ...prev,
      [subId]: value
    }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Calculate preparation days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(examDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      alert('Selected exam date must be in the future!');
      return;
    }

    // 2. Prepare subjects mapping ordered by lowest completion (highest gap)
    const progressList = subjects.map((sub) => {
      const completion = subjectCompletion[sub.id] ?? 0;
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        completionPercentage: completion,
        gap: 100 - completion
      };
    }).sort((a, b) => b.gap - a.gap); // lowest completion first

    // 3. Build day-by-day schedule algorithm
    const schedule: ExamPlan['schedule'] = [];
    const dateCursor = new Date(today);

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dateStr = dateCursor.toISOString().split('T')[0];
      const tasks: ExamPlan['schedule'][number]['tasks'] = [];

      // Determine phase of prep based on distance to exam:
      // Last 1 day: rest & buffer
      // Last 2 days: Mock exams & active recalls
      // Last 3-4 days: Revision focus
      // Other days: Study new concepts / cover units
      const daysRemaining = totalDays - dayNum;

      if (daysRemaining === 0) {
        // Last Day
        tasks.push({
          subjectName: 'All Subjects',
          topic: 'Light review, clear formulas, pack exam kit, and sleep early!',
          type: 'buffer'
        });
      } else if (daysRemaining <= 2) {
        // Mock Assessment Phase
        progressList.slice(0, 2).forEach((sub) => {
          tasks.push({
            subjectName: sub.subjectName,
            topic: `Attempt PYQ papers & write 1-hour active recall sheets.`,
            type: 'mock'
          });
        });
      } else if (daysRemaining <= 4) {
        // Revision Phase
        progressList.forEach((sub) => {
          tasks.push({
            subjectName: sub.subjectName,
            topic: `Revise summary notes, cheat sheets, and unit 4-5 topics.`,
            type: 'revision'
          });
        });
      } else {
        // Core Study Phase (Focus on lowest completion subjects first)
        const activeSub = progressList[(dayNum - 1) % progressList.length];
        const unitToStudy = Math.min(5, Math.ceil((activeSub.completionPercentage / 20) + 1));
        
        tasks.push({
          subjectName: activeSub.subjectName,
          topic: `Study new concepts in Unit ${unitToStudy}. Focus on long-answer theory questions.`,
          type: 'study'
        });
      }

      schedule.push({
        dayNumber: dayNum,
        date: dateStr,
        tasks
      });

      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    const newPlan: ExamPlan = {
      id: `plan_${Date.now()}`,
      examName,
      examDate,
      priority,
      dailyStudyHours: dailyHours,
      subjectsProgress: progressList.map(p => ({
        subjectId: p.subjectId,
        subjectName: p.subjectName,
        completionPercentage: p.completionPercentage
      })),
      schedule,
      createdAt: new Date().toISOString()
    };

    setActivePlan(newPlan);
    addExamPlan(newPlan);
    alert('Strategic exam plan generated and added to your dashboard!');
  };

  const handleExportPDF = (plan: ExamPlan) => {
    const daysHtml = plan.schedule
      .map(
        (day) => `
        <div style="margin-bottom: 12px; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; color: #4f46e5; margin-bottom: 4px;">
            <span>Day ${day.dayNumber} - ${day.date}</span>
          </div>
          ${day.tasks
            .map(
              (task) =>
                `<div style="margin-top: 4px; font-size: 12px; color: #1e293b;">
                  <strong style="color: #0f172a;">[${task.type.toUpperCase()}] ${task.subjectName}:</strong> ${task.topic}
                </div>`
            )
            .join('')}
        </div>
      `
      )
      .join('');

    const payload = {
      title: `Exam Study Strategy - ${plan.examName}`,
      subtitle: `Target Exam Date: ${plan.examDate} | Daily Study Budget: ${plan.dailyStudyHours} hrs`,
      metadata: [
        { label: 'Priority Level', value: plan.priority },
        { label: 'Prep Duration', value: `${plan.schedule.length} Days` },
        { label: 'Planned Hours', value: `${plan.schedule.length * plan.dailyStudyHours} Hours` },
        { label: 'Subjects Tracked', value: plan.subjectsProgress.length }
      ],
      htmlContent: `
        <h3>Day-by-Day Study Timeline</h3>
        ${daysHtml}
      `
    };

    exportDocumentToPDF(payload, logExportDocument, 'Semester Exam Strategy Generator');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Parameter Inputs Panel */}
      <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-primary" size={20} />
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Strategy Planner</h3>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Exam Identifier</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
              placeholder="e.g. End Sem Exams, CIE-2..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-350 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Daily Study Hours: {dailyHours} Hrs</label>
            <input
              type="range"
              min="1"
              max="8"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-card-border rounded-lg appearance-none cursor-pointer accent-indigo-primary"
            />
          </div>

          {/* Syllabus Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-card-border">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Syllabus Completion %</label>
            
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
              {subjects.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{sub.name}</span>
                    <span className="text-indigo-primary">{subjectCompletion[sub.id] ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={subjectCompletion[sub.id] ?? 0}
                    onChange={(e) => handleCompletionChange(sub.id, Number(e.target.value))}
                    className="w-full h-1 bg-slate-100 dark:bg-slate-card-border rounded-lg appearance-none cursor-pointer accent-indigo-secondary"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={subjects.length === 0}
            className="w-full py-3 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
          >
            <Sparkles size={14} /> Generate Strategy Plan
          </button>
        </form>
      </div>

      {/* Timeline Calendar View */}
      <div className="lg:col-span-2 space-y-6">
        {activePlan ? (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 animate-fadeIn text-left">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-card-border">
              <div>
                <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">{activePlan.examName} Strategy</h3>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Exam: {activePlan.examDate} | Prep Days: {activePlan.schedule.length} Days</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExportPDF(activePlan)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-slate-500 hover:text-slate-700 dark:hover:text-white transition"
                  title="Export Plan PDF"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => setActivePlan(null)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-slate-550 hover:text-slate-800 dark:hover:text-white transition"
                  title="Reset Generator"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Timeline days scroll container */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {activePlan.schedule.map((day) => (
                <div key={day.dayNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-primary/10 text-indigo-primary flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-black uppercase">Day</span>
                    <span className="text-base font-black leading-none">{day.dayNumber}</span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-extrabold text-slate-400">{day.date}</span>
                    
                    <div className="space-y-2">
                      {day.dayNumber === activePlan.schedule.length && (
                        <div className="p-2.5 rounded-lg bg-orange-accent/10 border border-orange-accent/20 text-[11px] text-orange-accent font-bold">
                          🎯 Exam Day: Good Luck! Stay calm, maintain speed, and review key points.
                        </div>
                      )}
                      
                      {day.tasks.map((task, idx) => (
                        <div key={idx} className="text-xs">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block mr-2 tracking-wide ${
                            task.type === 'study'
                              ? 'bg-indigo-primary/10 text-indigo-primary'
                              : task.type === 'revision'
                              ? 'bg-indigo-secondary/15 text-indigo-secondary'
                              : task.type === 'mock'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {task.type}
                          </span>
                          <strong className="text-slate-800 dark:text-slate-200 font-bold">{task.subjectName}</strong>: {task.topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-primary/10 text-indigo-primary flex items-center justify-center mx-auto">
              <Clock size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">No Active Plan Generated</h3>
              <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                Adjust study preferences on the left and click Generate to see your personalized exam preparation roadmap.
              </p>
            </div>
          </div>
        )}

        {/* Saved Plans List */}
        {examPlans.length > 0 && !activePlan && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 text-left">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Plans Library</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {examPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl bg-slate-55 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border flex justify-between items-center gap-3"
                >
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-slate-805 dark:text-white truncate">{plan.examName}</h4>
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Exam: {plan.examDate} | {plan.schedule.length} Days</span>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setActivePlan(plan)}
                      className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-indigo-primary font-bold text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteExamPlan(plan.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ExamStrategy;
