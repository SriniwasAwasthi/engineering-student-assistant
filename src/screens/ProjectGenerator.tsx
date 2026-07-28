import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { baseProjects, expandProjectIdea, ProjectIdea } from '../data/projectData';
import {
  Search,
  Filter,
  Bookmark,
  Sparkles,
  Copy,
  GitBranch,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  X,
  ExternalLink,
  Database,
  BookOpen,
  Heart,
  Info,
  Layout,
  Award,
  ArrowUpDown,
  Terminal,
  Share2,
  Code2,
  Layers,
  Activity,
  Wrench
} from 'lucide-react';

export const ProjectGenerator: React.FC = () => {
  const { savedProjects, toggleSaveProject } = useApp();



  // Primary navigation tabs
  const [activeTab, setActiveTab] = useState<'explorer' | 'saved' | 'promptStudio'>('explorer');

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>('All');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Active tech filters
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  // Detailed view state (slide-over drawer)
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'brief' | 'technical' | 'roadmap' | 'career' | 'prompts'>('brief');

  // Copied indicator state
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Selected prompt variant inside drawer / prompt studio
  const [promptVariant, setPromptVariant] = useState<'antigravity' | 'cursor' | 'base44' | 'claude' | 'generic'>('antigravity');

  // Custom configuration for AI Prompt Studio
  const [studioProjectId, setStudioProjectId] = useState<string>(baseProjects[0]?.id || '');
  const [studioSearchInput, setStudioSearchInput] = useState<string>('');
  const [isStudioDropdownOpen, setIsStudioDropdownOpen] = useState<boolean>(false);
  const [customFramework, setCustomFramework] = useState<string>('React');
  const [customStyle, setCustomStyle] = useState<string>('Glassmorphism dark theme');

  // Synchronize input with studioProjectId changes
  useEffect(() => {
    const selected = baseProjects.find(p => p.id === studioProjectId);
    if (selected) {
      setStudioSearchInput(selected.title);
    }
  }, [studioProjectId]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Constants lists
  const branchesList = ['All', 'CSE', 'IT', 'Full Stack'];
  const difficultiesList = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Extremely Hard'];
  const categoriesList = ['All', 'Mini Project', 'Major Project', 'Hackathon Project', 'GitHub Project', 'Final Year Project'];
  
  const frontendOptions = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Tailwind CSS'];
  const backendOptions = ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'Kotlin', 'PHP', 'Go', 'Verilog', 'C++'];
  const databaseOptions = ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Supabase', 'Redis'];
  const supportingOptions = ['REST API', 'GraphQL', 'WebSockets', 'JWT', 'OAuth', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP', 'Arduino', 'Raspberry Pi'];

  // Toggle technology selections
  const handleToggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    setCurrentPage(1); // Reset pagination
  };

  // Copy helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedBranch('All');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
    setSelectedBudget('All');
    setSelectedTeamSize('All');
    setSelectedProjectType('All');
    setSelectedTechs([]);
    setSearchQuery('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  // Relevance matching and filtering logic
  const processedProjects = useMemo(() => {
    return baseProjects.map((p) => {
      const allProjectTech = p.technologiesUsed.map(t => t.toLowerCase());

      let score = 100;
      let matchedList: string[] = [];
      let missingList: string[] = [];
      let why = 'Default match';

      if (selectedTechs.length > 0) {
        const matches = selectedTechs.filter(st => allProjectTech.includes(st.toLowerCase()));
        matchedList = matches;
        
        // Calculate intersection percentage
        score = Math.round((matches.length / selectedTechs.length) * 100);

        // Find suggested technologies missing from user selection
        missingList = p.technologiesUsed.filter(t => !selectedTechs.some(st => st.toLowerCase() === t.toLowerCase()));

        if (matches.length > 0) {
          const matchTypes: string[] = [];
          if (matches.some(m => frontendOptions.some(f => f.toLowerCase() === m.toLowerCase()))) matchTypes.push('Frontend');
          if (matches.some(m => backendOptions.some(b => b.toLowerCase() === m.toLowerCase()))) matchTypes.push('Backend');
          if (matches.some(m => databaseOptions.some(d => d.toLowerCase() === m.toLowerCase()))) matchTypes.push('Database');
          if (matches.some(m => supportingOptions.some(s => s.toLowerCase() === m.toLowerCase()))) matchTypes.push('Supporting');

          why = `Matches ${matchTypes.join(' & ')}: ${matches.join(', ')}.`;
          if (missingList.length > 0) {
            why += ` Try adding ${missingList.slice(0, 2).join(' or ')} to complete the stack.`;
          }
        } else {
          why = `Stack mismatch. Suggested: ${p.technologiesUsed.slice(0, 3).join(', ')}`;
        }
      }

      return {
        ...p,
        relevanceScore: score,
        matchedTech: matchedList,
        missingTech: missingList,
        whyMatched: why
      };
    });
  }, [selectedTechs]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    return processedProjects.filter((p) => {
      // Branch filter
      const matchesBranch = selectedBranch === 'All' || p.branch === selectedBranch;

      // Difficulty filter
      const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      // Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Budget filter
      const matchesBudget = selectedBudget === 'All' || p.budget === selectedBudget;

      // Team size filter
      const matchesTeamSize = selectedTeamSize === 'All' || p.teamSize === selectedTeamSize;

      // Project type filter
      const matchesProjectType = selectedProjectType === 'All' || p.projectType === selectedProjectType;

      // Text search matching
      const query = searchQuery.toLowerCase();
      const matchesSearch = query === '' || 
        p.title.toLowerCase().includes(query) ||
        p.shortSummary.toLowerCase().includes(query) ||
        p.branch.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.problemStatement.toLowerCase().includes(query) ||
        p.technologiesUsed.some(t => t.toLowerCase().includes(query)) ||
        p.tags.some(t => t.toLowerCase().includes(query));

      // Technology match score > 0 if technology filters are active
      const matchesTech = selectedTechs.length === 0 || p.relevanceScore > 0;

      // If viewing saved library tab, filter only saved projects
      const isSavedMatch = activeTab !== 'saved' || savedProjects.includes(p.id);

      return matchesBranch && matchesDiff && matchesCategory && matchesBudget && matchesTeamSize && matchesProjectType && matchesSearch && matchesTech && isSavedMatch;
    });
  }, [processedProjects, selectedBranch, selectedDifficulty, selectedCategory, selectedBudget, selectedTeamSize, selectedProjectType, searchQuery, selectedTechs, activeTab, savedProjects]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortBy === 'relevance') {
      list.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === 'difficulty-asc') {
      const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3, 'Very Hard': 4, 'Extremely Hard': 5 };
      list.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (sortBy === 'difficulty-desc') {
      const order: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3, 'Very Hard': 4, 'Extremely Hard': 5 };
      list.sort((a, b) => order[b.difficulty] - order[a.difficulty]);
    } else if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filteredProjects, sortBy]);



  // Expand selected project details dynamically
  const handleOpenDrawer = (p: ProjectIdea) => {
    const expanded = expandProjectIdea(p);
    setSelectedProject(expanded);
    setDrawerActiveTab('brief');
  };

  // Filtered projects for the search text input in AI Prompt Studio
  const studioFilteredProjects = useMemo(() => {
    const query = studioSearchInput.trim().toLowerCase();
    const selected = baseProjects.find(p => p.id === studioProjectId);
    if (!query || (selected && query === selected.title.toLowerCase())) {
      return baseProjects;
    }
    return baseProjects.filter(p => p.title.toLowerCase().includes(query));
  }, [studioSearchInput, studioProjectId]);

  // Selected project for AI Prompt Studio
  const studioProject = useMemo(() => {
    const proj = baseProjects.find(p => p.id === studioProjectId);
    return proj ? expandProjectIdea(proj) : null;
  }, [studioProjectId]);

  // Dynamic Prompt customized in Studio workspace
  const generatedStudioPrompt = useMemo(() => {
    if (!studioProject) return '';
    
    const base = `========================================================================
PROJECT BUILD SPECIFICATION: ${studioProject.title}
========================================================================

1. TECHNICAL OVERVIEW
- Target Framework: ${customFramework}
- Visual Styling Theme: ${customStyle}
- Project Category: ${studioProject.category}
- Difficulty Level: ${studioProject.difficulty}
- Engineering Domain: ${studioProject.branch}

2. BRIEF & OBJECTIVE
- Objective: ${studioProject.objective}
- Problem Statement: ${studioProject.problemStatement}
- Why It Matters: ${studioProject.whyItMatters || 'Automates critical telemetry flows and operations.'}
- Target Users: ${(studioProject.targetUsers || []).join(', ')}

3. SYSTEM ARCHITECTURE & DATA MODEL
- Recommended Layout:
${studioProject.suggestedArchitecture || 'Standard client-server architecture.'}

- Recommended Database Schema:
${studioProject.suggestedDatabaseSchema || 'Standard tables structure.'}

4. USER INTERFACE & NAVIGATION
- Recommended Pages/Views:
${(studioProject.suggestedUIPages || []).map((page, idx) => `  ${idx + 1}. ${page}`).join('\n')}

- Recommended Core UI Components:
${(studioProject.suggestedComponents || []).map((comp, idx) => `  ${idx + 1}. ${comp}`).join('\n')}

5. CORE FUNCTIONALITIES & FEATURES TO BUILD
${studioProject.features.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

6. BACKEND API ROUTINGS
${(studioProject.suggestedAPIs || []).map((api, idx) => `  ${idx + 1}. ${api}`).join('\n')}

7. VALIDATION RULES & EDGE CASES
${(studioProject.validationEdgeCases || []).map((ec, idx) => `  - ${ec}`).join('\n')}

8. ERROR HANDLING & FAILURE RESILIENCY
${(studioProject.errorHandlingPlan || []).map((eh, idx) => `  - ${eh}`).join('\n')}

9. UX STATES & SKELETON LOADERS
${(studioProject.loadingEmptyStates || []).map((les, idx) => `  - ${les}`).join('\n')}
========================================================================`;

    if (promptVariant === 'antigravity') {
      return `=== ANTIGRAVITY AI BUILD PROMPT ===
System Context: You are a senior product engineer pair-programming to build this application.

${base}

Antigravity Specific Build Instructions:
- Break logic down into clean, modular TypeScript component files under the \`src/components/\` folder.
- Maintain workspace file integrity. Do not overwrite whole files if a small chunk replacement is sufficient.
- Use the \`replace_file_content\` tool for precise edits.
- Ensure all types are strictly defined; do not use 'any'.
- Run \`npm run build\` to verify code correctness and clear any TypeScript compiler warnings.`;
    } else if (promptVariant === 'cursor') {
      return `=== CURSOR AI BUILD PROMPT ===
System Context: You are an expert code architect.

${base}

Cursor Specific Build Instructions:
- Utilize @src context references to keep routes mapped and synced.
- Include descriptive JSDoc headers for all utility and state handlers.
- Create localized cursor rules configs for standard coding consistency.`;
    } else if (promptVariant === 'base44') {
      return `=== BASE44 AI BUILD PROMPT ===
System Context: You are a senior frontend performance engineer.

${base}

Base44 Specific Build Instructions:
- Align all flex layouts and grids to the Base44 design tokens.
- Add performance telemetry markers targeting initial page loads under 200ms.`;
    } else if (promptVariant === 'claude') {
      return `=== CLAUDE AI BUILD PROMPT ===
System Context: You are a world-class systems engineer.

${base}

Claude Specific Build Instructions:
- Output clean, complete file content blocks ready for terminal deployment.
- Outline files clearly with standard markdown code fencing.
- Document deployment and run scripts step-by-step.`;
    }
    
    return `=== GENERIC AI BUILD PROMPT ===
${base}

General Build Instructions:
- Follow Clean Code / MVC architecture guidelines.
- Add descriptive code comments for complicated state hook updates.
- Ensure inputs are fully sanitized and user sessions are stored securely.`;
  }, [studioProject, customFramework, customStyle, promptVariant]);

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left relative overflow-hidden">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-card-border/60 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-primary animate-pulse" size={28} />
            Engineering Project Idea Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
            Discover 400+ custom project ideas with automated AI builder prompt generators
          </p>
        </div>

        {/* Global Stats Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-primary/10 border border-indigo-primary/20 text-xs font-black text-indigo-primary dark:text-indigo-secondary shrink-0 self-start sm:self-center shadow-sm">
          <Lightbulb size={15} />
          <span>{baseProjects.length} Catalog Ideas</span>
          <span className="text-indigo-primary/30">|</span>
          <Heart size={13} className="fill-current text-rose-500" />
          <span>{savedProjects.length} Favorited</span>
        </div>
      </div>

      {/* Main Tab Switches */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-card-border/40 pb-2">
        <button
          onClick={() => { setActiveTab('explorer'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition duration-150 ${
            activeTab === 'explorer'
              ? 'bg-indigo-primary text-white shadow-md'
              : 'text-slate-500 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border'
          }`}
        >
          <Layout size={14} />
          Browse Projects
        </button>
        <button
          onClick={() => { setActiveTab('saved'); setCurrentPage(1); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition duration-150 ${
            activeTab === 'saved'
              ? 'bg-indigo-primary text-white shadow-md'
              : 'text-slate-500 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border'
          }`}
        >
          <Bookmark size={14} />
          Saved Library ({savedProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('promptStudio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition duration-150 ${
            activeTab === 'promptStudio'
              ? 'bg-indigo-primary text-white shadow-md'
              : 'text-slate-500 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-dark-bg/60 border border-slate-200 dark:border-slate-card-border'
          }`}
        >
          <Terminal size={14} />
          AI Prompt Studio
        </button>
      </div>

      {activeTab !== 'promptStudio' ? (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Collapsible Sidebar Filter Panel */}
          <aside className="w-full lg:w-80 shrink-0 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border/80 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-card-border/50">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Filter size={15} className="text-indigo-primary" />
                Advanced Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-black text-rose-500 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Dropdown Filters */}
            <div className="space-y-4">
              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Engineering Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => { setSelectedBranch(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  {branchesList.map(b => (
                    <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  {difficultiesList.map(d => (
                    <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Project Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Estimated Budget</label>
                <select
                  value={selectedBudget}
                  onChange={(e) => { setSelectedBudget(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  <option value="All">Any Budget</option>
                  <option value="Low">Low Budget</option>
                  <option value="Medium">Medium Budget</option>
                  <option value="High">High Budget</option>
                </select>
              </div>

              {/* Team Size */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Target Team Size</label>
                <select
                  value={selectedTeamSize}
                  onChange={(e) => { setSelectedTeamSize(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  <option value="All">Any Team Size</option>
                  <option value="Solo">Solo Project</option>
                  <option value="2-3 members">2-3 Members</option>
                  <option value="4+ members">4+ Members</option>
                </select>
              </div>

              {/* Project Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Submission Scope</label>
                <select
                  value={selectedProjectType}
                  onChange={(e) => { setSelectedProjectType(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
                >
                  <option value="All">Any Project Type</option>
                  <option value="Mini Project">Mini Project</option>
                  <option value="Major Project">Major Project</option>
                  <option value="Hackathon">Hackathon / Exhibition</option>
                </select>
              </div>
            </div>

            {/* Technology Stack Selector Matrix */}
            <div className="border-t border-slate-100 dark:border-slate-card-border/60 pt-4 space-y-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Tech-Stack Relevance Matcher</span>
              
              {/* Frontend Tech */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Frontend Stack</span>
                <div className="flex flex-wrap gap-1">
                  {frontendOptions.map(t => {
                    const isActive = selectedTechs.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => handleToggleTech(t)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition duration-100 ${
                          isActive
                            ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-350'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Backend Tech */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Backend Stack</span>
                <div className="flex flex-wrap gap-1">
                  {backendOptions.map(t => {
                    const isActive = selectedTechs.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => handleToggleTech(t)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition duration-100 ${
                          isActive
                            ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-350'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Database Tech */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Database Stack</span>
                <div className="flex flex-wrap gap-1">
                  {databaseOptions.map(t => {
                    const isActive = selectedTechs.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => handleToggleTech(t)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition duration-100 ${
                          isActive
                            ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-350'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Supporting Tech */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Supporting / Libraries</span>
                <div className="flex flex-wrap gap-1">
                  {supportingOptions.map(t => {
                    const isActive = selectedTechs.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => handleToggleTech(t)}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition duration-100 ${
                          isActive
                            ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-350'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </aside>

          {/* Main Grid View */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Search, Sort, and Quick Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-card-bg p-4 rounded-3xl border border-slate-200 dark:border-slate-card-border/80 shadow-sm w-full">
              {/* Search box */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
                <input
                  key="projects-search-input"
                  type="text"
                  placeholder="Search project titles, problem statements, tags..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-2xl text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-primary"
                />
              </div>

              {/* Sort By and Info */}
              <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold whitespace-nowrap">
                  <ArrowUpDown size={14} />
                  <span>Sort By:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-800 dark:text-slate-300 focus:outline-none"
                >
                  <option value="relevance">Relevance Score</option>
                  <option value="difficulty-asc">Difficulty (Easy First)</option>
                  <option value="difficulty-desc">Difficulty (Hard First)</option>
                  <option value="title-asc">Project Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active filters summary */}
            {(selectedBranch !== 'All' || selectedDifficulty !== 'All' || selectedCategory !== 'All' || selectedTechs.length > 0 || searchQuery !== '') && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 bg-indigo-primary/5 border border-indigo-primary/10 px-4 py-3 rounded-2xl">
                <span>Active Filters:</span>
                {selectedBranch !== 'All' && <span className="px-2 py-0.5 bg-indigo-primary/10 text-indigo-primary rounded-lg uppercase text-[10px] font-black">{selectedBranch}</span>}
                {selectedDifficulty !== 'All' && <span className="px-2 py-0.5 bg-indigo-primary/10 text-indigo-primary rounded-lg uppercase text-[10px] font-black">{selectedDifficulty}</span>}
                {selectedCategory !== 'All' && <span className="px-2 py-0.5 bg-indigo-primary/10 text-indigo-primary rounded-lg uppercase text-[10px] font-black">{selectedCategory}</span>}
                {selectedTechs.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black">{t}</span>
                ))}
                {searchQuery !== '' && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-dark-bg text-slate-650 rounded-lg text-[10px] font-bold">"{searchQuery}"</span>}
                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-[10px] font-black text-rose-500 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedProjects.map((p) => {
                const isSaved = savedProjects.includes(p.id);
                const matchPct = p.relevanceScore;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleOpenDrawer(p)}
                    className="p-6 rounded-3xl border border-slate-200 dark:border-slate-card-border/80 bg-white dark:bg-slate-card-bg hover:border-indigo-primary/30 hover:shadow-lg dark:hover:shadow-indigo-950/10 hover:shadow-indigo-100/30 transition duration-200 flex flex-col justify-between relative cursor-pointer group"
                  >
                    <div className="space-y-4">
                      
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-indigo-primary dark:text-indigo-secondary uppercase tracking-widest">
                            {p.branch} · {p.teamSize}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white leading-relaxed group-hover:text-indigo-primary transition">
                            {p.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveProject(p.id);
                          }}
                          className={`p-2 rounded-xl border transition duration-150 shrink-0 ${
                            isSaved
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                              : 'border-slate-100 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isSaved ? "Saved to Library" : "Save Project"}
                        >
                          <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                        </button>
                      </div>

                      {/* Relevance match block */}
                      {selectedTechs.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-indigo-primary/5 dark:bg-indigo-primary/10 border border-indigo-primary/10 text-[10px] space-y-1.5">
                          <div className="flex items-center justify-between font-black text-indigo-primary dark:text-indigo-secondary">
                            <span className="flex items-center gap-1">
                              <Layers size={12} /> Tech Match Score:
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                              matchPct >= 80
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : matchPct >= 40
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-slate-200 dark:bg-slate-card-border text-slate-500'
                            }`}>
                              {matchPct}% Match
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-450 font-bold leading-normal">
                            {p.whyMatched}
                          </p>
                        </div>
                      )}

                      {/* Difficulty & Categories Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                          p.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : p.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : p.difficulty === 'Hard'
                            ? 'bg-rose-500/10 text-rose-500'
                            : p.difficulty === 'Very Hard'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-indigo-500/10 text-indigo-primary'
                        }`}>
                          {p.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-dark-bg text-slate-500 border border-slate-200/40 dark:border-slate-card-border/50">
                          {p.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-indigo-primary/10 text-indigo-primary dark:text-indigo-secondary">
                          {p.budget} Budget
                        </span>
                      </div>

                      {/* Problem summary */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                        {p.problemStatement}
                      </p>

                      {/* Tech stack badges preview */}
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:border-slate-card-border/40">
                        {p.technologiesUsed.map((t) => {
                          const isMatched = selectedTechs.includes(t);
                          return (
                            <span
                              key={t}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                isMatched
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : 'bg-slate-50 dark:bg-slate-dark-bg border border-slate-200/50 dark:border-slate-card-border/40 text-slate-500'
                              }`}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>

                    </div>

                    {/* View Details Hook */}
                    <div className="w-full flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-card-border/40 text-xs font-black text-indigo-primary dark:text-indigo-secondary group-hover:text-indigo-secondary transition">
                      <span>View Project Blueprint</span>
                      <ChevronDown size={14} className="transform -rotate-90 group-hover:translate-x-0.5 transition" />
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Empty Search States */}
            {sortedProjects.length === 0 && (
              <div className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-card-border rounded-3xl bg-slate-500/5 space-y-3">
                <Share2 size={32} className="mx-auto text-slate-400 animate-bounce" />
                <h3 className="font-black text-sm text-slate-800 dark:text-white">No engineering projects found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto">
                  Try adjusting your keywords, selecting a different branch, or resetting the technology stack filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white text-xs font-black rounded-xl shadow transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Results Count Footer */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-card-bg p-4 rounded-2xl border border-slate-200 dark:border-slate-card-border/80 text-xs font-bold text-slate-500 w-full shadow-sm">
              <span>Showing {sortedProjects.length} of {baseProjects.length} projects</span>
            </div>

          </div>

        </div>
      ) : (
        /* Dedicated AI Prompt Studio View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn text-left">
          
          {/* Customizer Sidebar Configuration */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-6 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-card-border/50 pb-2">
              <Terminal size={15} className="text-indigo-primary" />
              Prompt Customizer
            </span>

            {/* Select Target Project (Custom Searchable Combobox) */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">1. Target Project Idea</label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search projects..."
                  value={studioSearchInput}
                  onChange={(e) => {
                    setStudioSearchInput(e.target.value);
                    setIsStudioDropdownOpen(true);
                  }}
                  onFocus={() => setIsStudioDropdownOpen(true)}
                  onBlur={() => {
                    // Short delay to allow clicking options before closing
                    setTimeout(() => setIsStudioDropdownOpen(false), 250);
                  }}
                  className="w-full pl-3 pr-8 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-indigo-primary"
                />
                <ChevronDown size={14} className={`absolute right-3 top-2.5 text-slate-400 pointer-events-none transition-transform duration-200 ${isStudioDropdownOpen ? 'transform rotate-180' : ''}`} />
              </div>

              {isStudioDropdownOpen && (
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border rounded-xl shadow-lg">
                  {studioFilteredProjects.length > 0 ? (
                    studioFilteredProjects.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setStudioProjectId(p.id);
                          setStudioSearchInput(p.title);
                          setIsStudioDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 block truncate ${
                          p.id === studioProjectId
                            ? 'bg-indigo-primary text-white'
                            : 'hover:bg-indigo-primary/10 dark:hover:bg-indigo-primary/20 text-slate-850 dark:text-slate-250'
                        }`}
                      >
                        {p.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-rose-500 font-bold">
                      No matching projects found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customize Target Framework */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">2. Target Language / Framework</label>
              <select
                value={customFramework}
                onChange={(e) => setCustomFramework(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
              >
                <option value="React + Vite + TS">React (TypeScript)</option>
                <option value="Next.js App Router">Next.js (App Router)</option>
                <option value="Vue.js + Node">Vue.js + Node backend</option>
                <option value="HTML / CSS / JavaScript">Vanilla HTML / CSS / JS</option>
                <option value="Python + Flask">Flask / Python backend</option>
              </select>
            </div>

            {/* Customize Styling Theme */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">3. Visual Interface Theme</label>
              <select
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg rounded-xl text-xs font-bold text-slate-850 dark:text-slate-350 focus:outline-none"
              >
                <option value="Glassmorphism dark theme with purple neon glow accents">Glassmorphic Dark Neon</option>
                <option value="Sleek, corporate enterprise dashboard with tailwind colors">Clean Slate Enterprise</option>
                <option value="Minimalist light theme with harmonious outfit font grids">Minimalist Light Theme</option>
                <option value="Retro-terminal design layout with green monospace fonts">Retro Hacker Terminal</option>
              </select>
            </div>

            {/* Select Prompt target variant */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-card-border/60 pt-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">4. AI Agent Variant</label>
              <div className="grid grid-cols-2 gap-2">
                {(['antigravity', 'cursor', 'base44', 'claude', 'generic'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setPromptVariant(v)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition uppercase duration-150 ${
                      promptVariant === v
                        ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-dark-bg text-slate-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt Preview Terminal Workspace */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 text-slate-300 border border-slate-800 space-y-6 shadow-xl relative min-h-[500px] flex flex-col justify-between font-mono">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Terminal size={14} /> prompt_studio_v1.0.sh
                </span>
                <button
                  onClick={() => handleCopyToClipboard(generatedStudioPrompt, 'studio')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 text-[10px] font-black text-white flex items-center gap-1.5 transition"
                >
                  {copiedTextId === 'studio' ? (
                    <>
                      <Check size={12} className="text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Workspace Prompt
                    </>
                  )}
                </button>
              </div>

              {/* Render dynamic generated prompt content */}
              {studioProject ? (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 overflow-y-auto max-h-[400px]">
                  <pre className="text-[11px] whitespace-pre-wrap leading-relaxed select-all">
                    {generatedStudioPrompt}
                  </pre>
                </div>
              ) : (
                <div className="py-24 text-center text-xs text-slate-600">
                  Select a project idea to generate the prompt template.
                </div>
              )}
            </div>

            <div className="text-[9px] text-slate-650 pt-4 border-t border-slate-850">
              * Copy this prompt directly and paste into your AI code builder. The prompt is structured to enforce edge cases, validations, loading screens, and layout responsiveness.
            </div>
          </div>

        </div>
      )}

      {/* Premium Slide-over Drawer for project detail views */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn select-text">
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body container */}
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-card-bg border-l border-slate-200 dark:border-slate-card-border/80 shadow-2xl flex flex-col justify-between z-10 animate-slideLeft">
            
            {/* Header info */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-card-border/60 flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-primary/10 text-indigo-primary dark:text-indigo-secondary text-[10px] font-black uppercase">
                  {selectedProject.branch} · {selectedProject.category}
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-xl border border-slate-150 dark:border-slate-card-border text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Internal Drawer Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-card-border/40 px-6 bg-slate-50 dark:bg-slate-dark-bg/60">
              {([
                { id: 'brief', label: 'Brief' },
                { id: 'technical', label: 'Blueprint' },
                { id: 'roadmap', label: 'Roadmap' },
                { id: 'career', label: 'Career Kit' },
                { id: 'prompts', label: 'AI Prompts' }
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-black border-b-2 transition duration-150 ${
                    drawerActiveTab === tab.id
                      ? 'border-indigo-primary text-indigo-primary dark:text-indigo-secondary'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable contents drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
              
              {drawerActiveTab === 'brief' && (
                <div className="space-y-6">
                  {/* Problem statement */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Problem Statement</span>
                    <p className="bg-slate-50 dark:bg-slate-dark-bg/50 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-card-border/40 font-medium">
                      {selectedProject.problemStatement}
                    </p>
                  </div>

                  {/* Objective */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Project Objective</span>
                    <p className="font-medium">{selectedProject.objective}</p>
                  </div>

                  {/* Why it matters */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Why it Matters</span>
                    <p className="font-medium">{selectedProject.whyItMatters}</p>
                  </div>

                  {/* Target Users */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Target Users</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.targetUsers?.map(u => (
                        <span key={u} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-dark-bg text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Readiness rating bar */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-card-border/60 pt-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Curriculum Feasibility Rating</span>
                      <span>{selectedProject.completionLevelIndicator}% Feasible</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-dark-bg overflow-hidden">
                      <div
                        className="h-full bg-indigo-primary rounded-full transition-all duration-300"
                        style={{ width: `${selectedProject.completionLevelIndicator}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {drawerActiveTab === 'technical' && (
                <div className="space-y-6">
                  {/* Technology Used */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Technologies Configured</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologiesUsed.map(t => (
                        <span key={t} className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/15">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Architecture */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-primary" />
                      Suggested Architecture Diagram
                    </span>
                    <pre className="p-4 bg-slate-950 text-slate-300 border border-slate-850 rounded-2xl font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {selectedProject.suggestedArchitecture}
                    </pre>
                  </div>

                  {/* Database Schema */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center gap-1.5">
                      <Database size={14} className="text-indigo-primary" />
                      Suggested Database Schema
                    </span>
                    <pre className="p-4 bg-slate-950 text-slate-300 border border-slate-850 rounded-2xl font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {selectedProject.suggestedDatabaseSchema}
                    </pre>
                  </div>

                  {/* Core components */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Suggested Core UI Components</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 font-semibold">
                      {selectedProject.suggestedComponents?.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* API list */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">API Routings Configuration</span>
                    <div className="space-y-1.5">
                      {selectedProject.suggestedAPIs?.map((api, i) => (
                        <div key={i} className="p-2 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-200/50 dark:border-slate-card-border/40 rounded-xl font-mono text-[10px]">
                          {api}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {drawerActiveTab === 'roadmap' && (
                <div className="space-y-6">
                  {/* Step-by-step roadmap */}
                  <div className="space-y-3">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Implementation Roadmap</span>
                    <div className="space-y-3">
                      {selectedProject.implementationSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-indigo-primary/10 text-indigo-primary dark:text-indigo-secondary flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-slate-650 dark:text-slate-350 font-medium pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edge Cases */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-card-border/60 pt-4">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center gap-1.5">
                      <Wrench size={14} className="text-indigo-primary" /> Validation and Edge Cases
                    </span>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                      {selectedProject.validationEdgeCases?.map((ec, i) => (
                        <li key={i}>{ec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Error handling */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Error Handling Policies</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 font-semibold">
                      {selectedProject.errorHandlingPlan?.map((eh, i) => (
                        <li key={i}>{eh}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {drawerActiveTab === 'career' && (
                <div className="space-y-6">
                  {/* Resume bullet points */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center gap-1.5">
                      <Award size={14} className="text-indigo-primary" /> Resume Bullet Points
                    </span>
                    <div className="space-y-2">
                      {selectedProject.resumeTalkingPoints?.map((p, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-slate-dark-bg/60 border border-slate-150 dark:border-slate-card-border/40 rounded-xl font-medium">
                          • {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Questions */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-card-border/60 pt-4">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center gap-1.5">
                      <Info size={14} className="text-indigo-primary" /> Key Interview Questions to Prepare
                    </span>
                    <div className="space-y-2 font-medium">
                      {selectedProject.interviewQuestions?.map((q, i) => (
                        <div key={i} className="p-2.5 bg-indigo-primary/5 rounded-xl border border-indigo-primary/10">
                          <span className="font-black text-indigo-primary block text-[10px]">QUESTION {i+1}</span>
                          <span className="text-slate-650 dark:text-slate-350">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested deployment */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Suggested Deployment Framework</span>
                    <p className="font-medium">{selectedProject.suggestedDeployment}</p>
                  </div>
                </div>
              )}

              {drawerActiveTab === 'prompts' && (
                <div className="space-y-6">
                  {/* Agent select buttons */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs block">Select Target Agent Framework</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['antigravity', 'cursor', 'base44', 'claude', 'generic'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => setPromptVariant(v)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition uppercase duration-150 ${
                            promptVariant === v
                              ? 'bg-indigo-primary border-indigo-primary text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-card-border/80 bg-slate-50 dark:bg-slate-dark-bg text-slate-500'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code prompt block */}
                  <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-850 font-mono text-[10px] relative">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-3">
                      <span className="text-indigo-400">copilot_agent_{promptVariant}.txt</span>
                      <button
                        onClick={() => {
                          const pText = 
                            promptVariant === 'antigravity' ? selectedProject.promptAntigravity :
                            promptVariant === 'cursor' ? selectedProject.promptCursor :
                            promptVariant === 'base44' ? selectedProject.promptBase44 :
                            promptVariant === 'claude' ? selectedProject.promptClaude :
                            selectedProject.promptGeneric;
                          handleCopyToClipboard(pText || '', 'drawer');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-[9px] font-black text-white flex items-center gap-1 transition"
                      >
                        {copiedTextId === 'drawer' ? (
                          <>
                            <Check size={11} className="text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={11} /> Copy Prompt
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="text-slate-350 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap select-all">
                      {promptVariant === 'antigravity' ? selectedProject.promptAntigravity :
                       promptVariant === 'cursor' ? selectedProject.promptCursor :
                       promptVariant === 'base44' ? selectedProject.promptBase44 :
                       promptVariant === 'claude' ? selectedProject.promptClaude :
                       selectedProject.promptGeneric}
                    </pre>
                  </div>
                </div>
              )}

            </div>

            {/* Footer triggers */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-card-border/60 bg-slate-50 dark:bg-slate-dark-bg/60 flex justify-between items-center">
              <button
                onClick={() => {
                  toggleSaveProject(selectedProject.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border transition duration-150 ${
                  savedProjects.includes(selectedProject.id)
                    ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-card-border bg-white dark:bg-slate-card-bg text-slate-700 dark:text-slate-350 hover:bg-slate-50'
                }`}
              >
                <Bookmark size={14} className={savedProjects.includes(selectedProject.id) ? 'fill-current' : ''} />
                {savedProjects.includes(selectedProject.id) ? 'Saved' : 'Save Project'}
              </button>

              <button
                onClick={() => {
                  setStudioProjectId(selectedProject.id);
                  setActiveTab('promptStudio');
                  setSelectedProject(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-primary hover:bg-indigo-secondary text-white text-xs font-black rounded-xl shadow-md transition"
              >
                <Terminal size={14} />
                Open in Studio
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectGenerator;
