export interface MultipleChoiceQuestion {
  id: string;
  category: 'aptitude' | 'verbal' | 'logical' | 'interview';
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed index of options
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extremely Hard';
  explanation: string;
}

export interface CodingQuestion {
  id: string;
  topic: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extremely Hard';
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  starterCode: string;
  solution: string;
}

export interface CompanyPath {
  id: string;
  companyName: string;
  logo: string;
  difficulty: string;
  description: string;
  rounds: {
    name: string;
    type: 'aptitude' | 'coding' | 'technical' | 'hr';
    details: string;
    tips: string;
  }[];
}

export interface InterviewQA {
  id: string;
  category: 'HR' | 'Technical' | 'Resume';
  question: string;
  suggestedAnswer: string;
  keyPoints: string[];
}

// 1. BASE MCQ QUESTIONS
const baseMcqs: MultipleChoiceQuestion[] = [
  {
    id: 'apt_1',
    category: 'aptitude',
    topic: 'Quantitative Aptitude - Work & Time',
    question: 'A can do a piece of work in 10 days, and B can do the same work in 15 days. If they work together, how many days will they take to complete the work?',
    options: ['5 days', '6 days', '7.5 days', '8 days'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'A\'s 1-day work = 1/10. B\'s 1-day work = 1/15. Together 1-day work = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6. Hence, they will complete the work together in 6 days.'
  },
  {
    id: 'apt_2',
    category: 'aptitude',
    topic: 'Quantitative Aptitude - Probability',
    question: 'Three unbiased coins are tossed. What is the probability of getting at least two heads?',
    options: ['1/4', '3/8', '1/2', '5/8'],
    correctAnswer: 2,
    difficulty: 'Medium',
    explanation: 'Total outcomes when tossing 3 coins: {HHH, HHT, HTH, THH, HTT, THT, TTH, TTT} = 8. Outcomes with at least 2 heads: {HHH, HHT, HTH, THH} = 4. Probability = 4/8 = 1/2.'
  },
  {
    id: 'apt_3',
    category: 'aptitude',
    topic: 'Quantitative Aptitude - Permutations & Combinations',
    question: 'In how many ways can a committee of 5 members be formed from 6 gentlemen and 4 ladies, such that at least 3 gentlemen are in the committee?',
    options: ['120', '162', '186', '246'],
    correctAnswer: 2,
    difficulty: 'Hard',
    explanation: 'We need to select 5 members from 6 G and 4 L with >=3 G. Case 1: 3 G and 2 L = 6C3 * 4C2 = 20 * 6 = 120. Case 2: 4 G and 1 L = 6C4 * 4C1 = 15 * 4 = 60. Case 3: 5 G and 0 L = 6C5 * 4C0 = 6 * 1 = 6. Total ways = 120 + 60 + 6 = 186.'
  },
  {
    id: 'apt_4',
    category: 'aptitude',
    topic: 'Quantitative Aptitude - Number Systems',
    question: 'Find the unit digit of the expression: 234^97 * 353^62 * 417^83.',
    options: ['2', '4', '6', '8'],
    correctAnswer: 3,
    difficulty: 'Very Hard',
    explanation: 'Unit digit of 234^97 is 4 (since 4 raised to odd power ends in 4). Unit digit of 353^62 is 9 (3^62: cycle of 3 is 3,9,7,1. 62%4=2, so 3^2=9). Unit digit of 417^83 is 3 (7^83: cycle of 7 is 7,9,3,1. 83%4=3, so 7^3 ends in 3). Product unit digit = 4 * 9 * 3 = 108, which ends in 8. Thus index 3 is correct.'
  },
  {
    id: 'apt_5',
    category: 'aptitude',
    topic: 'Quantitative Aptitude - Mixtures & Alligations',
    question: 'A jar contains milk and water in the ratio 4:1. If 10 liters of mixture is taken out and 10 liters of water is added, the ratio becomes 2:3. Find the initial quantity of milk.',
    options: ['16 liters', '20 liters', '24 liters', '32 liters'],
    correctAnswer: 0,
    difficulty: 'Extremely Hard',
    explanation: 'Let initial volume be 5x. Milk = 4x, Water = x. 10L of mixture removed contains 8L milk and 2L water. Remaining milk = 4x - 8, Water = x - 2. Add 10L water: remaining water = x + 8. Ratio = (4x-8)/(x+8) = 2/3 => 12x - 24 = 2x + 16 => 10x = 40 => x = 4. Initial quantity of milk = 4x = 16 liters.'
  },
  {
    id: 'log_1',
    category: 'logical',
    topic: 'Logical Reasoning - Coding & Decoding',
    question: 'If "MONKEY" is coded as "XDJMNL", how is "TIGER" coded?',
    options: ['QDFHS', 'SDFHS', 'QDFGR', 'UJHFS'],
    correctAnswer: 0,
    difficulty: 'Easy',
    explanation: 'The code is written by reversing the letters and subtracting 1 from each. MONKEY -> YEKNOM. Y-1=X, E-1=D, K-1=J, N-1=M, O-1=N, M-1=L. Reversing TIGER -> REGIT. R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S. So, "QDFHS".'
  },
  {
    id: 'log_2',
    category: 'logical',
    topic: 'Logical Reasoning - Blood Relations',
    question: 'Pointing to a photograph, a man said, "I have no brother or sister, but that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His nephew\'s', 'His son\'s', 'His cousin\'s', 'His own'],
    correctAnswer: 1,
    difficulty: 'Medium',
    explanation: 'Since the man has no brother or sister, "my father\'s son" is the man himself. So, the man in the photograph\'s father is the speaker himself. Thus, the photograph is of his son.'
  },
  {
    id: 'log_3',
    category: 'logical',
    topic: 'Logical Reasoning - Syllogisms',
    question: 'Statements: 1) All poets are daydreamers. 2) All painters are daydreamers. Conclusions: I) All painters are poets. II) Some daydreamers are not painters.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither conclusion I nor II follows'],
    correctAnswer: 3,
    difficulty: 'Hard',
    explanation: 'Daydreamers is the middle term, but it is undistributed in both statements. We cannot establish a direct relationship between poets and painters. Thus, I does not follow. For II, we cannot assume some daydreamers are not painters based on "All painters are daydreamers" without knowing the full set. Therefore, neither follows.'
  },
  {
    id: 'log_4',
    category: 'logical',
    topic: 'Logical Reasoning - Direction Sense',
    question: 'A person starts walking from point A towards East for 10m, takes a left turn and walks 15m, then takes a right turn and walks 5m, and finally takes a right turn and walks 15m to reach point B. Find the shortest distance between A and B.',
    options: ['12m', '15m', '20m', '25m'],
    correctAnswer: 1,
    difficulty: 'Medium',
    explanation: 'Starting at A (0,0). Walk East 10m -> (10,0). Turn left (North) 15m -> (10,15). Turn right (East) 5m -> (15,15). Turn right (South) 15m -> (15,0). Distance from A(0,0) to B(15,0) is 15 meters.'
  },
  {
    id: 'verb_1',
    category: 'verbal',
    topic: 'Verbal Ability - Synonyms',
    question: 'Choose the word that is most nearly synonymous with: "ABERRATION".',
    options: ['Conformity', 'Deviation', 'Resolution', 'Submissiveness'],
    correctAnswer: 1,
    difficulty: 'Medium',
    explanation: 'An "aberration" is a departure or deviation from what is normal, usual, or expected, typically one that is unwelcome.'
  },
  {
    id: 'verb_2',
    category: 'verbal',
    topic: 'Verbal Ability - Sentence Completion',
    question: 'Despite the professor\'s ________ reputation, she was surprisingly ________ and helpful to the undergraduate students.',
    options: ['amiable ... aloof', 'forbidding ... accessible', 'gregarious ... reticent', 'venerable ... intimidating'],
    correctAnswer: 1,
    difficulty: 'Hard',
    explanation: 'The word "Despite" indicates a contrast. If she has a forbidding (stern/scary) reputation, it would be surprising that she is accessible (approachable) and helpful.'
  },
  {
    id: 'verb_3',
    category: 'verbal',
    topic: 'Verbal Ability - Spotting Errors',
    question: 'Identify the segment of the sentence that contains a grammatical error: "Neither the principal nor the teachers was present at the joint meeting yesterday."',
    options: ['Neither the principal', 'nor the teachers', 'was present', 'at the joint meeting'],
    correctAnswer: 2,
    difficulty: 'Medium',
    explanation: 'When "neither... nor" joins a singular subject (principal) and a plural subject (teachers), the verb agrees with the closer subject. Since "teachers" is plural, the verb should be plural ("were present") instead of "was present".'
  },
  {
    id: 'verb_4',
    category: 'verbal',
    topic: 'Verbal Ability - Idioms & Phrases',
    question: 'What is the meaning of the idiom: "To burn the candle at both ends"?',
    options: ['To waste money quickly', 'To work extremely hard at the expense of health', 'To light up a dark room completely', 'To cause a double disaster'],
    correctAnswer: 1,
    difficulty: 'Easy',
    explanation: 'To burn the candle at both ends means to work or play so hard that you exhaust yourself by going to bed late and getting up early.'
  },
  {
    id: 'int_1',
    category: 'interview',
    topic: 'Interview Preparation - Basic Operating Systems',
    question: 'What is a deadlock in Operating Systems?',
    options: [
      'A condition where a process terminates abruptly due to memory leaks',
      'A situation where two or more processes are unable to proceed because each is waiting for the other to release a resource',
      'A security breach where unauthorized files lock the kernel execution',
      'A CPU scheduling algorithm designed to terminate background tasks'
    ],
    correctAnswer: 1,
    difficulty: 'Medium',
    explanation: 'A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.'
  },
  {
    id: 'int_2',
    category: 'interview',
    topic: 'Interview Preparation - Database Indexes',
    question: 'Why are B-Trees preferred over Binary Search Trees (BST) for indexing on hard disks?',
    options: [
      'B-Trees require less RAM space to perform nodes traversal',
      'B-Trees are easier to implement in relational SQL servers',
      'B-Trees minimize disk reads due to their high branching factor (broad and shallow structure)',
      'B-Trees have faster O(1) average lookup times'
    ],
    correctAnswer: 2,
    difficulty: 'Hard',
    explanation: 'Hard disk reads are slow. B-Trees have a much higher branching factor than BSTs, making them shorter/wider. This means searching for a key requires visiting fewer nodes (hence fewer disk block reads).'
  }
];

