export interface RoadmapMilestone {
  semester: number;
  title: string;
  description: string;
  skills: string[];
  tools: string[];
}

export interface CareerPath {
  id: string;
  branch: 'CSE' | 'ECE' | 'EEE' | 'ME' | 'Civil' | 'IT';
  roleName: string;
  description: string;
  skillsRequired: string[];
  recommendedTools: string[];
  certifications: string[];
  semesters: RoadmapMilestone[];
  internshipPrep: string[];
  jobReadyPrep: string[];
  targetCompanies: string[];
  interviewFocus: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  marketDemand: 'high demand' | 'growing demand' | 'stable';
  salaryRange: string;
}

export interface DomainComparison {
  roleName: string;
  branch: string;
  marketDemand: 'High' | 'Medium' | 'Emerging';
  averageStartingSalary: string;
  learningCurve: 'Easy' | 'Moderate' | 'Steep';
  remoteWorkAvailability: string;
}

export const careerPaths: CareerPath[] = [
  {
    id: 'path_cse_fsd',
    branch: 'CSE',
    roleName: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend, managing clients, servers, and data schemas.',
    skillsRequired: ['JavaScript', 'React', 'Node.js', 'SQL', 'HTML/CSS'],
    recommendedTools: ['VS Code', 'Git', 'Vite', 'Postman', 'Docker'],
    certifications: ['AWS Cloud Practitioner', 'MongoDB Certified Associate', 'Meta Full-Stack Engineer Certificate'],
    difficulty: 'Intermediate',
    marketDemand: 'high demand',
    salaryRange: '₹6-25 LPA',
    targetCompanies: ['Google', 'Amazon', 'Meta', 'Netflix', 'TCS', 'Infosys', 'Stripe'],
    interviewFocus: ['JavaScript Event Loop & Closures', 'REST API Design & MVC Patterns', 'SQL Query Joins & Indexes', 'LeetCode Medium Algorithms'],
    semesters: [
      { semester: 1, title: 'Programming Fundamentals', description: 'Master logic structures and basic algorithms in C/Python.', skills: ['C Programming', 'Logic Diagrams'], tools: ['GCC Compiler', 'VS Code'] },
      { semester: 2, title: 'Object-Oriented Programming', description: 'Learn classes, inheritance, polymorphism, and standard memory safety.', skills: ['C++ or Java', 'OOPs Rules'], tools: ['IntelliJ IDEA', 'GDB debugger'] },
      { semester: 3, title: 'Frontend Basics', description: 'Build semantic web layouts and interactive user flows.', skills: ['HTML5', 'CSS3 (Flexbox/Grid)', 'ES6 JavaScript'], tools: ['Figma', 'Chrome DevTools'] },
      { semester: 4, title: 'Backend Servers & Databases', description: 'Create server-side APIs and link SQL normalizations.', skills: ['Node.js', 'Express', 'SQL queries'], tools: ['PostgreSQL', 'Postman'] },
      { semester: 5, title: 'Modern Frameworks', description: 'Build reactive UI using React and utility styling layers.', skills: ['React Context', 'Tailwind CSS UI', 'TypeScript Basics'], tools: ['Vite', 'NPM/Yarn'] },
      { semester: 6, title: 'State & Caching Architecture', description: 'Implement distributed global stores and memory caches.', skills: ['Zustand/Redux State', 'Redis Caching', 'Docker Containers'], tools: ['Docker', 'Redis'] },
      { semester: 7, title: 'CI/CD & Testing Pipelines', description: 'Automate build runs and continuous integrations.', skills: ['Jest Unit Testing', 'GitHub Actions', 'Cloud Hosting'], tools: ['GitHub Actions', 'AWS S3'] },
      { semester: 8, title: 'Capstone & Production Tuning', description: 'Deploy a highly scalable live application.', skills: ['Load Balancers', 'Performance Auditing', 'Resume Tuning'], tools: ['Nginx', 'Sentry'] }
    ],
    internshipPrep: [
      'Create 3 diverse portfolio projects with detailed README documentations.',
      'Solve 150+ LeetCode problems (focusing on Arrays, HashMaps, and Strings).',
      'Format a neat 1-page LaTeX professional resume.'
    ],
    jobReadyPrep: [
      'Host projects on live URLs (Vercel, AWS).',
      'Practice mock coding challenges under time constraints.',
      'Familiarize with basic system design concepts.'
    ]
  },
  {
    id: 'path_cse_ds',
    branch: 'CSE',
    roleName: 'Data Scientist',
    description: 'Extract insights from data using statistics and machine learning.',
    skillsRequired: ['Python', 'Statistics', 'ML', 'SQL', 'Pandas'],
    recommendedTools: ['Jupyter Notebook', 'Scikit-learn', 'Tableau', 'SQL Server'],
    certifications: ['Google Data Analytics Professional', 'IBM Data Science Specialist'],
    difficulty: 'Intermediate',
    marketDemand: 'high demand',
    salaryRange: '₹8-30 LPA',
    targetCompanies: ['Fractal Analytics', 'Microsoft', 'Accenture', 'Intel', 'Mu Sigma', 'Walmart'],
    interviewFocus: ['Probability & Statistical Hypotheses Testing', 'SQL Window Functions & Aggregations', 'Regression & Classification Metrics', 'Pandas Data Cleaning Operations'],
    semesters: [
      { semester: 1, title: 'Python Programming Basics', description: 'Understand basic data structures and loops in Python.', skills: ['Python Core', 'List Comprehensions'], tools: ['Jupyter', 'Anaconda'] },
      { semester: 2, title: 'Linear Algebra & Calculus', description: 'Master matrix calculations and gradient vectors.', skills: ['Matrices Math', 'Derivatives'], tools: ['NumPy', 'SciPy'] },
      { semester: 3, title: 'Data Gathering & Exploratory Analysis', description: 'Retrieve and visualize dataset behaviors.', skills: ['SQL Databases', 'Exploratory Data Analysis'], tools: ['MySQL', 'Seaborn'] },
      { semester: 4, title: 'Applied Statistics', description: 'Learn statistical distributions and run hypotheses tests.', skills: ['Hypothesis Testing', 'Probability'], tools: ['Pandas', 'Statsmodels'] },
      { semester: 5, title: 'Supervised Machine Learning', description: 'Train decision trees, support vector machines, and ensemble classifiers.', skills: ['Regression Models', 'Classifications'], tools: ['Scikit-learn', 'PyCharm'] },
      { semester: 6, title: 'Unsupervised & Deep Learning', description: 'Cluster data and build initial neural network layers.', skills: ['Clustering Models', 'Basic Neural Nets'], tools: ['TensorFlow', 'Keras'] },
      { semester: 7, title: 'MLOps & Deployment Pipelines', description: 'Expose predictive models as production APIs.', skills: ['API Deployment', 'Docker Packaging'], tools: ['Flask', 'FastAPI', 'Docker'] },
      { semester: 8, title: 'Capstone Insights Presentation', description: 'Deliver a data dashboard outlining actionable insights.', skills: ['Storytelling', 'Executive Reporting'], tools: ['Tableau', 'PowerBI'] }
    ],
    internshipPrep: [
      'Complete 2 Kaggle datasets competitions and document methodologies.',
      'Create interactive data apps using Streamlit.',
      'Practice advanced SQL window operations.'
    ],
    jobReadyPrep: [
      'Contribute to open-source data libraries.',
      'Publish research insights on medium/github.',
      'Review classical ML algorithms mathematical derivations.'
    ]
  },
  {
    id: 'path_cse_devops',
    branch: 'CSE',
    roleName: 'DevOps Engineer',
    description: 'Bridge development and operations with CI/CD and infrastructure automation.',
    skillsRequired: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Bash'],
    recommendedTools: ['GitLab', 'Terraform', 'Jenkins', 'Kubernetes', 'AWS'],
    certifications: ['AWS DevOps Engineer Professional', 'Certified Kubernetes Administrator (CKA)'],
    difficulty: 'Advanced',
    marketDemand: 'high demand',
    salaryRange: '₹7-28 LPA',
    targetCompanies: ['RedHat', 'Amazon Web Services', 'HashiCorp', 'Deloitte', 'Cognizant', 'Salesforce'],
    interviewFocus: ['Linux Networking & Processes', 'Docker Image Optimization', 'Kubernetes Pod Configurations & Services', 'Infrastructure as Code (Terraform) Lifecycle'],
    semesters: [
      { semester: 1, title: 'Linux Operations Basics', description: 'Navigate directory systems and configure environment variables.', skills: ['Linux Bash Shell', 'Users Management'], tools: ['Ubuntu Server', 'Bash Scripts'] },
      { semester: 2, title: 'Networking Fundamentals', description: 'Understand TCP/IP channels, DNS resolutions, and HTTP routes.', skills: ['Subnetting', 'HTTP/HTTPS protocols', 'Firewalls'], tools: ['Wireshark', 'Nmap'] },
      { semester: 3, title: 'Scripting & Automation', description: 'Write automation scripts for routine system actions.', skills: ['Python Automation', 'Systemd Services'], tools: ['Python CLI', 'Cron jobs'] },
      { semester: 4, title: 'Containerization Basics', description: 'Package apps in reproducible virtual structures.', skills: ['Dockerfiles', 'Image Optimizations'], tools: ['Docker Desktop', 'Docker Hub'] },
      { semester: 5, title: 'Continuous Integration Systems', description: 'Configure automated build pipelines.', skills: ['Jenkins configurations', 'GitLab CI files'], tools: ['Jenkins', 'GitLab CI'] },
      { semester: 6, title: 'Infrastructure as Code', description: 'Define cloud structures declaratively.', skills: ['Terraform scripts', 'Ansible playbooks'], tools: ['Terraform', 'Ansible'] },
      { semester: 7, title: 'Container Orchestrations', description: 'Manage clusters scaling and configurations.', skills: ['Kubernetes pods/services', 'Helm charts'], tools: ['Kubernetes', 'Minikube'] },
      { semester: 8, title: 'Telemetry & Cloud Optimization', description: 'Monitor logs and optimize cloud expenditures.', skills: ['Prometheus alerts', 'ELK Stack logging'], tools: ['Grafana', 'Prometheus', 'AWS'] }
    ],
    internshipPrep: [
      'Write shell script sets automating local workspace setups.',
      'Deploy full-stack applications in multi-stage Docker configurations.',
      'Host a personal portfolio on AWS EC2 using Nginx.'
    ],
    jobReadyPrep: [
      'Prepare for Kubernetes certifications.',
      'Implement central logging systems for college projects.',
      'Practice containerizing legacy monolithic applications.'
    ]
  },
  {
    id: 'path_cse_aiml',
    branch: 'CSE',
    roleName: 'AI/ML Engineer',
    description: 'Design and deploy machine learning models for intelligent systems.',
    skillsRequired: ['Python', 'Deep Learning', 'NLP', 'Computer Vision', 'PyTorch'],
    recommendedTools: ['Google Colab', 'PyTorch', 'Hugging Face', 'Weights & Biases'],
    certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty'],
    difficulty: 'Advanced',
    marketDemand: 'high demand',
    salaryRange: '₹10-40 LPA',
    targetCompanies: ['OpenAI', 'NVIDIA', 'Google Brain', 'Adobe', 'Meta AI', 'Infosys Research'],
    interviewFocus: ['Backpropagation & Optimization Algorithms', 'Convolutional & Recurrent Architecture Mechanics', 'Transformers & Self-Attention Equations', 'Data Pipeline Bottleneck Diagnosis'],
    semesters: [
      { semester: 1, title: 'Core Programming & Data Structures', description: 'Develop algorithms using Python structures.', skills: ['Python coding', 'Big-O notations'], tools: ['Visual Studio Code', 'Git'] },
      { semester: 2, title: 'Mathematical foundations', description: 'Master statistics, probability, and vector derivatives.', skills: ['Calculus math', 'Statistical variances'], tools: ['NumPy', 'Matplotlib'] },
      { semester: 3, title: 'Data Cleaning & Pipelines', description: 'Preprocess databases and engineer tabular fields.', skills: ['Data Wrangling', 'SQL queries'], tools: ['Pandas', 'PostgreSQL'] },
      { semester: 4, title: 'Classical Machine Learning', description: 'Train regression, classification, and trees models.', skills: ['Feature selections', 'Supervised learning'], tools: ['Scikit-learn', 'PyCharm'] },
      { semester: 5, title: 'Neural Networks Fundamentals', description: 'Construct feedforward and backpropagation layers.', skills: ['Loss Optimizers', 'Model weights updates'], tools: ['PyTorch', 'TensorBoard'] },
      { semester: 6, title: 'Computer Vision & NLP', description: 'Process images and text sequences using state-of-the-art networks.', skills: ['CNNs structures', 'RNNs & Word Embeddings'], tools: ['OpenCV', 'Hugging Face'] },
      { semester: 7, title: 'Generative AI & LLMs', description: 'Fine-tune pre-trained models and build retrieval grids.', skills: ['Transformer architectures', 'RAG databases'], tools: ['LangChain', 'Pinecone'] },
      { semester: 8, title: 'Model Deployment & Telemetry', description: 'Deploy models securely under compute limits.', skills: ['ONNX conversions', 'Model Quantizations'], tools: ['FastAPI', 'Docker', 'Triton'] }
    ],
    internshipPrep: [
      'Build a custom object detection prototype using YOLO.',
      'Fine-tune an open-source LLM for a specific domain task.',
      'Contribute to PyTorch or Hugging Face repository discussions.'
    ],
    jobReadyPrep: [
      'Write optimized tensor operations from scratch.',
      'Deploy model APIs to AWS/GCP.',
      'Complete end-to-end projects tracking runs with MLflow.'
    ]
  },
  {
    id: 'path_cse_cyber',
    branch: 'CSE',
    roleName: 'Cybersecurity Analyst',
    description: 'Protect systems and networks from security threats.',
    skillsRequired: ['Networking', 'Linux', 'Python', 'SIEM', 'Penetration Testing'],
    recommendedTools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Splunk'],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'OSCP'],
    difficulty: 'Intermediate',
    marketDemand: 'growing demand',
    salaryRange: '₹6-30 LPA',
    targetCompanies: ['PwC', 'KPMG', 'CrowdStrike', 'FireEye', 'Securonix', 'Cisco'],
    interviewFocus: ['OWASP Top 10 Web Vulnerabilities', 'TCP/IP Handshake & Packet Analysis', 'Active Directory Exploits', 'Incident Response Runbooks'],
    semesters: [
      { semester: 1, title: 'IT Systems Essentials', description: 'Understand PC components and basic operating systems.', skills: ['OS installations', 'Command Prompt hooks'], tools: ['VirtualBox', 'Windows Server'] },
      { semester: 2, title: 'Computer Networking', description: 'Master routing configurations and protocol frames.', skills: ['IP routing', 'VLAN setups', 'Wireshark analysis'], tools: ['Cisco Packet Tracer', 'Wireshark'] },
      { semester: 3, title: 'System Security Concepts', description: 'Understand malware categories and encryption math.', skills: ['Symmetric/Asymmetric Keys', 'Firewalls logs reading'], tools: ['GnuPG', 'Windows Defender'] },
      { semester: 4, title: 'Web Applications Security', description: 'Examine web protocol loopholes and request manipulations.', skills: ['HTTP requests editing', 'OWASP definitions'], tools: ['Burp Suite Community', 'OWASP Zap'] },
      { semester: 5, title: 'Ethical Hacking basics', description: 'Scan systems and run authorized security penetration tests.', skills: ['Port scanning', 'Exploit payloads delivery'], tools: ['Metasploit', 'Nmap', 'Kali Linux'] },
      { semester: 6, title: 'SIEM & SOC Operations', description: 'Aggregate system logs to spot indicators of compromise (IoC).', skills: ['Log analysis', 'Intrusion Detection systems'], tools: ['Splunk Enterprise', 'Snort'] },
      { semester: 7, title: 'Digital Forensics', description: 'Reconstruct security event details from logs and disk images.', skills: ['Memory dumps analysis', 'Registry inspections'], tools: ['Autopsy', 'Volatility'] },
      { semester: 8, title: 'Security Auditing & Ethics', description: 'Ensure institutional safety complies with ISO standards.', skills: ['Risk assessments', 'Security Policies design'], tools: ['Excel', 'Compliance Checklists'] }
    ],
    internshipPrep: [
      'Set up a home laboratory displaying logs to a Splunk panel.',
      'Reach Top 10% on TryHackMe or HackTheBox platforms.',
      'Identify 3 CVEs and write brief analysis explainers.'
    ],
    jobReadyPrep: [
      'Prepare for OSCP certification lab scenarios.',
      'Review common secure software coding practices.',
      'Participate in CTF (Capture the Flag) events with college groups.'
    ]
  },
  
  // Non-CSE Fallbacks
  {
    id: 'path_ece_emb',
    branch: 'ECE',
    roleName: 'Embedded Systems Engineer',
    description: 'Designs microcontrollers, digital circuitry, and hardware-level drivers to control autonomous physical systems.',
    skillsRequired: ['Embedded C', 'Microcontrollers (ARM, ESP32)', 'Circuit Schematics', 'Oscilloscopes', 'I2C/SPI Protocols'],
    recommendedTools: ['Arduino IDE', 'STM32CubeMX', 'KiCad', 'Oscilloscope', 'Keil uVision'],
    certifications: ['Certified Embedded Systems Professional (CESP)', 'Arm Accredited Engineer (AAE)'],
    difficulty: 'Advanced',
    marketDemand: 'high demand',
    salaryRange: '₹7-15 LPA',
    targetCompanies: ['Qualcomm', 'Intel', 'Tesla', 'Apple', 'Bosch', 'Texas Instruments'],
    interviewFocus: ['Interrupt Service Routines (ISR)', 'Bare-metal C Programming', 'SPI vs I2C vs UART Protocols', 'GPIO Registries'],
    semesters: [
      { semester: 1, title: 'Basic Circuits', description: 'Learn fundamental electricity laws.', skills: ['Ohm\'s Law', 'Breadboard testing'], tools: ['Multimeter'] }
    ],
    internshipPrep: ['Build a weather monitoring ESP32 board.'],
    jobReadyPrep: ['Write bare-metal SPI registry drivers.']
  },
  {
    id: 'path_eee_power',
    branch: 'EEE',
    roleName: 'Power Systems Designer',
    description: 'Designs electrical grids and power conversion networks for large-scale utility infrastructures.',
    skillsRequired: ['High Voltage Design', 'Grid Stability', 'Relay Protections', 'Power Electronics'],
    recommendedTools: ['MATLAB Simulink', 'ETAP', 'AutoCAD Electrical'],
    certifications: ['Professional Engineer (PE) License', 'Power Quality Professional'],
    difficulty: 'Advanced',
    marketDemand: 'stable',
    salaryRange: '₹5-9 LPA',
    targetCompanies: ['NTPC', 'PowerGrid', 'GE Power', 'Siemens', 'ABB', 'Schneider Electric'],
    interviewFocus: ['Short Circuit Calculations', 'Transformers Magnetization Dynamics', 'Power Factor Corrections'],
    semesters: [
      { semester: 1, title: 'Electrical Circuits Analysis', description: 'Solve AC/DC circuit networks equations.', skills: ['KVL/KCL equations', 'AC phasors'], tools: ['LTSpice'] }
    ],
    internshipPrep: ['Model a simple transformer substation configuration.'],
    jobReadyPrep: ['Complete internships at power plants or utility offices.']
  },
  {
    id: 'path_me_cad',
    branch: 'ME',
    roleName: 'CAD Product Designer',
    description: 'Designs machinery components and optimizes structural assemblies.',
    skillsRequired: ['3D Modeling', 'FEM/FEA Stress Analyses', 'GD&T Standards', 'Materials Selections'],
    recommendedTools: ['SolidWorks', 'Autodesk Fusion 360', 'ANSYS', 'AutoCAD'],
    certifications: ['CSWA / CSWP SolidWorks Certifications', 'Autodesk Certified Professional'],
    difficulty: 'Intermediate',
    marketDemand: 'stable',
    salaryRange: '₹4-8 LPA',
    targetCompanies: ['L&T', 'Mahindra', 'Tata Motors', 'Boeing', 'Caterpillar', 'Cummins'],
    interviewFocus: ['Geometric Dimensioning & Tolerancing (GD&T)', 'Failure Theories (von Mises)', 'Manufacturing Processes Limits'],
    semesters: [
      { semester: 1, title: 'Engineering Drafting Foundations', description: 'Master orthographic drawing views.', skills: ['Geometric Drafting', 'Isometric projections'], tools: ['AutoCAD'] }
    ],
    internshipPrep: ['Design a customized gear box assembly.'],
    jobReadyPrep: ['Perform finite element analysis on a structural load-bearing beam.']
  },
  {
    id: 'path_civil_struct',
    branch: 'Civil',
    roleName: 'Structural Engineer',
    description: 'Analyzes and designs load-bearing frameworks to ensure concrete infrastructures safety.',
    skillsRequired: ['Structural analysis', 'Concrete designs (RCC)', 'Soil Mechanics', 'Wind & Seismic loads computations'],
    recommendedTools: ['STAAD.Pro', 'ETABS', 'SAP2000', 'Revit Structure'],
    certifications: ['Chartered Engineer Status', 'ACI Concrete Field Testing Certificate'],
    difficulty: 'Advanced',
    marketDemand: 'stable',
    salaryRange: '₹4-9 LPA',
    targetCompanies: ['L&T Construction', 'DLF', 'Tata Projects', 'AFCONS', 'Ramboll', 'Arup Group'],
    interviewFocus: ['Bending Moment & Shear Diagrams', 'Concrete Reinforcements calculation rules', 'Soil Bearing Capacities equations'],
    semesters: [
      { semester: 1, title: 'Statics Mechanics', description: 'Analyze rigid bodies forces in equilibrium.', skills: ['Force vectors', 'Truss analyses'], tools: ['Calculators'] }
    ],
    internshipPrep: ['Draft an RCC drawing for a 2-story residence model.'],
    jobReadyPrep: ['Complete site engineering logs during concrete pouring.']
  }
];

