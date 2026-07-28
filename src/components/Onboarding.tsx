import React, { useState } from 'react';
import { useApp, UserProfile } from '../context/AppContext';
import { GraduationCap, ArrowRight, User, Bookmark, ChevronRight, Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { updateProfile } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState<'CSE' | 'ECE' | 'EEE' | 'ME' | 'Civil'>('CSE');
  const [semester, setSemester] = useState<number>(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState('Software Engineer');

  const branches = [
    { code: 'CSE', name: 'Computer Science' },
    { code: 'ECE', name: 'Electronics & Comm.' },
    { code: 'EEE', name: 'Electrical & Electronics' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'Civil', name: 'Civil Engineering' }
  ];

  const interestOptions = [
    'Aptitude & Puzzles',
    'Coding & DSA',
    'Web Development',
    'App Development',
    'Machine Learning & AI',
    'Embedded Systems & IoT',
    'VLSI & Circuits',
    'Power Systems & Solar',
    'Robotics & Automation',
    'CAD & SolidWorks',
    'Structural Analysis',
    'Surveying & Fluid Dynamics'
  ];

  const careerGoals = [
    'Software Engineer',
    'Embedded Developer',
    'VLSI Design Engineer',
    'Data Scientist',
    'CAD Product Designer',
    'Structural Consultant',
    'Civil Construction Manager',
    'Higher Studies / GATE Exam'
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      const profile: UserProfile = {
        name: name.trim() || 'Engineering Student',
        branch,
        semester,
        interests: selectedInterests,
        careerGoal
      };
      updateProfile(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-dark-bg p-4 transition-colors duration-300">
      <div className="w-full max-w-xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 transition-colors duration-300">
        
        {/* Onboarding Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-primary text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-extrabold text-sm text-slate-800 dark:text-white tracking-tight">
              ESA ONBOARDING
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-indigo-primary' : s < step ? 'w-2 bg-indigo-secondary/40' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="space-y-6 animate-glow-subtle">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome to <span className="text-indigo-primary">ESA</span>!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Let\'s personalize your student productivity companion. First, what is your name?
              </p>
            </div>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-card-border bg-slate-100/50 dark:bg-slate-dark-bg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-primary transition duration-200 font-medium"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Select your <span className="text-indigo-primary">Engineering Stream</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This personalizes your career roadmaps and project recommendations.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {branches.map((b) => (
                <button
                  key={b.code}
                  onClick={() => setBranch(b.code as any)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 flex items-center justify-between font-bold ${
                    branch === b.code
                      ? 'border-indigo-primary bg-indigo-primary/5 dark:bg-indigo-primary/10 text-indigo-primary'
                      : 'border-slate-200 dark:border-slate-card-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-sm font-extrabold block">{b.code}</span>
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{b.name}</span>
                  </div>
                  {branch === b.code && (
                    <div className="w-5 h-5 rounded-full bg-indigo-primary text-white flex items-center justify-center">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                What is your current <span className="text-indigo-primary">Semester</span>?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Helps us map out the timeline of your study planner.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSemester(s)}
                  className={`py-4 rounded-2xl border text-center font-extrabold text-lg transition-all duration-200 ${
                    semester === s
                      ? 'border-indigo-primary bg-indigo-primary text-white shadow-lg shadow-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-card-border bg-slate-100/30 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Choose <span className="text-indigo-primary">Interests & Career Goal</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Helps match projects by technology preference.
              </p>
            </div>
            
            {/* Career Goal Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Career Track Goal</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-card-border bg-slate-100/50 dark:bg-slate-dark-bg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-primary text-sm font-semibold"
              >
                {careerGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            {/* Interest Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interests (Select multiple)</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {interestOptions.map((option) => {
                  const selected = selectedInterests.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleInterestToggle(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                        selected
                          ? 'bg-orange-accent border-orange-accent text-white'
                          : 'border-slate-200 dark:border-slate-card-border bg-slate-100/30 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-card-border">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-card-border text-slate-600 dark:text-slate-400 font-extrabold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className={`flex-1 py-3.5 rounded-2xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {step === 4 ? 'Complete Setup' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default Onboarding;