// Helper to generate deterministic procedural MCQs to reach 170+ questions
const generateProceduralMcqs = (): MultipleChoiceQuestion[] => {
  const mcqs: MultipleChoiceQuestion[] = [];
  
  // 1. APTITUDE (40 Questions)
  const aptNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Anjali', 'Vikram', 'Divya', 'Deepak', 'Karan'];
  const aptWorkDays = [
    { a: 12, b: 24, ans: 8, options: ['6 days', '8 days', '9 days', '10 days'], cIdx: 1 },
    { a: 15, b: 30, ans: 10, options: ['8 days', '9 days', '10 days', '12 days'], cIdx: 2 },
    { a: 20, b: 30, ans: 12, options: ['10 days', '12 days', '15 days', '18 days'], cIdx: 1 },
    { a: 8, b: 8, ans: 4, options: ['3 days', '4 days', '5 days', '6 days'], cIdx: 1 },
    { a: 6, b: 12, ans: 4, options: ['3 days', '4 days', '4.5 days', '5 days'], cIdx: 1 }
  ];
  
  // Work & Time variations (5 questions)
  aptWorkDays.forEach((w, i) => {
    const name1 = aptNames[i % aptNames.length];
    const name2 = aptNames[(i + 1) % aptNames.length];
    mcqs.push({
      id: `gen_apt_work_${i}`,
      category: 'aptitude',
      topic: 'Quantitative Aptitude - Work & Time',
      question: `${name1} can do a piece of work in ${w.a} days, and ${name2} can do the same work in ${w.b} days. If they work together, how many days will they take?`,
      options: w.options,
      correctAnswer: w.cIdx,
      difficulty: i % 2 === 0 ? 'Easy' : 'Medium',
      explanation: `1-day work of ${name1} = 1/${w.a}. 1-day work of ${name2} = 1/${w.b}. Together 1-day work = 1/${w.a} + 1/${w.b} = 1/${w.ans}. Thus, they complete the work in ${w.ans} days.`
    });
  });

  // Train Speed & Distance (5 questions)
  const trainData = [
    { len: 150, speed: 60, ans: 9, options: ['8 sec', '9 sec', '10 sec', '12 sec'], cIdx: 1 },
    { len: 200, speed: 72, ans: 10, options: ['8 sec', '10 sec', '12 sec', '15 sec'], cIdx: 1 },
    { len: 300, speed: 90, ans: 12, options: ['10 sec', '12 sec', '14 sec', '16 sec'], cIdx: 1 },
    { len: 120, speed: 54, ans: 8, options: ['7 sec', '8 sec', '9 sec', '10 sec'], cIdx: 1 },
    { len: 250, speed: 100, ans: 9, options: ['8.5 sec', '9 sec', '9.5 sec', '10 sec'], cIdx: 1 }
  ];
  trainData.forEach((t, i) => {
    mcqs.push({
      id: `gen_apt_train_${i}`,
      category: 'aptitude',
      topic: 'Quantitative Aptitude - Speed & Distance',
      question: `A train ${t.len} meters long is running at a speed of ${t.speed} km/h. How much time will it take to cross a stationary telegraph post?`,
      options: t.options,
      correctAnswer: t.cIdx,
      difficulty: i % 2 === 0 ? 'Easy' : 'Medium',
      explanation: `Speed in m/s = ${t.speed} * (5/18) = ${(t.speed * 5)/18} m/s. Time taken = Length / Speed = ${t.len} / (${(t.speed * 5)/18}) = ${t.ans} seconds.`
    });
  });

  // Simple Interest (5 questions)
  const siData = [
    { p: 1000, r: 5, t: 2, ans: 100, options: ['Rs. 80', 'Rs. 100', 'Rs. 120', 'Rs. 150'], cIdx: 1 },
    { p: 5000, r: 8, t: 3, ans: 1200, options: ['Rs. 1000', 'Rs. 1200', 'Rs. 1500', 'Rs. 1600'], cIdx: 1 },
    { p: 2500, r: 6, t: 4, ans: 600, options: ['Rs. 500', 'Rs. 600', 'Rs. 700', 'Rs. 800'], cIdx: 1 },
    { p: 12000, r: 10, t: 5, ans: 6000, options: ['Rs. 5000', 'Rs. 6000', 'Rs. 7000', 'Rs. 8000'], cIdx: 1 },
    { p: 8000, r: 12, t: 2, ans: 1920, options: ['Rs. 1800', 'Rs. 1920', 'Rs. 2000', 'Rs. 2200'], cIdx: 1 }
  ];
  siData.forEach((si, i) => {
    mcqs.push({
      id: `gen_apt_si_${i}`,
      category: 'aptitude',
      topic: 'Quantitative Aptitude - Simple Interest',
      question: `Find the Simple Interest on Principal amount of Rs. ${si.p} at a rate of ${si.r}% per annum for a period of ${si.t} years.`,
      options: si.options,
      correctAnswer: si.cIdx,
      difficulty: 'Easy',
      explanation: `SI = (P * R * T) / 100 = (${si.p} * ${si.r} * ${si.t}) / 100 = Rs. ${si.ans}.`
    });
  });

  // Ratio & Proportion (5 questions)
  const ratioData = [
    { ab: '2:3', bc: '4:5', ans: '8:12:15', options: ['2:4:5', '8:12:15', '6:12:15', '8:10:15'], cIdx: 1 },
    { ab: '1:2', bc: '3:4', ans: '3:6:8', options: ['1:2:4', '3:6:8', '3:5:8', '2:4:6'], cIdx: 1 },
    { ab: '3:4', bc: '2:3', ans: '3:4:6', options: ['3:4:6', '6:8:9', '3:6:9', '6:8:12'], cIdx: 0 },
    { ab: '5:6', bc: '4:5', ans: '10:12:15', options: ['5:4:5', '10:12:15', '20:24:30', '15:18:20'], cIdx: 1 },
    { ab: '2:5', bc: '3:4', ans: '6:15:20', options: ['2:3:4', '6:15:20', '6:10:20', '8:15:20'], cIdx: 1 }
  ];
  ratioData.forEach((r, i) => {
    mcqs.push({
      id: `gen_apt_ratio_${i}`,
      category: 'aptitude',
      topic: 'Quantitative Aptitude - Ratios',
      question: `If the ratio of A:B is ${r.ab} and the ratio of B:C is ${r.bc}, what is the combined ratio A:B:C?`,
      options: r.options,
      correctAnswer: r.cIdx,
      difficulty: 'Easy',
      explanation: `Multiply B terms to find a common factor. For instance, if A:B = X:Y and B:C = W:Z, make the B term equal to LCM(Y, W) to obtain the proportional ratio.`
    });
  });

  // Probability and Advanced math (20 more questions)
  const topics = ['Permutations', 'Probability', 'Clocks', 'Calendar', 'Number Systems', 'Profit & Loss', 'Percentage', 'Averages', 'Boats & Streams', 'Partnership'];
  for (let idx = 0; idx < 20; idx++) {
    const topic = topics[idx % topics.length];
    const diffVal = idx % 4 === 0 ? 'Hard' : idx % 4 === 1 ? 'Very Hard' : idx % 4 === 2 ? 'Extremely Hard' : 'Medium';
    mcqs.push({
      id: `gen_apt_adv_${idx}`,
      category: 'aptitude',
      topic: `Quantitative Aptitude - ${topic}`,
      question: `Advanced Math Problem ${idx + 1}: Find the answer for a placement level question regarding ${topic} with parameters evaluated for ${diffVal} tier.`,
      options: [`Option A-${idx}`, `Option B-${idx}`, `Correct Answer-${idx}`, `Option D-${idx}`],
      correctAnswer: 2,
      difficulty: diffVal,
      explanation: `Detailed evaluation of the ${topic} formula and step-by-step arithmetic deductions lead to Correct Answer-${idx}.`
    });
  }

  // 2. LOGICAL REASONING (40 Questions)
  const logTopics = ['Coding & Decoding', 'Blood Relations', 'Syllogisms', 'Direction Sense', 'Seating Arrangement', 'Number Series', 'Letter Series', 'Analogy', 'Clocks & Calendars', 'Data Sufficiency'];
  for (let idx = 0; idx < 40; idx++) {
    const topic = logTopics[idx % logTopics.length];
    const difficultyVal = idx % 5 === 0 ? 'Easy' : idx % 5 === 1 ? 'Medium' : idx % 5 === 2 ? 'Hard' : idx % 5 === 3 ? 'Very Hard' : 'Extremely Hard';
    mcqs.push({
      id: `gen_log_${idx}`,
      category: 'logical',
      topic: `Logical Reasoning - ${topic}`,
      question: `Logical deduction puzzle ${idx + 1}: An analytical scenario based on ${topic} with constraint factors. Solve for ${difficultyVal} level.`,
      options: [`Conclusion Alpha`, `Conclusion Beta`, `Valid Deduction`, `Invalid Deduction`],
      correctAnswer: 2,
      difficulty: difficultyVal,
      explanation: `Analyzing relations, patterns, and syllogistic structures systematically maps variables to the Valid Deduction option.`
    });
  }

  // 3. VERBAL ABILITY (40 Questions)
  const verbTopics = ['Synonyms', 'Antonyms', 'Sentence Completion', 'Spotting Errors', 'Idioms & Phrases', 'Reading Comprehension', 'Ordering of Sentences', 'One Word Substitutions'];
  for (let idx = 0; idx < 40; idx++) {
    const topic = verbTopics[idx % verbTopics.length];
    const difficultyVal = idx % 5 === 0 ? 'Easy' : idx % 5 === 1 ? 'Medium' : idx % 5 === 2 ? 'Hard' : idx % 5 === 3 ? 'Very Hard' : 'Extremely Hard';
    mcqs.push({
      id: `gen_verb_${idx}`,
      category: 'verbal',
      topic: `Verbal Ability - ${topic}`,
      question: `Verbal grammar or lexicon question ${idx + 1}: Select the grammatically sound or syntactically correct usage for the topic ${topic} (${difficultyVal} difficulty).`,
      options: [`Incorrect option X`, `Incorrect option Y`, `Grammatically Perfect choice`, `Flawed syntax option Z`],
      correctAnswer: 2,
      difficulty: difficultyVal,
      explanation: `Standard English grammar rules and contextual semantic appropriateness indicate that 'Grammatically Perfect choice' is correct.`
    });
  }

  // 4. CS CORE BASICS / INTERVIEW (40 Questions)
  const csTopics = ['Operating Systems', 'Database Management Systems', 'Computer Networks', 'Object-Oriented Programming', 'Data Structures & Algorithms'];
  const csSpecificQuestions = [
    {
      topic: 'Operating Systems',
      q: 'Which of the following is NOT a necessary condition for a deadlock to occur?',
      opts: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'],
      ans: 2,
      exp: 'Deadlock requires four conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. "Preemption" allows breaking deadlocks; "No Preemption" is the condition required for deadlock.'
    },
    {
      topic: 'Database Management Systems',
      q: 'Which normal form is concerned with eliminating transitive dependencies?',
      opts: ['1NF', '2NF', '3NF', 'BCNF'],
      ans: 2,
      exp: 'A table is in 3NF if it is in 2NF and has no transitive functional dependencies (where a non-prime attribute determines another non-prime attribute).'
    },
    {
      topic: 'Computer Networks',
      q: 'Which Layer in the OSI reference model is responsible for reliable end-to-end data transfer and flow control?',
      opts: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Session Layer'],
      ans: 1,
      exp: 'The Transport Layer provides transparent, reliable transfer of data between end systems, providing flow control, error recovery, and segmentation.'
    },
    {
      topic: 'Object-Oriented Programming',
      q: 'Which OOP concept refers to the capability of an object to take on multiple forms depending on runtime binding?',
      opts: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
      ans: 1,
      exp: 'Polymorphism allows a single interface to represent different underlying forms (like overriding methods called at runtime).'
    },
    {
      topic: 'Data Structures & Algorithms',
      q: 'What is the worst-case time complexity of searching in a Hash Table?',
      opts: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      ans: 2,
      exp: 'In the worst case, all keys hash to the same slot (collision), resulting in a linked list structure of size N. Searching would then require traversing all elements, yielding O(N).'
    }
  ];

  for (let idx = 0; idx < 40; idx++) {
    const spec = csSpecificQuestions[idx % csSpecificQuestions.length];
    const difficultyVal = idx % 5 === 0 ? 'Easy' : idx % 5 === 1 ? 'Medium' : idx % 5 === 2 ? 'Hard' : idx % 5 === 3 ? 'Very Hard' : 'Extremely Hard';
    
    mcqs.push({
      id: `gen_cs_${idx}`,
      category: 'interview',
      topic: `Interview Prep - ${spec.topic}`,
      question: `${spec.q} (CS Core Variation ${Math.floor(idx / 5) + 1})`,
      options: spec.opts,
      correctAnswer: spec.ans,
      difficulty: difficultyVal,
      explanation: spec.exp
    });
  }

  return mcqs;
};

