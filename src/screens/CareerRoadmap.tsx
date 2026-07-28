import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { careerPaths, domainComparisons, CareerPath } from '../data/roadmapData';
import {
  Milestone,
  CheckCircle,
  Circle,
  TrendingUp,
  Award,
  Cpu,
  Briefcase,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  DollarSign
} from 'lucide-react';

export const CareerRoadmap: React.FC = () => {
  const { completedRoadmapMilestones, toggleMilestone, userProfile } = useApp();

  // Mode: 'grid' (roles list) or 'timeline' (detailed semester timeline)
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Branch Selection - default to student branch from profile if it is CSE or IT
  const defaultBranch = (userProfile && ((userProfile.branch as string) === 'IT' || userProfile.branch === 'CSE')) ? userProfile.branch : 'CSE';
  const [selectedBranch, setSelectedBranch] = useState<string>(defaultBranch);
  
  // Select difficulty filter
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filter career paths based on branch and difficulty
  const filteredPaths = careerPaths.filter((path) => {
    const matchBranch = path.branch === selectedBranch;
    const matchDiff = selectedDifficulty === 'All' || path.difficulty === selectedDifficulty;
    return matchBranch && matchDiff;
  });

  // Track currently selected path details
  const [selectedPathId, setSelectedPathId] = useState<string>(
    filteredPaths[0]?.id || careerPaths[0].id
  );

  const activePath = careerPaths.find((p) => p.id === selectedPathId) || filteredPaths[0] || careerPaths[0];

  const handleSelectPath = (id: string) => {
    setSelectedPathId(id);
    setViewMode('timeline');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Engineering Career Roadmap</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Plan your career path semester by semester</p>
      </div>

      {viewMode === 'grid' ? (
        <>
          {/* selectors bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-205 dark:border-slate-card-border">
            {/* Branch Filters */}
            <div className="flex bg-slate-100 dark:bg-slate-dark-bg p-1 rounded-2xl gap-1 overflow-x-auto select-none">
              {['CSE', 'IT'].map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition duration-150 ${
                    selectedBranch === branch
                      ? 'bg-indigo-primary text-white shadow'
                      : 'text-slate-605 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>

            {/* Level Filters */}
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Track Level</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Tracks</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => handleSelectPath(path.id)}
                className="p-6 rounded-3xl border border-slate-205 dark:border-slate-card-border/80 bg-white dark:bg-slate-card-bg hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  {/* Title and Demand tag */}
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-relaxed">{path.roleName}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shrink-0 ${
                      path.marketDemand === 'high demand' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {path.marketDemand}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {path.description}
                  </p>

                  {/* Skills tags preview */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {path.skillsRequired.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-dark-bg border border-slate-200/50 dark:border-slate-card-border/40 text-slate-600 dark:text-slate-400 text-[10px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                    {path.skillsRequired.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-extrabold pl-1">
                        + {path.skillsRequired.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer starting salary & Link */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-card-border/40">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Briefcase size={14} className="text-slate-400" />
                    <span>{path.salaryRange}</span>
                  </span>
                  
                  <button className="text-xs font-black text-indigo-primary dark:text-indigo-secondary flex items-center gap-0.5 hover:text-indigo-secondary transition">
                    <span>View Roadmap</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}

            {filteredPaths.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-3xl bg-slate-500/5">
                No career targets found for the selected filter combination.
              </div>
            )}
          </div>

          {/* Market Comparisons Bottom Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-primary" size={20} />
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Salary & Market Demand Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {domainComparisons.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-205 dark:border-slate-card-border space-y-2">
                  <div className="flex justify-between items-center text-xs font-black text-slate-800 dark:text-white">
                    <span className="truncate pr-1">{item.roleName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold border-t border-slate-250/20 dark:border-slate-card-border/20 pt-1.5 space-y-1">
                    <div>Branch: <strong className="text-slate-655 dark:text-slate-400">{item.branch}</strong></div>
                    <div>Curve: <strong className="text-slate-655 dark:text-slate-400">{item.learningCurve}</strong></div>
                    <div className="pt-0.5 font-black text-indigo-primary dark:text-indigo-secondary">{item.averageStartingSalary}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Detailed Timeline View */}
          <button
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-card-bg hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-xs font-extrabold text-slate-700 dark:text-slate-300 transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Career Target Tracks</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Target Detail Header */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white leading-relaxed">{activePath.roleName} Timeline</h2>
                  <span className="px-3 py-1 rounded-2xl bg-indigo-primary/10 border border-indigo-primary/20 text-xs font-black text-indigo-primary dark:text-indigo-secondary">
                    {activePath.difficulty} Level
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  {activePath.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-card-border">
                  <div className="space-y-2 text-xs">
                    <span className="font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                      <Briefcase size={15} className="text-indigo-primary" /> Target Companies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePath.targetCompanies.map((c, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-indigo-primary/5 text-indigo-primary dark:text-indigo-secondary text-[10px] font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <span className="font-extrabold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                      <Award size={15} className="text-orange-accent" /> Interview Focus Areas
                    </span>
                    <ul className="list-disc pl-4 text-slate-600 dark:text-slate-400 space-y-0.5 text-[10px] font-semibold">
                      {activePath.interviewFocus.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Milestones list */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Semester-Wise Roadmap Checklist</h3>
                <p className="text-[10px] text-slate-400 font-bold block">Tick off milestones as you progress through each academic semester.</p>

                <div className="relative pl-6 border-l-2 border-indigo-primary/20 dark:border-slate-card-border space-y-6 pt-1">
                  {activePath.semesters.map((sem) => {
                    const milestoneId = `${activePath.id}_sem_${sem.semester}`;
                    const completed = completedRoadmapMilestones.includes(milestoneId);

                    return (
                      <div key={sem.semester} className="relative">
                        
                        <button
                          onClick={() => toggleMilestone(milestoneId)}
                          className={`absolute -left-[35px] top-1.5 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
                            completed
                              ? 'bg-indigo-primary border-indigo-primary text-white shadow'
                              : 'bg-white dark:bg-slate-card-bg border-slate-350 dark:border-slate-card-border'
                          }`}
                        >
                          {completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>

                        <div className={`p-4 rounded-2xl border transition duration-200 ${
                          completed
                            ? 'bg-slate-100/30 dark:bg-slate-dark-bg/20 border-slate-100 dark:border-slate-card-border/30 opacity-70'
                            : 'bg-slate-50 dark:bg-slate-dark-bg border-slate-205 dark:border-slate-card-border'
                        }`}>
                          <div className="flex justify-between items-center gap-3 mb-1.5">
                            <span className="text-xs font-black text-slate-800 dark:text-white">Semester {sem.semester}: {sem.title}</span>
                            {completed && (
                              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase">Completed</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3 font-semibold">{sem.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-slate-250/20 dark:border-slate-card-border/20 pt-2.5">
                            <div>
                              <span className="font-extrabold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Competencies</span>
                              <div className="flex flex-wrap gap-1">
                                {sem.skills.map((s, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-card-border text-slate-600 dark:text-slate-450 font-bold">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-400 dark:text-slate-500 block mb-1 uppercase tracking-wider">Standard Tools</span>
                              <div className="flex flex-wrap gap-1">
                                {sem.tools.map((t, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-205 dark:bg-slate-card-border text-slate-650 dark:text-slate-450 font-bold">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Certifications & Placement readiness checks */}
            <div className="space-y-6">
              {/* Industry Certifications */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="text-indigo-primary" size={20} />
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Recommended Certs</h3>
                </div>

                <div className="space-y-2.5">
                  {activePath.certifications.map((cert, index) => (
                    <div key={index} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-205 dark:border-slate-card-border flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-accent/15 text-orange-accent shrink-0">
                        <Award size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placement readiness checks */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu size={18} className="text-orange-accent" /> Placement Readiness Checks
                </h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px] block">Internship Prep Goals</span>
                    <ul className="list-disc pl-4 text-slate-650 dark:text-slate-400 space-y-1">
                      {activePath.internshipPrep.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-card-border/50">
                    <span className="font-extrabold text-slate-400 dark:text-slate-550 uppercase tracking-widest text-[9px] block">Job-Ready Checklists</span>
                    <ul className="list-disc pl-4 text-slate-650 dark:text-slate-400 space-y-1">
                      {activePath.jobReadyPrep.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default CareerRoadmap;
