import React from 'react';
import { useApp } from '../../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, FileText, Briefcase, Award, TrendingUp, HelpCircle } from 'lucide-react';

export const AnalyticsLayer: React.FC = () => {
  const { aiNotes, pyqEntries, attendance, subjects, examPlans, interviewExperiences, exportLogs } = useApp();

  // 1. Notes Stats
  const totalNotes = aiNotes.length;
  const favoriteNotes = aiNotes.filter(n => n.favorite).length;
  
  // Subject frequencies for notes
  const getNotesSubjectStats = () => {
    const counts: Record<string, number> = {};
    aiNotes.forEach(n => {
      counts[n.subject] = (counts[n.subject] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.slice(0, 15), value }));
  };

  const notesChartData = getNotesSubjectStats();

  // 2. PYQ Stats
  const totalPYQs = pyqEntries.length;
  const bookmarkedPYQs = pyqEntries.filter(q => q.bookmarked).length;

  // 3. Attendance warning levels
  let safeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  subjects.forEach(sub => {
    const record = attendance[sub.id] || { present: 0, absent: 0 };
    const total = record.present + record.absent;
    const percentage = total > 0 ? (record.present / total) * 100 : 100;
    
    if (percentage < 75) {
      criticalCount += 1;
    } else if (percentage < 80) {
      warningCount += 1;
    } else {
      safeCount += 1;
    }
  });

  const attendancePieData = [
    { name: 'Safe (>=80%)', value: safeCount, color: '#10b981' },
    { name: 'Warning (75%-79%)', value: warningCount, color: '#f59e0b' },
    { name: 'Critical (<75%)', value: criticalCount, color: '#ef4444' }
  ].filter(d => d.value > 0);

  // 4. Exam Strategy hours
  const totalPrepDays = examPlans.reduce((acc, p) => acc + p.schedule.length, 0);
  const totalStudyHours = examPlans.reduce((acc, p) => acc + (p.schedule.length * p.dailyStudyHours), 0);

  // 5. Placement data
  const companiesCount = new Set(interviewExperiences.map(e => e.companyName)).size;
  const placementRate = interviewExperiences.filter(e => e.outcome === 'Selected').length;

  // 6. Export stats
  const totalExports = exportLogs.length;

  return (
    <div className="space-y-6 text-left">
      {/* Visual summaries grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-primary/10 text-indigo-primary">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Compiled Study Notes</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block">{totalNotes} Generated</span>
            <span className="text-[10px] text-slate-500 font-semibold">{favoriteNotes} Favorites starred</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-accent/10 text-orange-accent">
            <HelpCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Question Bank PYQs</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block">{totalPYQs} Tracked</span>
            <span className="text-[10px] text-slate-500 font-semibold">{bookmarkedPYQs} Bookmarks saved</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attendance Warnings</span>
            <span className="text-xl font-black text-slate-805 dark:text-white block">{criticalCount} Subjects Critical</span>
            <span className="text-[10px] text-slate-500 font-semibold">{warningCount} Subjects at risk</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Placements Pipeline</span>
            <span className="text-xl font-black text-slate-800 dark:text-white block">{companiesCount} Companies</span>
            <span className="text-[10px] text-slate-500 font-semibold">{placementRate} Selected offers</span>
          </div>
        </div>
      </div>

      {/* Recharts Graphical breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Attendance Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Course Attendance Status</h4>
          
          {attendancePieData.length > 0 ? (
            <div className="h-44 w-full flex items-center justify-around">
              <div className="h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendancePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs font-bold">
                {attendancePieData.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-650 dark:text-slate-350">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-12">No subject data tracked. Add subjects in the Planner to build graphs.</div>
          )}
        </div>

        {/* Notes Subject Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Study Notes distribution</h4>
          
          {notesChartData.length > 0 ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notesChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-12">No AI Notes compiled yet. Generate notes on any topic to build graphs.</div>
          )}
        </div>
      </div>

      {/* Prep Strategy & Exports Summary logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Exam Preparation metrics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Exam strategy summary</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Preparation Days</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white block">{totalPrepDays} Days</span>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Budgeted Study Hours</span>
              <span className="text-2xl font-black text-indigo-primary block">{totalStudyHours} Hours</span>
            </div>
          </div>
        </div>

        {/* PDF Export Logs history */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Export Activity Logs</h4>
            <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary text-[10px] font-black">{totalExports} Exports</span>
          </div>

          <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
            {exportLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-55 dark:bg-slate-dark-bg/50 border border-slate-200/50 dark:border-slate-card-border/50 rounded-xl flex justify-between items-center text-xs font-bold"
              >
                <div className="overflow-hidden">
                  <span className="text-slate-805 dark:text-slate-200 block truncate">{log.title}</span>
                  <span className="text-[9px] text-indigo-primary block mt-0.5">{log.module}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-medium shrink-0">{new Date(log.timestamp).toLocaleDateString()}</span>
              </div>
            ))}

            {exportLogs.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-bold">No print documents exported yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsLayer;