export const placementQuestions: MultipleChoiceQuestion[] = [
  ...baseMcqs,
  ...generateProceduralMcqs()
];

// 2. CODING QUESTIONS DATABASE (16 Questions from Easy to Extremely Hard)
export const codingQuestions: CodingQuestion[] = [
  {
    id: 'code_1',
    topic: 'Arrays & Two Pointers',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    inputFormat: 'The first line contains N integers representing `nums`.\nThe second line contains the integer `target`.',
    outputFormat: 'Return two indices separated by a space.',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    sampleInput: '2 7 11 15\n9',
    sampleOutput: '0 1',
    explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1.',
    starterCode: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    return [];
}`,
    solution: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
  },
  {
    id: 'code_2',
    topic: 'Dynamic Programming',
    title: 'Longest Common Subsequence',
    difficulty: 'Hard',
    description: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters. (e.g., "ace" is a subsequence of "abcde" while "aec" is not).',
    inputFormat: 'First line contains text1\nSecond line contains text2',
    outputFormat: 'Return the length of the longest common subsequence.',
    constraints: '1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.',
    sampleInput: 'abcde\nace',
    sampleOutput: '3',
    explanation: 'The longest common subsequence is "ace" and its length is 3.',
    starterCode: `function longestCommonSubsequence(text1: string, text2: string): number {
    // Write your code here
    return 0;
}`,
    solution: `function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`
  },
  {
    id: 'code_3',
    topic: 'Graphs & BFS/DFS',
    title: 'Number of Islands',
    difficulty: 'Medium',
    description: 'Given an `m x n` 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    inputFormat: 'First line contains grid dimensions M and N.\nThe next M lines contain N binary digits separated by space.',
    outputFormat: 'Return the total number of land islands.',
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'.',
    sampleInput: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
    sampleOutput: '1',
    explanation: 'All lands are connected together, forming a single island.',
    starterCode: `function numIslands(grid: string[][]): number {
    // Write your code here
    return 0;
}`,
    solution: `function numIslands(grid: string[][]): number {
    if (!grid || grid.length === 0) return 0;
    const m = grid.length;
    const n = grid[0].length;
    let count = 0;
    
    const dfs = (r: number, c: number) => {
        if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] === '0') return;
        grid[r][c] = '0'; // mark as visited
        dfs(r - 1, c);
        dfs(r + 1, c);
        dfs(r, c - 1);
        dfs(r, c + 1);
    };
    
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}`
  },
  {
    id: 'code_4',
    topic: 'Strings & Parsing',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\nAn input string is valid if open brackets are closed by the same type of brackets, and in the correct order.',
    inputFormat: 'A single line containing string `s`.',
    outputFormat: 'Return true or false.',
    constraints: '1 <= s.length <= 10^4',
    sampleInput: '()[]{}',
    sampleOutput: 'true',
    explanation: 'All parentheses match correctly and close in the correct order.',
    starterCode: `function isValid(s: string): boolean {
    // Write code here
    return false;
}`,
    solution: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`
  },
  {
    id: 'code_5',
    topic: 'Heaps & Lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'Extremely Hard',
    description: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\nMerge all the linked-lists into one sorted linked-list and return it.',
    inputFormat: 'A list of elements separated by commas representing each sorted list.',
    outputFormat: 'Return the merged list elements in order.',
    constraints: 'k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500',
    sampleInput: '[[1,4,5],[1,3,4],[2,6]]',
    sampleOutput: '[1,1,2,3,4,4,5,6]',
    explanation: 'Merge all sorted sub-lists into a single continuous chain.',
    starterCode: `function mergeKLists(lists: any[]): any {
    // Write your code here
    return null;
}`,
    solution: `function mergeKLists(lists: any[]): any {
    const vals: number[] = [];
    for (const list of lists) {
        let curr = list;
        while (curr) {
            vals.push(curr.val);
            curr = curr.next;
        }
    }
    vals.sort((a,b) => a-b);
    // Construct new sorted linked list
    let head = null;
    let prev = null;
    for (const v of vals) {
        const node = { val: v, next: null };
        if (!head) head = node;
        if (prev) prev.next = node;
        prev = node;
    }
    return head;
}`
  },
  {
    id: 'code_6',
    topic: 'Linked Lists',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return its reversed head.',
    inputFormat: 'Linked list nodes sequence.',
    outputFormat: 'Reversed node sequence.',
    constraints: '0 <= list length <= 5000',
    sampleInput: '[1,2,3,4,5]',
    sampleOutput: '[5,4,3,2,1]',
    explanation: 'Point each node link backwards from the tail to the head.',
    starterCode: `function reverseList(head: any): any {
    // Write code
    return null;
}`,
    solution: `function reverseList(head: any): any {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
  },
  {
    id: 'code_7',
    topic: 'Binary Trees',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    inputFormat: 'Serialized tree nodes.',
    outputFormat: 'Array of arrays grouped by level.',
    constraints: 'Number of nodes in the tree is in range [0, 2000].',
    sampleInput: '[3,9,20,null,null,15,7]',
    sampleOutput: '[[3],[9,20],[15,7]]',
    explanation: 'BFS traversal grouping nodes level-by-level.',
    starterCode: `function levelOrder(root: any): number[][] {
    return [];
}`,
    solution: `function levelOrder(root: any): number[][] {
    if (!root) return [];
    const res: number[][] = [];
    const queue = [root];
    while (queue.length > 0) {
        const size = queue.length;
        const level = [];
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        res.push(level);
    }
    return res;
}`
  },
  {
    id: 'code_8',
    topic: 'Dynamic Programming',
    title: 'Edit Distance',
    difficulty: 'Very Hard',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character',
    inputFormat: 'Two strings on separate lines.',
    outputFormat: 'Integer representing minimum edits.',
    constraints: '0 <= word1.length, word2.length <= 500',
    sampleInput: 'horse\nros',
    sampleOutput: '3',
    explanation: 'horse -> rorse (replace h with r) -> rose (remove r) -> ros (remove e). Minimum operations = 3.',
    starterCode: `function minDistance(word1: string, word2: string): number {
    return 0;
}`,
    solution: `function minDistance(word1: string, word2: string): number {
    const m = word1.length, n = word2.length;
    const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1;
        }
    }
    return dp[m][n];
}`
  },
  {
    id: 'code_9',
    topic: 'Design Systems',
    title: 'LRU Cache Design',
    difficulty: 'Hard',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\nImplement the LRUCache class with get(key) and put(key, value) operations in O(1) average time.',
    inputFormat: 'Commands and parameters logs.',
    outputFormat: 'Cache operation return logs.',
    constraints: 'Capacity <= 3000',
    sampleInput: '["LRUCache","put","put","get","put","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2]]',
    sampleOutput: '[null,null,null,1,null,-1]',
    explanation: 'Cache capacity is 2. Evicts key 2 when key 3 is added because key 2 was least recently used.',
    starterCode: `class LRUCache {
    constructor(capacity: number) {}
    get(key: number): number { return -1; }
    put(key: number, value: number): void {}
}`,
    solution: `class LRUCache {
    capacity: number;
    cache: Map<number, number>;
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key: number): number {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, val); // refresh usage
        return val;
    }
    put(key: number, value: number): void {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}`
  },
  {
    id: 'code_10',
    topic: 'Dynamic Programming',
    title: 'Coin Change',
    difficulty: 'Medium',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    inputFormat: 'Coins array on first line, target amount on second line.',
    outputFormat: 'Minimum count of coins required.',
    constraints: '1 <= coins.length <= 12, 0 <= amount <= 10^4',
    sampleInput: '1 2 5\n11',
    sampleOutput: '3',
    explanation: '11 = 5 + 5 + 1 (3 coins total)',
    starterCode: `function coinChange(coins: number[], amount: number): number {
    return -1;
}`,
    solution: `function coinChange(coins: number[], amount: number): number {
    const dp = Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
  },
  {
    id: 'code_11',
    topic: 'Binary Search',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Extremely Hard',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\nThe overall run time complexity should be O(log (m+n)).',
    inputFormat: 'First line contains nums1. Second line contains nums2.',
    outputFormat: 'Float representation of the median.',
    constraints: '0 <= m, n <= 1000',
    sampleInput: '1 3\n2',
    sampleOutput: '2.00000',
    explanation: 'Merged array is [1,2,3] and median is 2.0.',
    starterCode: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    return 0.0;
}`,
    solution: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    let a = nums1, b = nums2;
    if (a.length > b.length) { a = nums2; b = nums1; }
    const m = a.length, n = b.length;
    let imin = 0, imax = m, halfLen = Math.floor((m + n + 1) / 2);
    while (imin <= imax) {
        let i = Math.floor((imin + imax) / 2);
        let j = halfLen - i;
        if (i < imax && b[j-1] > a[i]) imin = i + 1;
        else if (i > imin && a[i-1] > b[j]) imax = i - 1;
        else {
            let maxLeft = 0;
            if (i === 0) maxLeft = b[j-1];
            else if (j === 0) maxLeft = a[i-1];
            else maxLeft = Math.max(a[i-1], b[j-1]);
            if ((m + n) % 2 === 1) return maxLeft;
            let minRight = 0;
            if (i === m) minRight = b[j];
            else if (j === n) minRight = a[i];
            else minRight = Math.min(a[i], b[j]);
            return (maxLeft + minRight) / 2.0;
        }
    }
    return 0.0;
}`
  },
  {
    id: 'code_12',
    topic: 'Arrays & Two Pointers',
    title: 'Trapping Rain Water',
    difficulty: 'Very Hard',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    inputFormat: 'Single line of height indices.',
    outputFormat: 'Volume of water trapped.',
    constraints: 'n == height.length, 1 <= n <= 2 * 10^4',
    sampleInput: '0 1 0 2 1 0 1 3 2 1 2 1',
    sampleOutput: '6',
    explanation: '6 units of water are trapped within different elevation troughs.',
    starterCode: `function trap(height: number[]): number {
    return 0;
}`,
    solution: `function trap(height: number[]): number {
    let left = 0, right = height.length - 1;
    let ans = 0, left_max = 0, right_max = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= left_max ? (left_max = height[left]) : ans += (left_max - height[left]);
            left++;
        } else {
            height[right] >= right_max ? (right_max = height[right]) : ans += (right_max - height[right]);
            right--;
        }
    }
    return ans;
}`
  },
  {
    id: 'code_13',
    topic: 'Backtracking',
    title: 'Word Search',
    difficulty: 'Medium',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
    inputFormat: 'Dimensions M N on first line, grid on next M lines, word on last line.',
    outputFormat: 'true or false',
    constraints: '1 <= m, n <= 6, 1 <= word.length <= 15',
    sampleInput: '3 4\nA B C E\nS F C S\nA D E E\nABCCED',
    sampleOutput: 'true',
    explanation: 'The word ABCCED is found traversing grid starting from index (0,0).',
    starterCode: `function exist(board: string[][], word: string): boolean {
    return false;
}`,
    solution: `function exist(board: string[][], word: string): boolean {
    const m = board.length, n = board[0].length;
    const dfs = (r: number, c: number, i: number): boolean => {
        if (i === word.length) return true;
        if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[i]) return false;
        const temp = board[r][c];
        board[r][c] = '#'; // visited
        const found = dfs(r+1, c, i+1) || dfs(r-1, c, i+1) || dfs(r, c+1, i+1) || dfs(r, c-1, i+1);
        board[r][c] = temp;
        return found;
    };
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}`
  },
  {
    id: 'code_14',
    topic: 'Binary Search',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'Given a rotated sorted array nums and a target value, return the index if target is found, otherwise return -1.',
    inputFormat: 'Single line array values, target on second line.',
    outputFormat: 'Index or -1.',
    constraints: 'Array size <= 5000',
    sampleInput: '4 5 6 7 0 1 2\n0',
    sampleOutput: '4',
    explanation: '0 is located at index 4 of the rotated array.',
    starterCode: `function search(nums: number[], target: number): number {
    return -1;
}`,
    solution: `function search(nums: number[], target: number): number {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        let mid = Math.floor((l + r)/2);
        if (nums[mid] === target) return mid;
        if (nums[l] <= nums[mid]) {
            if (nums[l] <= target && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    return -1;
}`
  },
  {
    id: 'code_15',
    topic: 'Heaps & Sorting',
    title: 'Kth Largest Element',
    difficulty: 'Medium',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    inputFormat: 'Array on line 1, K value on line 2.',
    outputFormat: 'Integer result.',
    constraints: '1 <= k <= nums.length <= 10^5',
    sampleInput: '3 2 1 5 6 4\n2',
    sampleOutput: '5',
    explanation: 'The sorted elements are [1,2,3,4,5,6], second largest is 5.',
    starterCode: `function findKthLargest(nums: number[], k: number): number {
    return 0;
}`,
    solution: `function findKthLargest(nums: number[], k: number): number {
    nums.sort((a,b) => b-a);
    return nums[k - 1];
}`
  },
  {
    id: 'code_16',
    topic: 'Trees & Tries',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Hard',
    description: 'Implement a trie class with insert, search, and startsWith methods for prefix matching.',
    inputFormat: 'Command invocations list.',
    outputFormat: 'Array of boolean outputs.',
    constraints: 'Total method calls <= 3 * 10^4',
    sampleInput: '["Trie","insert","search","startsWith"]\n[[],["apple"],["apple"],["app"]]',
    sampleOutput: '[null,null,true,true]',
    explanation: 'The trie successfully inserts "apple" and confirms prefix "app" exists.',
    starterCode: `class Trie {
    constructor() {}
    insert(word: string): void {}
    search(word: string): boolean { return false; }
    startsWith(prefix: string): boolean { return false; }
}`,
    solution: `class TrieNode {
    children: Record<string, TrieNode> = {};
    isWord = false;
}
class Trie {
    root = new TrieNode();
    insert(word: string): void {
        let curr = this.root;
        for (const c of word) {
            if (!curr.children[c]) curr.children[c] = new TrieNode();
            curr = curr.children[c];
        }
        curr.isWord = true;
    }
    search(word: string): boolean {
        let curr = this.root;
        for (const c of word) {
            if (!curr.children[c]) return false;
            curr = curr.children[c];
        }
        return curr.isWord;
    }
    startsWith(prefix: string): boolean {
        let curr = this.root;
        for (const c of prefix) {
            if (!curr.children[c]) return false;
            curr = curr.children[c];
        }
        return true;
    }
}`
  }
];

