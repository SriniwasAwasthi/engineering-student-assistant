import React, { useState } from 'react';
import { useApp, UserProfile } from '../context/AppContext';
import { Settings as SettingsIcon, User, Moon, Sun, ShieldAlert, Trash2, CheckCircle2, GraduationCap, Download, Upload } from 'lucide-react';

export const Settings: React.FC = () => {
  const { userProfile, updateProfile, theme, toggleTheme, resetAllData, importBackupData } = useApp();

  // Profile forms states
  const [name, setName] = useState(userProfile?.name || '');
  const [branch, setBranch] = useState<'CSE' | 'ECE' | 'EEE' | 'ME' | 'Civil'>(userProfile?.branch || 'CSE');
  const [semester, setSemester] = useState<number>(userProfile?.semester || 1);
  const [careerGoal, setCareerGoal] = useState(userProfile?.careerGoal || 'Software Engineer');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Engineering Student',
      branch,
      semester,
      interests: userProfile?.interests || [],
      careerGoal
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetData = () => {
    const confirm = window.confirm('Are you absolutely sure you want to delete all daily tasks, marks, timetables, and settings? This operation is irreversible.');
    if (confirm) {
      resetAllData();
      alert('All localized app states cleared.');
      window.location.reload();
    }
  };

  // 1. Export JSON Workspace Backup
  const handleExportBackup = () => {
    const backupData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('esa_')) {
        const cleanKey = key.replace('esa_', '');
        try {
          backupData[cleanKey] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          backupData[cleanKey] = localStorage.getItem(key);
        }
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `esa_workspace_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert('Workspace JSON backup generated and downloaded successfully!');
  };

  // 2. Import JSON Workspace Restore
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        if (!backup || typeof backup !== 'object') {
          alert('Invalid backup file structure.');
          return;
        }

        const confirm = window.confirm('Importing this backup will overwrite all current workspace settings. Do you want to proceed?');
        if (!confirm) return;

        const success = importBackupData(backup);
        if (success) {
          // Write all keys to local storage
          Object.entries(backup).forEach(([key, val]) => {
            localStorage.setItem(`esa_${key}`, JSON.stringify(val));
          });
          alert('Workspace state restored successfully!');
          window.location.reload();
        } else {
          alert('Failed to parse backup state lists.');
        }
      } catch (err) {
        alert('Failed to read JSON backup file.');
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="max-w-2xl text-left space-y-6 pb-20 md:pb-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon size={24} className="text-indigo-primary" /> Settings & System Options
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure student telemetry, profile attributes, themes, and local cache.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <h3 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-2">
            <User size={18} className="text-indigo-primary" /> Modify Student Profile
          </h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Student Name</label>
                <input
                  type="text"
                  placeholder="Student name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-350 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Engineering Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-750 dark:text-slate-300 focus:outline-none"
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="EEE">Electrical (EEE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="Civil">Civil Engineering</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-755 dark:text-slate-350 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Career Goal Target</label>
                <input
                  type="text"
                  placeholder="Software Developer..."
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl transition duration-200 shadow-md"
              >
                Save Details
              </button>
              {saveSuccess && (
                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Profile details updated!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Theme Settings Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
              Appearance Theme Mode
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold leading-relaxed">
              Toggle between dark Slate and light Minimal themes for comfortable daily reading.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`w-12 h-6.5 rounded-full p-1 transition duration-300 flex items-center ${
              theme === 'dark' ? 'bg-indigo-primary' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white transition duration-300 transform ${
                theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Backup & Restore Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-850 dark:text-white flex items-center gap-2">
              <Download size={18} className="text-indigo-primary" /> Workspace Data Management
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold leading-relaxed">
              Export a full JSON backup of your student profile, attendance logs, notes library, and placement tracking, or load a previous backup to restore your workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-black">
            <button
              onClick={handleExportBackup}
              className="px-5 py-2.5 bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition duration-150 shadow-sm"
            >
              <Download size={14} /> Export Backup File
            </button>

            <label className="px-5 py-2.5 border border-slate-250 dark:border-slate-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition duration-150 shadow-sm">
              <Upload size={14} /> Import Backup File
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone Reset Data Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-rose-500/25 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-rose-500 flex items-center gap-2">
              <ShieldAlert size={18} /> Danger Zone Options
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed">
              Permanently clear your student settings, class timetable logs, internal exams lists, and streaks record files.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-5 py-2.5 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition duration-200 shadow-sm"
          >
            <Trash2 size={14} /> Clear Local Cache Data
          </button>
        </div>

        {/* Version specifications */}
        <div className="text-center py-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          <GraduationCap size={16} className="inline-block mr-1 text-slate-400" /> Engineering Student Assistant App • v1.0.0
        </div>

      </div>

    </div>
  );
};
export default Settings;
