import React, { useState, useEffect, useRef } from 'react';
import { useApp, StudyTask, Subject, Exam } from '../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Flame,
  Award,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  Clock,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ExamStrategy } from '../components/exam-plan/ExamStrategy';

interface StudyPlannerProps {
  activeTab?: 'tasks' | 'syllabus' | 'exams' | 'pomodoro' | 'strategy';
  setActiveTab?: (tab: 'tasks' | 'syllabus' | 'exams' | 'pomodoro' | 'strategy') => void;
}


export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab
}) => {
  const {
    studyTasks,
    subjects,
    exams,
    addStudyTask,
    toggleStudyTask,
    deleteStudyTask,
    addSubject,
    updateSubjectUnits,
    deleteSubject,
    addExam,
    deleteExam
  } = useApp();

  const [localActiveTab, setLocalActiveTab] = useState<'tasks' | 'syllabus' | 'exams' | 'pomodoro' | 'strategy'>('tasks');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : localActiveTab;
  const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : setLocalActiveTab;

  // Form states
  const [taskSubject, setTaskSubject] = useState('');
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subTotalUnits, setSubTotalUnits] = useState(5);
  const [subGoal, setSubGoal] = useState('A+');
  const [subCredits, setSubCredits] = useState(3);

  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examType, setExamType] = useState('CIE-1');

  // Pomodoro States
  const [timerDuration, setTimerDuration] = useState(1500); // 25 min default
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  // Pomodoro custom scheduler states
  const [totalSessionMin, setTotalSessionMin] = useState(120);
  const [focusIntervalMin, setFocusIntervalMin] = useState(25);
  const [breakIntervalMin, setBreakIntervalMin] = useState(5);
  const [scheduleSteps, setScheduleSteps] = useState<{ id: string; type: 'focus' | 'break'; duration: number; name: string }[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Ambient Sounds States
  const [activeSound, setActiveSound] = useState<string>('none');
  const [volume, setVolume] = useState<number>(0.3); // 30% default

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const activeIntervalsRef = useRef<any[]>([]);

  // Helper to generate schedule steps
  const generateSchedule = (total: number, focus: number, breakT: number) => {
    const steps: { id: string; type: 'focus' | 'break'; duration: number; name: string }[] = [];
    let remaining = total;
    let cycleCount = 1;
    const cycleDuration = focus + breakT;

    while (remaining > 0) {
      if (remaining <= cycleDuration) {
        steps.push({
          id: `focus-final`,
          type: 'focus',
          duration: remaining * 60,
          name: `Final Focus Session (${remaining}m)`
        });
        break;
      }

      steps.push({
        id: `focus-${cycleCount}`,
        type: 'focus',
        duration: focus * 60,
        name: `Focus Session ${cycleCount} (${focus}m)`
      });
      remaining -= focus;

      if (remaining > 0) {
        steps.push({
          id: `break-${cycleCount}`,
          type: 'break',
          duration: breakT * 60,
          name: `Break ${cycleCount} (${breakT}m)`
        });
        remaining -= breakT;
      }
      cycleCount++;
    }
    return steps;
  };

  const handleApplyScheduleSettings = () => {
    const newSteps = generateSchedule(totalSessionMin, focusIntervalMin, breakIntervalMin);
    setScheduleSteps(newSteps);
    setCurrentStepIndex(0);
    setIsRunning(false);
    if (newSteps.length > 0) {
      setTimerDuration(newSteps[0].duration);
      setTimeLeft(newSteps[0].duration);
      setTimerMode(newSteps[0].type);
    }
  };

  // Timer runner sequentially steps through the schedule
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < scheduleSteps.length) {
        const nextStep = scheduleSteps[nextIndex];
        alert(`Step completed! Transitioning to: ${nextStep.name}`);
        setCurrentStepIndex(nextIndex);
        setTimerMode(nextStep.type);
        setTimerDuration(nextStep.duration);
        setTimeLeft(nextStep.duration);
        setIsRunning(true); // Auto-start the next step
      } else {
        alert("🎉 Congratulations! Your entire study session schedule is complete!");
        setCurrentStepIndex(0);
        if (scheduleSteps.length > 0) {
          setTimeLeft(scheduleSteps[0].duration);
          setTimerDuration(scheduleSteps[0].duration);
          setTimerMode(scheduleSteps[0].type);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentStepIndex, scheduleSteps]);

  // Auto-generate initial schedule and set defaults
  useEffect(() => {
    const initialSteps = generateSchedule(totalSessionMin, focusIntervalMin, breakIntervalMin);
    setScheduleSteps(initialSteps);
    if (initialSteps.length > 0) {
      setTimerDuration(initialSteps[0].duration);
      setTimeLeft(initialSteps[0].duration);
      setTimerMode(initialSteps[0].type);
    }
  }, []);

  // Set default subject values on load
  useEffect(() => {
    if (subjects.length > 0 && !taskSubject) {
      setTaskSubject(subjects[0].name);
      setExamSubject(subjects[0].name);
    }
  }, [subjects]);

  // Cleanup Web Audio nodes on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  // Update volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Web Audio Synthesizer Logic
  const startAmbientSound = (
    soundType:
      | 'rain'
      | 'lofi'
      | 'white'
      | 'campfire'
      | 'ocean'
      | 'wind'
      | 'airplane'
      | 'train'
      | 'pink'
      | 'brown'
      | 'space'
      | 'clock'
      | 'meditation'
      | 'binaural'
      | 'mask'
      | 'piano'
  ) => {
    try {
      // 1. Initialize Audio Context
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context if suspended (browser security requirement)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Stop previous nodes
      stopAmbientSound();

      const ctx = audioCtxRef.current;

      // Master Gain
      const mainGain = ctx.createGain();
      mainGain.gain.value = volume;
      mainGain.connect(ctx.destination);
      gainNodeRef.current = mainGain;

      // Nested helper to generate White Noise source
      const createWhiteNoiseSource = (audioCtx: AudioContext) => {
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const sourceNode = audioCtx.createBufferSource();
        sourceNode.buffer = noiseBuffer;
        sourceNode.loop = true;
        return sourceNode;
      };

      if (soundType === 'white') {
        const source = createWhiteNoiseSource(ctx);
        source.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source);
      } else if (soundType === 'pink') {
        const source = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        source.connect(filter);
        filter.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source, filter);
      } else if (soundType === 'brown') {
        const source = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        source.connect(filter);
        filter.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source, filter);
      } else if (soundType === 'rain') {
        const source = createWhiteNoiseSource(ctx);
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 900;
        bandpass.Q.value = 1.0;
        
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 600;
        
        source.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source, bandpass, lowpass);
      } else if (soundType === 'campfire') {
        const source = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 180;
        const bgGain = ctx.createGain();
        bgGain.gain.value = 0.5;
        
        source.connect(filter);
        filter.connect(bgGain);
        bgGain.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source, filter, bgGain);

        const intervalId = setInterval(() => {
          if (Math.random() > 0.45) {
            const osc = ctx.createOscillator();
            const popGain = ctx.createGain();
            osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(1000 + Math.random() * 2500, ctx.currentTime);
            
            popGain.gain.setValueAtTime(Math.random() * 0.12 + 0.03, ctx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01 + Math.random() * 0.02);
            
            osc.connect(popGain);
            popGain.connect(mainGain);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }
        }, 70);
        activeIntervalsRef.current.push(intervalId);
      } else if (soundType === 'lofi') {
        const source = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 160;
        const bgGain = ctx.createGain();
        bgGain.gain.value = 0.6;
        
        source.connect(filter);
        filter.connect(bgGain);
        bgGain.connect(mainGain);
        source.start();
        activeNodesRef.current.push(source, filter, bgGain);

        const intervalId = setInterval(() => {
          if (Math.random() > 0.75) {
            const osc = ctx.createOscillator();
            const clinkGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1500 + Math.random() * 1500, ctx.currentTime);
            
            clinkGain.gain.setValueAtTime(0.006, ctx.currentTime);
            clinkGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15 + Math.random() * 0.2);
            
            osc.connect(clinkGain);
            clinkGain.connect(mainGain);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          }
        }, 250);
        activeIntervalsRef.current.push(intervalId);
      } else if (soundType === 'ocean') {
        const noise = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.35;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        lfo.type = 'sine';

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3;

        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);

        noise.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(mainGain);

        noise.start();
        lfo.start();

        activeNodesRef.current.push(noise, filter, waveGain, lfo, lfoGain);
      } else if (soundType === 'wind') {
        const noise = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 2.0;
        filter.frequency.value = 500;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.08;
        lfo.type = 'sine';

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 200;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(mainGain);

        noise.start();
        lfo.start();

        activeNodesRef.current.push(noise, filter, lfo, lfoGain);
      } else if (soundType === 'airplane') {
        const noise = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 90;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 60;

        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.35;

        noise.connect(filter);
        filter.connect(mainGain);

        osc.connect(oscGain);
        oscGain.connect(mainGain);

        noise.start();
        osc.start();

        activeNodesRef.current.push(noise, filter, osc, oscGain);
      } else if (soundType === 'train') {
        const intervalId = setInterval(() => {
          const now = ctx.currentTime;
          
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(110, now);
          gain1.gain.setValueAtTime(0.08, now);
          gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
          osc1.connect(gain1);
          gain1.connect(mainGain);
          osc1.start(now);
          osc1.stop(now + 0.1);
          
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(95, now + 0.15);
          gain2.gain.setValueAtTime(0.06, now + 0.15);
          gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15 + 0.08);
          osc2.connect(gain2);
          gain2.connect(mainGain);
          osc2.start(now + 0.15);
          osc2.stop(now + 0.15 + 0.1);
          
          const noise = createWhiteNoiseSource(ctx);
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 130;
          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.14, now);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          noise.connect(filter);
          filter.connect(nGain);
          nGain.connect(mainGain);
          noise.start(now);
          noise.stop(now + 0.3);
        }, 650);
        activeIntervalsRef.current.push(intervalId);
      } else if (soundType === 'space') {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.value = 110;

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = 110.5;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 3.5;
        filter.frequency.value = 250;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05;
        lfo.type = 'sine';

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const spaceGain = ctx.createGain();
        spaceGain.gain.value = 0.25;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(spaceGain);
        spaceGain.connect(mainGain);

        osc1.start();
        osc2.start();
        lfo.start();

        activeNodesRef.current.push(osc1, osc2, filter, lfo, lfoGain, spaceGain);
      } else if (soundType === 'clock') {
        let tickCount = 0;
        const intervalId = setInterval(() => {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const clickGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          filter.type = 'highpass';
          filter.frequency.value = 2000;
          
          osc.type = 'triangle';
          const freq = tickCount % 2 === 0 ? 1800 : 1400;
          osc.frequency.setValueAtTime(freq, now);
          
          clickGain.gain.setValueAtTime(0.08, now);
          clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
          
          osc.connect(filter);
          filter.connect(clickGain);
          clickGain.connect(mainGain);
          
          osc.start(now);
          osc.stop(now + 0.04);
          
          tickCount++;
        }, 1000);
        activeIntervalsRef.current.push(intervalId);
      } else if (soundType === 'meditation') {
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 75;

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 150;

        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = 225;

        const swellGain = ctx.createGain();
        swellGain.gain.value = 0.3;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.07;
        lfo.type = 'sine';

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.15;

        lfo.connect(lfoGain);
        lfoGain.connect(swellGain.gain);

        osc1.connect(swellGain);
        osc2.connect(swellGain);
        osc3.connect(swellGain);
        swellGain.connect(mainGain);

        osc1.start();
        osc2.start();
        osc3.start();
        lfo.start();

        activeNodesRef.current.push(osc1, osc2, osc3, swellGain, lfo, lfoGain);
      } else if (soundType === 'binaural') {
        const oscL = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.value = 200;

        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.value = 240;

        const merger = ctx.createChannelMerger(2);

        const gainL = ctx.createGain();
        gainL.gain.value = 0.4;

        const gainR = ctx.createGain();
        gainR.gain.value = 0.4;

        oscL.connect(gainL);
        oscR.connect(gainR);

        gainL.connect(merger, 0, 0);
        gainR.connect(merger, 0, 1);

        merger.connect(mainGain);

        oscL.start();
        oscR.start();

        activeNodesRef.current.push(oscL, oscR, gainL, gainR, merger);
      } else if (soundType === 'mask') {
        const noise = createWhiteNoiseSource(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;

        noise.connect(filter);
        filter.connect(mainGain);

        noise.start();

        activeNodesRef.current.push(noise, filter);
      } else if (soundType === 'piano') {
        const chords = [
          [220, 261, 329], // Am
          [174, 220, 261], // F
          [130, 164, 190], // C
          [196, 246, 293]  // G
        ];
        let chordIndex = 0;

        const playChord = () => {
          const now = ctx.currentTime;
          const currentChord = chords[chordIndex];
          
          currentChord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
            oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
            
            osc.connect(oscGain);
            oscGain.connect(mainGain);
            
            osc.start(now);
            osc.stop(now + 2.95);
          });
          
          chordIndex = (chordIndex + 1) % chords.length;
        };

        playChord();

        const pianoInterval = setInterval(playChord, 3000);
        activeIntervalsRef.current.push(pianoInterval);
      }

      setActiveSound(soundType);

    } catch (e) {
      console.error('Failed to initialize Web Audio Synthesizer:', e);
      setActiveSound('none');
    }
  };

  const stopAmbientSound = () => {
    activeIntervalsRef.current.forEach((id) => clearInterval(id));
    activeIntervalsRef.current = [];

    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) {
          node.stop();
        }
      } catch (err) {}
      try {
        node.disconnect();
      } catch (err) {}
    });
    activeNodesRef.current = [];

    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch (err) {}
      try {
        noiseSourceRef.current.disconnect();
      } catch (err) {}
      noiseSourceRef.current = null;
    }
    if (filterNodeRef.current) {
      try {
        filterNodeRef.current.disconnect();
      } catch (err) {}
      filterNodeRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (err) {}
      gainNodeRef.current = null;
    }
    setActiveSound('none');
  };

  const handleToggleSound = (
    sound:
      | 'rain'
      | 'lofi'
      | 'white'
      | 'campfire'
      | 'ocean'
      | 'wind'
      | 'airplane'
      | 'train'
      | 'pink'
      | 'brown'
      | 'space'
      | 'clock'
      | 'meditation'
      | 'binaural'
      | 'mask'
      | 'piano'
  ) => {
    if (activeSound === sound) {
      stopAmbientSound();
    } else {
      startAmbientSound(sound);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim() || !taskSubject) return;
    addStudyTask({
      subject: taskSubject,
      task: taskText.trim(),
      priority: taskPriority,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0]
    });
    setTaskText('');
    setTaskDueDate('');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;
    addSubject({
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      totalUnits: Number(subTotalUnits),
      goalGrade: subGoal,
      credits: Number(subCredits)
    });
    setSubName('');
    setSubCode('');
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate || !examSubject) return;
    addExam({
      subject: examSubject,
      date: examDate,
      type: examType
    });
    setExamDate('');
  };

  const handleStartTimer = (duration: number, mode: 'focus' | 'break') => {
    setIsRunning(false);
    setTimerDuration(duration);
    setTimeLeft(duration);
    setTimerMode(mode);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 3. AI Smart Advisor Logic
  const getAIAdvice = () => {
    const pendingCount = studyTasks.filter((t) => !t.completed).length;
    
    // Nearest exam
    const nearest = exams
      .map((ex) => {
        const days = Math.ceil((new Date(ex.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return { ...ex, days };
      })
      .filter((ex) => ex.days >= 0)
      .sort((a, b) => a.days - b.days)[0];

    if (!nearest) {
      return {
        workload: 'Light',
        hours: '1.5 - 2 Hours',
        advice: 'No exams are scheduled soon. Focus on daily revisions and logging class notes to stay ahead.',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      };
    }

    if (nearest.days <= 3) {
      return {
        workload: 'Critical',
        hours: '5 - 6 Hours',
        advice: `Exam "${nearest.type}" for ${nearest.subject} is in ${nearest.days} days! Restructure tasks to prioritize revisions of completed units immediately and minimize distractions.`,
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      };
    }

    if (nearest.days <= 10) {
      return {
        workload: 'Heavy',
        hours: '3 - 4 Hours',
        advice: `Your nearest exam starts in ${nearest.days} days. Spend 1 hour resolving pending assignments and 2 hours reviewing units 3 & 4.`,
        color: 'text-orange-accent bg-orange-accent/10 border-orange-accent/20'
      };
    }

    return {
      workload: 'Moderate',
      hours: '2 - 3 Hours',
      advice: `Nearest exam is in ${nearest.days} days. Keep completing daily syllabus units and complete tasks marked "High" priority.`,
      color: 'text-indigo-primary bg-indigo-primary/10 border-indigo-primary/20'
    };
  };

  const advice = getAIAdvice();

  // Syllabus Completion Graph Data
  const syllabusGraphData = subjects.map((sub) => ({
    name: sub.code,
    'Completed Units': sub.unitsCompleted,
    'Remaining Units': sub.totalUnits - sub.unitsCompleted
  }));

  return (
    <div className="space-y-6 pb-20 md:pb-6 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Smart Study Planner</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personalized timeline schedule, chapters tracker, and workload optimizer.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/50 dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border p-1 rounded-2xl gap-1.5 overflow-x-auto shrink-0 select-none">
          {['tasks', 'syllabus', 'exams', 'pomodoro', 'strategy'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-primary text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'pomodoro'
                ? 'Pomodoro & Focus Room'
                : tab === 'strategy'
                ? 'Exam Prep Strategy'
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* AI advisor widget */}
      <div className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${advice.color}`}>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <h4 className="text-xs font-black uppercase tracking-wider">AI Workload Advice</h4>
          </div>
          <p className="text-xs font-medium leading-relaxed">{advice.advice}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 md:border-l border-slate-300/20 md:pl-6">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Workload Status</div>
            <div className="text-lg font-black text-slate-800 dark:text-white">{advice.workload}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Recommended Study</div>
            <div className="text-lg font-black text-slate-800 dark:text-white">{advice.hours}</div>
          </div>
        </div>
      </div>

      {/* Screens Panels */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily study task adder */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4">Add Study Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject</label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                  {subjects.length === 0 && <option value="">No subjects - Add one first</option>}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Task Details</label>
                <input
                  type="text"
                  placeholder="e.g. Revise unit 2 coding loops..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={subjects.length === 0}
                className="w-full py-3 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition duration-200 disabled:opacity-50"
              >
                <Plus size={16} /> Create Task
              </button>
            </form>
          </div>

          {/* Daily study task lists */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Daily Study Checklist</h3>
            
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {studyTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-200 ${
                    t.completed
                      ? 'bg-slate-100/30 dark:bg-slate-dark-bg/30 border-slate-100 dark:border-slate-card-border/30 opacity-70'
                      : 'bg-slate-50 dark:bg-slate-dark-bg border-slate-200 dark:border-slate-card-border'
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <button
                      onClick={() => toggleStudyTask(t.id)}
                      className={`shrink-0 transition-colors duration-200 ${
                        t.completed ? 'text-indigo-primary' : 'text-slate-400 dark:text-slate-505 hover:text-slate-200'
                      }`}
                    >
                      {t.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div className="overflow-hidden">
                      <span className={`text-xs font-bold block truncate ${t.completed ? 'line-through text-slate-400' : 'text-slate-805 dark:text-slate-205'}`}>
                        {t.task}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{t.subject}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-tight ${
                      t.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-500'
                        : t.priority === 'Medium'
                        ? 'bg-orange-accent/10 text-orange-accent'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {t.priority}
                    </span>
                    <button
                      onClick={() => deleteStudyTask(t.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition duration-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {studyTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                  No daily study tasks added yet. Fill the left form to schedule one!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Subject panel */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4">Add Course Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Microprocessors..."
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-402"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Goal Grade</label>
                  <select
                    value={subGoal}
                    onChange={(e) => setSubGoal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none font-bold"
                  >
                    <option value="S">S (Outstanding)</option>
                    <option value="A+">A+ (Excellent)</option>
                    <option value="A">A (Very Good)</option>
                    <option value="B">B (Good)</option>
                    <option value="C">C (Pass)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Units</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subTotalUnits}
                    onChange={(e) => setSubTotalUnits(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Credits</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={subCredits}
                    onChange={(e) => setSubCredits(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition duration-200"
              >
                <Plus size={16} /> Add Course
              </button>
            </form>
          </div>

          {/* Syllabus tracking bars & charts */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Syllabus Progress Tracker</h3>
              
              <div className="grid grid-cols-1 gap-4 max-h-[220px] overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const percent = Math.round((sub.unitsCompleted / sub.totalUnits) * 100);
                  return (
                    <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="overflow-hidden">
                        <span className="text-xs font-black text-slate-900 dark:text-white block truncate">{sub.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">{sub.code} | Goal Grade: <strong className="text-orange-accent">{sub.goalGrade}</strong></span>
                      </div>
                      
                      <div className="flex items-center gap-3.5 min-w-[180px]">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                            <span>Units: {sub.unitsCompleted}/{sub.totalUnits}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-card-border overflow-hidden">
                            <div className="h-full bg-indigo-primary" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                        
                        {/* +/- units buttons */}
                        <div className="flex gap-1 shrink-0">
                          <button
                            disabled={sub.unitsCompleted === 0}
                            onClick={() => updateSubjectUnits(sub.id, sub.unitsCompleted - 1)}
                            className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-dark-bg/80 border border-slate-300 dark:border-slate-card-border text-slate-600 dark:text-slate-400 hover:text-rose-500 font-black flex items-center justify-center text-sm disabled:opacity-30 disabled:pointer-events-none"
                          >
                            -
                          </button>
                          <button
                            disabled={sub.unitsCompleted === sub.totalUnits}
                            onClick={() => updateSubjectUnits(sub.id, sub.unitsCompleted + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-dark-bg/80 border border-slate-300 dark:border-slate-card-border text-slate-600 dark:text-slate-400 hover:text-indigo-primary font-black flex items-center justify-center text-sm disabled:opacity-30 disabled:pointer-events-none"
                          >
                            +
                          </button>
                          <button
                            onClick={() => deleteSubject(sub.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {subjects.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                    No course subjects tracked yet.
                  </div>
                )}
              </div>
            </div>

            {/* Recharts Syllabus breakdown */}
            {subjects.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Syllabus Stack Chart</h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={syllabusGraphData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#151c2c', borderColor: '#222e47', borderRadius: '12px' }}
                        labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                      />
                      <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                      <Bar dataKey="Completed Units" stackId="a" fill="#4f46e5" />
                      <Bar dataKey="Remaining Units" stackId="a" fill="#222e47" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add exam schedule */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border h-fit">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-4">Schedule Exam</h3>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject</label>
                <select
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                  {subjects.length === 0 && <option value="">No subjects - Add one first</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none font-bold"
                  >
                    <option value="CIE-1">CIE-1 (Internal 1)</option>
                    <option value="CIE-2">CIE-2 (Internal 2)</option>
                    <option value="Semester End">Semester End (SEE)</option>
                    <option value="Practical Lab">Practical / Lab Viva</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={subjects.length === 0}
                className="w-full py-3 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition duration-200 disabled:opacity-50"
              >
                <Calendar size={16} /> Schedule Exam
              </button>
            </form>
          </div>

          {/* Countdown List */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Exam Countdowns</h3>
            
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {exams.map((ex) => {
                const examDate = new Date(ex.date);
                const diffTime = examDate.getTime() - new Date().getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const overdue = diffDays < 0;

                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      overdue
                        ? 'bg-slate-100/30 dark:bg-slate-dark-bg/20 border-slate-200/40 opacity-50'
                        : diffDays <= 3
                        ? 'bg-rose-500/5 border-rose-500/30'
                        : 'bg-slate-55 dark:bg-slate-dark-bg border-slate-200 dark:border-slate-card-border'
                    }`}
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="text-xs font-black text-slate-805 dark:text-slate-200 block truncate">{ex.subject}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">{ex.type} | Date: {ex.date}</span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {!overdue ? (
                        <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-tight ${
                          diffDays <= 3 ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-primary/10 text-indigo-primary'
                        }`}>
                          {diffDays} days left
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-400">Overdue</span>
                      )}
                      
                      <button
                        onClick={() => deleteExam(ex.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {exams.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                  No exams scheduled. Add exams using the left panel.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pomodoro' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Pomodoro Focus Timer */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col items-center justify-center text-center space-y-6">
            <div className="flex items-center gap-2">
              <Timer className="text-indigo-primary" size={24} />
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Focus Timer</h3>
            </div>

            {/* Mode Badge */}
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              timerMode === 'focus' ? 'bg-indigo-primary/10 text-indigo-primary' : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              {timerMode === 'focus' ? 'Focus Mode' : 'Break Mode'}
            </span>

            {/* Time digits */}
            <h2 className="text-6xl font-black text-slate-900 dark:text-white font-mono tracking-tight select-none">
              {formatTime(timeLeft)}
            </h2>

            {/* Timer controls */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition duration-200 shadow-md ${
                  isRunning ? 'bg-orange-accent hover:bg-orange-hover' : 'bg-indigo-primary hover:bg-indigo-secondary'
                }`}
              >
                {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(timerDuration);
                }}
                className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-dark-bg border border-slate-200 dark:border-slate-card-border text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-center transition duration-200"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => handleStartTimer(1500, 'focus')}
                className="px-3 py-2 border border-slate-200 dark:border-slate-card-border text-[11px] font-extrabold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-700 dark:text-slate-300 font-sans"
              >
                25m Focus
              </button>
              <button
                onClick={() => handleStartTimer(3000, 'focus')}
                className="px-3 py-2 border border-slate-200 dark:border-slate-card-border text-[11px] font-extrabold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-700 dark:text-slate-300 font-sans"
              >
                50m Focus
              </button>
              <button
                onClick={() => handleStartTimer(300, 'break')}
                className="px-3 py-2 border border-slate-200 dark:border-slate-card-border text-[11px] font-extrabold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-700 dark:text-slate-300 font-sans"
              >
                5m Break
              </button>
              <button
                onClick={() => handleStartTimer(900, 'break')}
                className="px-3 py-2 border border-slate-200 dark:border-slate-card-border text-[11px] font-extrabold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-dark-bg text-slate-700 dark:text-slate-300 font-sans"
              >
                15m Break
              </button>
            </div>
          </div>

          {/* Column 2: Session Timeline Planner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="text-indigo-primary animate-pulse" size={20} />
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Timeline Planner</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                Divide your study block into custom focus and break cycles with trailing minute merging.
              </p>

              {/* Settings Form */}
              <div className="space-y-3 mb-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total (Min)</label>
                    <input
                      type="number"
                      min="1"
                      value={totalSessionMin}
                      onChange={(e) => setTotalSessionMin(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-bg bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Focus (Min)</label>
                    <input
                      type="number"
                      min="1"
                      value={focusIntervalMin}
                      onChange={(e) => setFocusIntervalMin(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-bg bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Break (Min)</label>
                    <input
                      type="number"
                      min="1"
                      value={breakIntervalMin}
                      onChange={(e) => setBreakIntervalMin(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-card-bg bg-slate-50 dark:bg-slate-dark-bg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-primary"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyScheduleSettings}
                  className="w-full py-2.5 rounded-xl bg-indigo-primary hover:bg-indigo-secondary text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition duration-200"
                >
                  <Sparkles size={14} /> Rebuild Timeline
                </button>
              </div>

              {/* Timeline list */}
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {scheduleSteps.map((step, idx) => {
                  const isActive = idx === currentStepIndex;
                  const isDone = idx < currentStepIndex;
                  
                  return (
                    <div
                      key={step.id}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'border-indigo-primary bg-indigo-primary/5 text-indigo-primary shadow-sm'
                          : isDone
                          ? 'border-slate-100 dark:border-slate-card-border/30 bg-slate-50/50 dark:bg-slate-dark-bg/20 text-slate-400 opacity-60'
                          : 'border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isActive
                            ? 'bg-indigo-primary text-white'
                            : isDone
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {isDone ? <Check size={10} /> : idx + 1}
                        </span>
                        <span className="truncate">{step.name}</span>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                        isActive
                          ? 'bg-indigo-primary/10 text-indigo-primary animate-pulse'
                          : isDone
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {isActive ? 'Active' : isDone ? 'Done' : 'Queued'}
                      </span>
                    </div>
                  );
                })}

                {scheduleSteps.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-card-border rounded-2xl">
                    Click Rebuild to generate study steps.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Focus Room Ambient Sounds panel */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-card-bg border border-slate-200 dark:border-slate-card-border space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Music className="text-orange-accent" size={20} />
                <h3 className="text-lg font-black text-slate-905 dark:text-white tracking-tight">Sound Machine</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Synthesize high-fidelity focus soundscapes programmatically in real-time.
              </p>
            </div>

            {/* Sound Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
              {[
                { type: 'rain', label: '🌧️ Rain Storm' },
                { type: 'lofi', label: '☕ Cozy Cafe' },
                { type: 'white', label: '🔇 White Noise' },
                { type: 'campfire', label: '🔥 Campfire' },
                { type: 'ocean', label: '🌊 Ocean Waves' },
                { type: 'wind', label: '🍃 Forest Wind' },
                { type: 'airplane', label: '🛩️ Cabin Hum' },
                { type: 'train', label: '🚂 Train Ride' },
                { type: 'pink', label: '🔊 Pink Noise' },
                { type: 'brown', label: '📻 Brown Noise' },
                { type: 'space', label: '🌌 Space Drone' },
                { type: 'clock', label: '⏰ Tick-Tock' },
                { type: 'meditation', label: '🧘 Meditation' },
                { type: 'binaural', label: '🌀 Binaural 40Hz' },
                { type: 'mask', label: '🎧 Speech Mask' },
                { type: 'piano', label: '🎹 Ambient Piano' }
              ].map((sound) => {
                const isActive = activeSound === sound.type;
                return (
                  <button
                    key={sound.type}
                    onClick={() => handleToggleSound(sound.type as any)}
                    className={`py-2 px-2.5 border rounded-2xl text-xs font-black transition duration-200 flex items-center justify-between overflow-hidden ${
                      isActive
                        ? 'border-orange-accent bg-orange-accent/10 text-orange-accent shadow-sm'
                        : 'border-slate-200 dark:border-slate-card-border bg-slate-50 dark:bg-slate-dark-bg hover:border-orange-accent/30 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{sound.label}</span>
                    {isActive && (
                      <span className="flex gap-0.5 items-end h-3 w-4 shrink-0 ml-1">
                        <span className="w-0.5 bg-orange-accent animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
                        <span className="w-0.5 bg-orange-accent animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.4s' }}></span>
                        <span className="w-0.5 bg-orange-accent animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }}></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Volume controller & mute */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-card-border/60 flex flex-col items-stretch gap-2.5 text-xs font-bold text-slate-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {activeSound !== 'none' ? (
                    <Volume2 size={16} className="text-orange-accent" />
                  ) : (
                    <VolumeX size={16} className="text-slate-400" />
                  )}
                  <span>Level: <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{Math.round(volume * 100)}%</span></span>
                </div>
                {activeSound !== 'none' && (
                  <button
                    onClick={stopAmbientSound}
                    className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-wider hover:bg-rose-500/20"
                  >
                    Mute
                  </button>
                )}
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-orange-accent bg-slate-100 dark:bg-slate-dark-bg h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'strategy' && <ExamStrategy />}
    </div>
  );
};
export default StudyPlanner;