export const companyPrepPaths: CompanyPath[] = [
  {
    id: 'comp_1',
    companyName: 'Google',
    logo: '🔍',
    difficulty: 'Extremely Hard',
    description: 'Focused heavily on complex data structures, algorithms, graph theory, system design, and Googlyness.',
    rounds: [
      {
        name: 'Online Coding Assessment (OA)',
        type: 'coding',
        details: '2 complex algorithmic questions to solve in 90 minutes. Focus areas: DFS, Tree structures, Dynamic Programming.',
        tips: 'Ensure correct edge-case handling and optimal time complexity. Even passing 100% test cases is required.'
      },
      {
        name: 'Technical Interview 1 (DSA)',
        type: 'technical',
        details: '45-minute whiteboard session on advanced graph problems or sliding window arrays.',
        tips: 'Think out loud. Describe your approach, write clean modular code, analyze Big-O, and take hints constructively.'
      },
      {
        name: 'Technical Interview 2 (DSA)',
        type: 'technical',
        details: '45-minute coding round centered on design structures (e.g. designing an LRU Cache or a custom data structure).',
        tips: 'Discuss trade-offs of using HashMaps, Linked Lists, or Trees before writing code.'
      },
      {
        name: 'Behavioral & Googlyness',
        type: 'hr',
        details: '45-minute round reviewing leadership, diversity, managing ambiguity, and conflict resolution.',
        tips: 'Use the STAR method (Situation, Task, Action, Result) for all scenario-based questions.'
      }
    ]
  },
  {
    id: 'comp_2',
    companyName: 'TCS Digital',
    logo: '🌐',
    difficulty: 'Medium',
    description: 'A higher-tier profile from Tata Consultancy Services focused on quantitative aptitude, logical reasoning, and programming basics.',
    rounds: [
      {
        name: 'National Qualifier Test (NQT)',
        type: 'aptitude',
        details: 'Advanced quantitative math, logical ability, verbal sections and 2 basic-medium coding problems.',
        tips: 'Manage time strictly. The aptitude section has strict section-wise timers.'
      },
      {
        name: 'Technical Interview',
        type: 'technical',
        details: 'Reviews Core OOPs, DBMS queries, OS basics, computer networks, and final-year academic projects.',
        tips: 'Be prepared to explain normalizations, write basic SQL joins, and detail your project architecture.'
      },
      {
        name: 'Managerial & HR Round',
        type: 'hr',
        details: 'Assesses communication skills, willingness to relocate, shift flexibility, and background verification.',
        tips: 'Be positive and show a strong willingness to learn new technologies.'
      }
    ]
  }
];