export const domainComparisons: DomainComparison[] = [
  {
    roleName: 'Full Stack Developer',
    branch: 'CSE / IT',
    marketDemand: 'High',
    averageStartingSalary: '₹6L - ₹12L',
    learningCurve: 'Moderate',
    remoteWorkAvailability: 'Excellent (80%+ remote roles)'
  },
  {
    roleName: 'Data Scientist',
    branch: 'CSE',
    marketDemand: 'High',
    averageStartingSalary: '₹8L - ₹15L',
    learningCurve: 'Moderate',
    remoteWorkAvailability: 'Very Good'
  },
  {
    roleName: 'DevOps Engineer',
    branch: 'CSE',
    marketDemand: 'High',
    averageStartingSalary: '₹7L - ₹14L',
    learningCurve: 'Steep',
    remoteWorkAvailability: 'Excellent'
  },
  {
    roleName: 'AI/ML Engineer',
    branch: 'CSE',
    marketDemand: 'High',
    averageStartingSalary: '₹10L - ₹18L',
    learningCurve: 'Steep',
    remoteWorkAvailability: 'Very Good'
  },
  {
    roleName: 'Cybersecurity Analyst',
    branch: 'CSE',
    marketDemand: 'High',
    averageStartingSalary: '₹6L - ₹12L',
    learningCurve: 'Moderate',
    remoteWorkAvailability: 'Good'
  }
];