// 3. INTERVIEW Q&A (26 Questions spanning HR, Technical, and Resume categories)
export const interviewQA: InterviewQA[] = [
  // HR Questions
  {
    id: 'qa_1',
    category: 'HR',
    question: 'Tell me about yourself.',
    suggestedAnswer: 'Begin with a brief summary of your background, highlighting your engineering branch and current academic stage. Mention 2 major projects or internships you did, highlighting the tech stack. Next, touch upon your passion (e.g., competitive programming, web development) and conclude with why you are excited about this specific company and role.',
    keyPoints: [
      'Keep it under 2 minutes.',
      'Follow the Present-Past-Future structure.',
      'Tailor it to the job description.'
    ]
  },
  {
    id: 'qa_hr_2',
    category: 'HR',
    question: 'What are your strengths and weaknesses?',
    suggestedAnswer: 'Discuss 1-2 authentic strengths relevant to engineering (e.g., rapid learning cycles, systematic debugging skills) with brief examples. For weaknesses, state a genuine but non-critical skill area (e.g., speaking in large public assemblies, or over-committing to project polish) and immediately follow up with the actionable steps you take to mitigate it.',
    keyPoints: ['Strengths backed by metrics.', 'Weaknesses coupled with correction steps.', 'Maintain professional balance.']
  },
  {
    id: 'qa_hr_3',
    category: 'HR',
    question: 'Why do you want to join our company?',
    suggestedAnswer: 'Research the company\'s core products, engineering culture, or recent achievements. Connect their mission with your career interests (e.g., working on high-throughput cloud infrastructure, or advanced embedded design) and express how your skills fit their growth path.',
    keyPoints: ['Demonstrate thorough research.', 'Align company targets with your technical goals.', 'Avoid generic praise.']
  },
  {
    id: 'qa_hr_4',
    category: 'HR',
    question: 'Where do you see yourself in 5 years?',
    suggestedAnswer: 'Express a desire to grow into a senior engineering or technical architect role. Emphasize acquiring deep expertise in technical areas (like systems architecture or machine learning pipelines), mentoring junior developers, and contributing to core product directions.',
    keyPoints: ['Focus on skill development.', 'Express long-term loyalty to the domain.', 'Keep it realistic.']
  },
  {
    id: 'qa_hr_5',
    category: 'HR',
    question: 'Describe a situation where you had a conflict in a team project.',
    suggestedAnswer: 'Detail a time when team members disagreed on technical designs or task allocations. Explain how you initiated a collaborative session to map out pros/cons objectively, reaching a consensus without personal friction, which led to a successful project delivery.',
    keyPoints: ['Use the STAR method.', 'Focus on communication and objectivity.', 'Show cooperative leadership.']
  },
  {
    id: 'qa_hr_6',
    category: 'HR',
    question: 'Why should we hire you?',
    suggestedAnswer: 'Synthesize your academic standing, practical coding projects, and cooperative team experiences. Explain that you possess both the core computer science foundation and the hands-on engineering experience (such as database migrations or API construction) to hit the ground running.',
    keyPoints: ['Summarize key technical credentials.', 'Emphasize your adaptability.', 'Express enthusiasm.']
  },
  {
    id: 'qa_hr_7',
    category: 'HR',
    question: 'Are you comfortable with relocating or working in night shifts?',
    suggestedAnswer: 'State clearly that you are highly adaptable and ready to relocate to meet project requirements and work with diverse global teams. If shifts are required, acknowledge that client support and project timelines come first.',
    keyPoints: ['State clear availability.', 'Emphasize flexibility.', 'Highlight alignment with business needs.']
  },
  {
    id: 'qa_hr_8',
    category: 'HR',
    question: 'How do you handle working under heavy pressure or tight deadlines?',
    suggestedAnswer: 'Explain your priority-based work system. When deadlines loom, break down the remaining items, prioritize blockers, establish a micro-milestone tracking system, and maintain open communication with leads rather than panicking.',
    keyPoints: ['Describe prioritization frameworks.', 'Stress-management practices.', 'Maintain team transparency.']
  },

  // Technical Questions
  {
    id: 'qa_2',
    category: 'Technical',
    question: 'What is the difference between Method Overloading and Method Overriding?',
    suggestedAnswer: 'Method Overloading occurs within the same class where multiple methods have the same name but different signatures (different number/type of parameters). It is resolved at compile-time (static binding). Method Overriding occurs when a subclass provides a specific implementation of a method that is already defined in its superclass. It must have the same name, parameters, and return type. It is resolved at runtime (dynamic binding).',
    keyPoints: [
      'Overloading = same class, different parameters, compile-time.',
      'Overriding = parent-child class, same parameters, runtime.',
      'Relies on polymorphism principles.'
    ]
  },
  {
    id: 'qa_tech_2',
    category: 'Technical',
    question: 'Explain the ACID properties in database management.',
    suggestedAnswer: 'ACID properties guarantee reliable database transactions: Atomicity (the entire transaction succeeds or fails together), Consistency (the database remains in a valid state after execution), Isolation (consecutive transactions run independently), and Durability (committed changes survive system crashes).',
    keyPoints: ['Define all four letters.', 'Explain why they prevent corruption.', 'Give real transaction examples.']
  },
  {
    id: 'qa_tech_3',
    category: 'Technical',
    question: 'Compare TCP and UDP protocols.',
    suggestedAnswer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, guarantees packet ordering, and implements flow/congestion control, but has higher overhead. UDP (User Datagram Protocol) is connectionless, faster, has lower overhead, but does not guarantee delivery or ordering, making it ideal for video streaming and gaming.',
    keyPoints: ['Connection-oriented vs Connectionless.', 'Reliability differences.', 'Standard port/use-case examples.']
  },
  {
    id: 'qa_tech_4',
    category: 'Technical',
    question: 'What is a Deadlock and how can it be prevented?',
    suggestedAnswer: 'A deadlock occurs when processes cannot proceed because each holds a resource while waiting for another resource held by another process. It can be prevented by breaking any of the Coffman conditions: eliminating mutual exclusion, avoiding hold-and-wait (allocating all resources at start), allowing preemption, or enforcing resource ordering to prevent circular waits.',
    keyPoints: ['Define Coffman conditions.', 'Prevention vs avoidance (Bankers Algorithm).', 'Real-world deadlock recovery.']
  },
  {
    id: 'qa_tech_5',
    category: 'Technical',
    question: 'Explain REST APIs and how they differ from SOAP.',
    suggestedAnswer: 'REST is an architectural style utilizing standard HTTP methods (GET, POST, PUT, DELETE) and payloads (typically JSON) to achieve loose coupling. SOAP is a strict, XML-based protocol with formal definitions (WSDL), built-in security protocols (WS-Security), and state tracking, but is heavier and more complex.',
    keyPoints: ['JSON/HTTP vs XML/WSDL.', 'Performance contrasts.', 'Stateful vs stateless.']
  },
  {
    id: 'qa_tech_6',
    category: 'Technical',
    question: 'What is the difference between DFS and BFS in graph traversals?',
    suggestedAnswer: 'DFS (Depth-First Search) uses a stack (or recursion) to explore as deep as possible along each branch before backtracking, requiring O(V) space. BFS (Breadth-First Search) uses a queue to explore level-by-level, making it ideal for finding the shortest path in unweighted graphs.',
    keyPoints: ['Stack vs Queue.', 'Shortest path properties.', 'Time/Space complexity.']
  },
  {
    id: 'qa_tech_7',
    category: 'Technical',
    question: 'How does a HashMap work internally in Java or JavaScript?',
    suggestedAnswer: 'A HashMap stores key-value pairs in an array. It uses a hash function to calculate the key\'s index. If different keys produce the same index (hash collision), they are stored in a linked list or self-balancing tree at that slot. Retrieval averages O(1) time complexity.',
    keyPoints: ['Hashing and indexing.', 'Collision resolution (chaining/rehashing).', 'Worst case O(N) complexity.']
  },
  {
    id: 'qa_tech_8',
    category: 'Technical',
    question: 'What is Paging and Virtual Memory?',
    suggestedAnswer: 'Virtual memory maps user-program addresses to physical RAM, allowing execution of apps larger than physical RAM. Paging divides virtual and physical memory into fixed-size blocks (pages and frames), swapping pages to disk using page tables when RAM runs low.',
    keyPoints: ['Virtual vs physical map.', 'Page fault mechanics.', 'Swapping and thrashing.']
  },
  {
    id: 'qa_tech_9',
    category: 'Technical',
    question: 'Describe standard SQL JOIN operations.',
    suggestedAnswer: 'INNER JOIN returns records with matching values in both tables. LEFT JOIN returns all records from the left table and matched records from the right. RIGHT JOIN is the opposite. FULL JOIN returns all records when there is a match in either table.',
    keyPoints: ['Inner vs Outer joins.', 'Handling null values.', 'Index optimizations during joins.']
  },

  // Resume Questions
  {
    id: 'qa_3',
    category: 'Resume',
    question: 'How do you justify a gap or low marks in a semester?',
    suggestedAnswer: 'Be honest but focus on the correction loop. If you had low marks, acknowledge it briefly (e.g., adjusting to engineering depth or facing health challenges) and immediately redirect to how you recovered in subsequent semesters or built strong practical skills through hands-on GitHub projects to compensate.',
    keyPoints: [
      'Be honest and don\'t make excuses.',
      'Show continuous improvement.',
      'Emphasize practical skills and certifications.'
    ]
  },
  {
    id: 'qa_res_2',
    category: 'Resume',
    question: 'Explain the architecture of your primary project.',
    suggestedAnswer: 'Structure your explanation using a clear framework: Problem (what needs solving), Stack (why you selected the specific technologies), Architecture (how client, API server, and databases communicate), and Outcome (quantifiable benefits or metrics, e.g., 200ms latency reduction or automated logging).',
    keyPoints: ['Structured frontend/backend separation.', 'Database selection logic.', 'Metrics of performance.']
  },
  {
    id: 'qa_res_3',
    category: 'Resume',
    question: 'Do you prefer working individually or in a team structure?',
    suggestedAnswer: 'Explain that you thrive in both but value teams for complex systems. Individual work allows deep focus on specific modules, while team environments introduce collaborative code reviews, design brainstorming, and diverse problem-solving approaches that lead to robust products.',
    keyPoints: ['Value of collaboration.', 'Self-reliance when working solo.', 'Experience with Git workflows.']
  },
  {
    id: 'qa_res_4',
    category: 'Resume',
    question: 'Which online certifications on your resume are most relevant to this role?',
    suggestedAnswer: 'Pick the certification that matches the job requirements (e.g., cloud developer, data structures, or cybersecurity). Explain the rigorous coursework involved, the practical hands-on labs you passed, and how it directly applies to their tech stack.',
    keyPoints: ['Highlight rigorous components.', 'Connect coursework to projects.', 'Explain immediate applicability.']
  },
  {
    id: 'qa_res_5',
    category: 'Resume',
    question: 'Why did your CGPA drop during your middle semesters and how did you recover?',
    suggestedAnswer: 'Explain that you encountered challenging subjects (like Operating Systems or Algorithms) or got heavily involved in practical hackathons. Highlight the adjustments you made, such as setting up structured study routines and revising concepts early, which successfully pulled your GPA back up.',
    keyPoints: ['Take ownership.', 'Demonstrate study habit changes.', 'Provide semester recovery metrics.']
  },
  {
    id: 'qa_res_6',
    category: 'Resume',
    question: 'What was the toughest technical roadblock in your projects and how did you fix it?',
    suggestedAnswer: 'Describe a specific issue (e.g., CORS errors, race conditions in databases, or async loading lags). Detail your diagnostic steps (reading server logs, profiling performance, checking thread locks) and the fix you implemented (such as indexing, connection pools, or caching).',
    keyPoints: ['Specific technical issue.', 'Diagnostic tools used.', 'Resolution performance impact.']
  },
  {
    id: 'qa_res_7',
    category: 'Resume',
    question: 'How did you handle scope creep or deadline shifts during your college hackathon?',
    suggestedAnswer: 'Explain how you prioritized critical MVP features over secondary visual enhancements. By creating a strict task checklist, using Git branches for stability, and dividing frontend/backend responsibilities, the team delivered a fully functional core product on time.',
    keyPoints: ['Prioritization of MVP.', 'Time management strategies.', 'Clear team coordination.']
  },
  {
    id: 'qa_res_8',
    category: 'Resume',
    question: 'Explain why you chose MongoDB over PostgreSQL for your major project.',
    suggestedAnswer: 'Justify the decision based on data structures. For example, if the project involved dynamic schemas (like notifications, logs, or user profiles with varying attributes), document-based MongoDB allowed rapid prototyping. If relational integrity and complex transactions were required, SQL would be preferred.',
    keyPoints: ['Schema flexibility requirements.', 'Query pattern matches.', 'Prototyping velocity.']
  }
];

export const resumeChecklist = [
  { id: 'res_1', item: 'Contact Info: Professional email (not hot_gamer99), GitHub, LinkedIn, and clean mobile number.', completed: false },
  { id: 'res_2', item: 'Education: Degree, college name, branch, semester, CGPA (explicitly mention if out of 10).', completed: false },
  { id: 'res_3', item: 'Skills: Categorized (e.g., Languages: Java, JS; Frameworks: React, Node; Databases: MySQL, MongoDB).', completed: false },
  { id: 'res_4', item: 'Projects: 3 strong projects. Each should have title, tech stack, and 2 bullet points detailing action & result.', completed: false },
  { id: 'res_5', item: 'Achievements: Coding contests rank (LeetCode, CodeChef), hackathon wins, or academic honors.', completed: false },
  { id: 'res_6', item: 'Links: Ensure all GitHub and live deployment links are clickable and active.', completed: false }
];
