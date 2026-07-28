export interface ProjectIdea {
  id: string;
  title: string;
  shortSummary: string;
  branch: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extremely Hard';
  budget: 'Low' | 'Medium' | 'High';
  teamSize: 'Solo' | '2-3 members' | '4+ members';
  projectType: 'Mini Project' | 'Major Project' | 'Hackathon';
  useCase: string;
  relevanceScore: number;
  resumeValue: 'High' | 'Medium' | 'Low';
  githubValue: 'High' | 'Medium' | 'Low';
  interviewValue: 'High' | 'Medium' | 'Low';
  hackathonSuitability: 'High' | 'Medium' | 'Low';
  problemStatement: string;
  objective: string;
  features: string[];
  technologiesUsed: string[];
  implementationSteps: string[];
  expectedOutcome: string;
  futureScope: string;
  optionalEnhancements: string[];
  recommendedStackVariants: string[];
  tags: string[];
  saved: boolean;
  completionLevelIndicator: number; // Percentage
  
  // Expanded fields generated dynamically
  whyItMatters?: string;
  targetUsers?: string[];
  suggestedArchitecture?: string;
  suggestedDatabaseSchema?: string;
  suggestedAPIs?: string[];
  suggestedUIPages?: string[];
  suggestedComponents?: string[];
  validationEdgeCases?: string[];
  errorHandlingPlan?: string[];
  loadingEmptyStates?: string[];
  resumeTalkingPoints?: string[];
  interviewQuestions?: string[];
  githubReadmeValue?: string;
  demoExpectations?: string;
  suggestedDeployment?: string;
  
  // Prompt variants
  promptAntigravity?: string;
  promptCursor?: string;
  promptBase44?: string;
  promptClaude?: string;
  promptGeneric?: string;
}

export interface CompactProject {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extremely Hard';
  category: string;
  tech: string[];
  problem: string;
  objective: string;
  features: string[];
  steps: string[];
}

// Compact definitions of 432 projects (26 projects per branch * 16 branches = 416, plus 16 General = 432 total)
const branchProjects: Record<string, CompactProject[]> = {
  CSE: [
    // Easy (6)
    {
      title: "Student Gradebook Register",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "Instructors struggle to maintain and compute grade lists across multiple subjects.",
      objective: "Build a single-page register to log grades and calculate student metrics.",
      features: ["CRUD grade logs", "Grade distributions", "CSV data exports"],
      steps: ["Design HTML table layout", "Add SQLite connections", "Implement calculations", "Test exports"]
    },
    {
      title: "Campus Lost and Found Portal",
      difficulty: "Easy",
      category: "Portfolio Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Students lose personal belongings with no central system to report and claim them.",
      objective: "Build a simple image board for reporting found items.",
      features: ["List lost items", "Add descriptions", "Upload image links"],
      steps: ["Design grid listing UI", "Connect to Firebase Database", "Build reporting form", "Deploy to static host"]
    },
    {
      title: "Lab Inventory Tracker",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "Lab assistants lose track of equipment quantities and borrow dates.",
      objective: "Create a simple dashboard to log equipment checkouts.",
      features: ["Add equipment slots", "Borrower log", "Search inventory lists"],
      steps: ["Build inventory dashboard", "Add check-out forms", "Setup SQLite db", "Test item log counts"]
    },
    {
      title: "Classroom Booking Scheduler",
      difficulty: "Easy",
      category: "Portfolio Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Club coordinators struggle to locate empty classes for meetings.",
      objective: "Build a digital notice board showing class statuses.",
      features: ["Select room number", "Toggle occupied state", "Add session timings"],
      steps: ["Draft room layout list", "Connect state to Firebase", "Add timing selector", "Style badges status"]
    },
    {
      title: "College Syllabus Planner",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "Students lose track of pending syllabus units before midterm exams.",
      objective: "Build a unit-by-unit progress tracker with checklist grids.",
      features: ["List syllabus subjects", "Tick completed units", "Generate progress circle"],
      steps: ["Input syllabus records", "Add checklist components", "Calculate score charts", "Store in SQLite local"]
    },
    {
      title: "Exam Countdown Board",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Students forget midterm exam dates, leading to poor preparation schedules.",
      objective: "Build a responsive dashboard displaying countdown cards.",
      features: ["Subject date lists", "Live seconds counters", "Add custom reminders"],
      steps: ["Build countdown components", "Calculate date offsets", "Integrate alert chimes", "Sync with Firebase logs"]
    },
    // Medium (6)
    {
      title: "Alumni Network Portal",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      problem: "Students lack professional communication channels with alumni.",
      objective: "Develop a directory web application connecting students with graduated seniors.",
      features: ["Alumni directories", "Profile detail tabs", "Request referral boards"],
      steps: ["Set up express servers", "Create PostgreSQL profile schemas", "Build search UI components", "Add direct message logs"]
    },
    {
      title: "Peer Study-Group Locator",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["React", "Express", "MongoDB", "REST API"],
      problem: "Students struggle to coordinate study groups for difficult classes.",
      objective: "Build a bulletin board to create and join campus study sessions.",
      features: ["Post study sessions", "Join group triggers", "Tag subjects"],
      steps: ["Configure Express routes", "Write MongoDB study model", "Build responsive study card grids", "Add participant join hooks"]
    },
    {
      title: "Hostel Complaints Manager",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Express", "MySQL", "REST API"],
      problem: "Hostel issues take days to resolve due to manual paper ticketing.",
      objective: "Create a support portal to raise and monitor maintenance tickets.",
      features: ["Create maintenance requests", "Status timeline progress", "Admin feedback notes"],
      steps: ["Design database tickets schema", "Build status pipelines", "Create issue submission panels", "Setup notifications alerts"]
    },
    {
      title: "Canteen Queue Pre-order System",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      problem: "Long queue wait times during lunch break reduce study hours.",
      objective: "Construct a menu ordering web app with token generations.",
      features: ["Interactive food menus", "Cart counters and totals", "Generate order tokens"],
      steps: ["Build interactive menu lists", "Handle checkout calculations", "Expose endpoints for order logging", "Test database integrations"]
    },
    {
      title: "Student Club Event Manager",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      problem: "Students miss college club events due to scattered flyers.",
      objective: "Build a unified event billboard with RSVP registration clicks.",
      features: ["Add event description details", "RSVP list registry", "Generate tickets"],
      steps: ["Design RSVP collections", "Build event details layouts", "Add ticket barcode mocks", "Deploy backend Node servers"]
    },
    {
      title: "Library Seat Planner",
      difficulty: "Medium",
      category: "Problem-Solving Project",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      problem: "Students wander around the central library searching for open study desks.",
      objective: "Develop a real-time layout grid showing seat availability.",
      features: ["Visual floor map", "Click to reserve seat", "Auto-release timer"],
      steps: ["Draft library desk map grid", "Manage seats state on backend", "Link timers to active reservations", "Integrate map dashboards"]
    },
    // Hard (6)
    {
      title: "Real-time Code Collaboration Room",
      difficulty: "Hard",
      category: "Hackathon Project",
      tech: ["Next.js", "WebSockets", "MongoDB", "JWT"],
      problem: "Distributed project teams experience delays merging code during hackathons.",
      objective: "Build a real-time web code editor with live synced cursors.",
      features: ["Live document edits", "WebSockets room panels", "Syntax highlight themes"],
      steps: ["Configure websocket socket.io connections", "Embed Monaco editor components", "Serialize cursor coordinate updates", "Secure with JWT logs"]
    },
    {
      title: "AI Resume Scanner and Evaluator",
      difficulty: "Hard",
      category: "Interview Project",
      tech: ["React", "Python", "FastAPI", "NLP"],
      problem: "Students fail ATS resumes filters because they miss critical keywords.",
      objective: "Develop an NLP parsing web tool analyzing job description alignments.",
      features: ["PDF resume uploads", "Keyword overlap metrics", "Skills recommendations"],
      steps: ["Write python PDF parser", "Integrate NLP text comparison models", "Build radial progress dashboards", "Expose FastAPI server"]
    },
    {
      title: "Autonomous Exam Seating Planner",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["Next.js", "Node.js", "PostgreSQL", "REST API"],
      problem: "Manual allocation of exam desks causes room capacity conflicts.",
      objective: "Build an automated algorithm allocating seats without adjacent conflicts.",
      features: ["Upload class rosters", "Visual room blueprint preview", "Conflict prevention tests"],
      steps: ["Write placement allocation loops", "Design SQL seat layout tables", "Build canvas layout charts", "Export final registers to PDF"]
    },
    {
      title: "Smart Campus Parking Navigator",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["React", "Python", "OpenCV", "SQLite"],
      problem: "Students waste time searching parking spaces, clogging campus streets.",
      objective: "Create an image analysis dashboard showing open spots via camera streams.",
      features: ["Video feed status boards", "Spot detection counts", "Parking map alerts"],
      steps: ["Write OpenCV object detection logic", "Map parking spot coordinates", "Stream status counts to React", "Build live alerts panel"]
    },
    {
      title: "Placement Placement Analytics Hub",
      difficulty: "Hard",
      category: "Interview Project",
      tech: ["Next.js", "Python", "Django", "PostgreSQL"],
      problem: "College placement offices have difficulty tracking batch statistics and salary distributions.",
      objective: "Develop a graphical data hub tracking company placements.",
      features: ["Salary histograms", "Eligible student rosters", "Application status tracking pipelines"],
      steps: ["Structure placement stats models", "Build line and pie chart boards", "Expose Django analytics endpoints", "Setup dashboard security"]
    },
    {
      title: "Smart Course Planner and Recommender",
      difficulty: "Hard",
      category: "Problem-Solving Project",
      tech: ["Next.js", "Python", "FastAPI", "TensorFlow"],
      problem: "Students pick elective courses randomly without aligning to job prospects.",
      objective: "Develop a course recommendations portal using machine learning profiles.",
      features: ["Career goals selectors", "Elective overlap scores", "Interactive career maps"],
      steps: ["Collect course syllabus descriptions", "Train TF-IDF semantic matchers", "Build selection dashboards", "Integrate career map charts"]
    },
    // Very Hard (4)
    {
      title: "Multi-Tenant LMS Platform",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
      problem: "Colleges operate outdated LMS servers that crash during exam hours.",
      objective: "Develop a multi-tenant, cloud-ready lecture and quiz management hub.",
      features: ["Isolate tenant workspaces", "Heavy traffic load balancers", "Grading auto-pipelines"],
      steps: ["Design multi-tenant PostgreSQL schemas", "Build containerized Docker services", "Write quiz grading worker pools", "Secure server networks"]
    },
    {
      title: "Decentralized Voting Ledger",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["React", "Go", "Supabase", "Docker"],
      problem: "Student council elections face concerns regarding ballot tampering.",
      objective: "Build a blockchain-inspired consensus voting log preventing double submissions.",
      features: ["Immutable cryptographic logs", "Double-spend voter checks", "Live audit views"],
      steps: ["Write transaction logging nodes in Go", "Integrate cryptographic signups", "Build admin audit dashboards", "Configure docker deployment logs"]
    },
    {
      title: "Distributed Logging Framework",
      difficulty: "Very Hard",
      category: "Industry-Style Project",
      tech: ["Node.js", "Redis", "PostgreSQL", "Docker"],
      problem: "Microservice logs are fragmented, making system errors hard to trace.",
      objective: "Create a high-throughput centralized log ingestor and pipeline.",
      features: ["Rate limiting queues", "Elastic search matching", "Live incident dashboards"],
      steps: ["Configure Redis PubSub channels", "Write cluster log collection scripts", "Set up PostgreSQL indexes", "Test high-write limits"]
    },
    {
      title: "Distributed Cache Middleware",
      difficulty: "Very Hard",
      category: "Learning Project",
      tech: ["Go", "Redis", "REST API", "Docker"],
      problem: "Database servers suffer heavy CPU loads due to repetitive SQL query lookups.",
      objective: "Develop a lightweight cache proxy intercepting REST queries.",
      features: ["LRU cache evictions", "TTL timing expirations", "Visual usage metrics dashboard"],
      steps: ["Write core cache routines in Go", "Build proxy redirect endpoints", "Connect Redis dashboard monitors", "Simulate concurrent requests"]
    },
    // Extremely Hard (4)
    {
      title: "Peer-to-Peer Encrypted File Share",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["TypeScript", "WebSockets", "Node.js", "JWT"],
      problem: "Academic research files are prone to security leaks on standard servers.",
      objective: "Build a decentralized file-swapping grid encrypting data shards in transit.",
      features: ["WebRTC file streaming", "AES-255 encryption", "Peer discovery grids"],
      steps: ["Establish WebRTC peer-connection signallers", "Implement browser-based encryption", "Assemble chunk assembly buffers", "Build tracker logs"]
    },
    {
      title: "Custom JS Web Sandbox & Compiler",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["TypeScript", "Node.js", "Docker", "Kubernetes"],
      problem: "Online compilers expose servers to code-injection security hazards.",
      objective: "Build a secure execution sandbox using micro-containers.",
      features: ["Container execution barriers", "Time-limit abort constraints", "Detailed system trace summaries"],
      steps: ["Build container execution images", "Write system trace logs, mapping standard IO", "Setup Kubernetes resource clamps", "Run stress tests"]
    },
    {
      title: "Distributed Transaction Saga Orchestrator",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Go", "Kubernetes", "Redis", "Docker"],
      problem: "Microservices face data inconsistencies when steps fail mid-transaction.",
      objective: "Build a distributed transaction coordinator managing rollbacks.",
      features: ["Compensation transaction pipelines", "State audit dashboards", "Automatic recovery queues"],
      steps: ["Write step registration controls", "Integrate rollback commands", "Set up Docker development rigs", "Validate database state resets"]
    },
    {
      title: "Optimized Database Engine Parser",
      difficulty: "Extremely Hard",
      category: "Knowledge Project",
      tech: ["Go", "SQLite", "REST API", "Docker"],
      problem: "Custom telemetry tools face slow speeds when writing log structures.",
      objective: "Develop a lightweight in-memory SQL parsing indexer.",
      features: ["Custom B-Tree indices", "Log query lexical parser", "Execution plan dashboards"],
      steps: ["Write lexical parsers", "Implement in-memory B-Tree indexes", "Connect execution plan visualizers", "Compare speeds against SQLite"]
    }
  ],
  IT: [
    // Easy (6)
    {
      title: "Campus Wi-Fi Speed Logger",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "Students experience spotty internet connections but cannot pin down weak zones.",
      objective: "Build a simple local web log logging network ping latency metrics.",
      features: ["Ping testing button", "Network status cards", "Map location marker forms"],
      steps: ["Create speed test trigger", "Build SQLite data entry forms", "Show summary tables", "Style warning colors"]
    },
    {
      title: "IT Helpdesk Ticketing System",
      difficulty: "Easy",
      category: "Portfolio Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Students cannot easily report faulty computers in college labs.",
      objective: "Create a simple dashboard to file and view repair requests.",
      features: ["Raise repair tickets", "Filter list by room", "Toggle priority tag"],
      steps: ["Set up ticket forms", "Sync records to Firebase Realtime DB", "Add status toggle buttons", "Create layout dashboards"]
    },
    {
      title: "Server Ping Status Monitor",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "System admins lack a quick, visual page checking if lab servers are online.",
      objective: "Build a monitoring dashboard querying list IPs every 60 seconds.",
      features: ["List server ip cards", "Color-coded online indicators", "Manual check button"],
      steps: ["Configure SQLite server list", "Write fetch check routines", "Add auto-refresh cycles", "Design dashboard badges"]
    },
    {
      title: "Software License Organizer",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Department heads lose track of renew dates for licensed software.",
      objective: "Build an expiration reminder board listing active keys and warnings.",
      features: ["Log software purchases", "Automatic expiry counts", "Visual highlight alerts"],
      steps: ["Build software data lists", "Calculate expiration alert dates", "Integrate Firebase logs", "Deploy static interfaces"]
    },
    {
      title: "Lab IP Address Tracker",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["HTML", "CSS", "JavaScript", "SQLite"],
      problem: "IP address conflicts occur in labs when users configure static adapters.",
      objective: "Create a central IP allocation ledger mapping names to addresses.",
      features: ["Add IP leases", "Validation preventing double leases", "Searchable leases list"],
      steps: ["Design database layout", "Implement validation checks", "Build leases display board", "Verify SQLite entries"]
    },
    {
      title: "Department Asset Barcode Log",
      difficulty: "Easy",
      category: "Portfolio Project",
      tech: ["HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Lab devices get lost when checked out without serial logs.",
      objective: "Build a text-entry inventory ledger acting as a digital logbook.",
      features: ["Register barcode numbers", "Asset assignment tables", "Active checkout counters"],
      steps: ["Create asset input fields", "Establish Firebase database tables", "Write check-in functions", "Format table dashboard"]
    },
    // Medium (6)
    {
      title: "Multi-Server Syslog Viewer",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Express", "MongoDB", "REST API"],
      problem: "Debugging complex IT issues requires logging into multiple servers individually.",
      objective: "Develop a central log viewer collecting streams from micro-agents.",
      features: ["Central log grid", "Error filter search", "Real-time updates notifications"],
      steps: ["Configure express ingestors", "Establish MongoDB collections schemas", "Build search tables in React", "Setup log alert banners"]
    },
    {
      title: "Active Directory Account Auditor",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["React", "Python", "SQLite", "REST API"],
      problem: "Stale accounts remain active after students graduate, posing security risks.",
      objective: "Build an audit panel identifying inactive user logins.",
      features: ["Profile status lists", "Filter by last login date", "Export action logs to Excel"],
      steps: ["Set up Flask database queries", "Create react table grids", "Add filters sorting functions", "Integrate Excel libraries"]
    },
    {
      title: "DNS Management Dashboard",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      problem: "Editing BIND configs manually leads to syntax errors and network downtime.",
      objective: "Create a graphical dashboard editing and checking DNS records.",
      features: ["DNS Record manager tables", "Syntax checking alerts", "Export zone configs"],
      steps: ["Write BIND layout parser backend", "Build database record tables", "Add DNS verification routines", "Setup React UI forms"]
    },
    {
      title: "Network Subnet Calculator",
      difficulty: "Medium",
      category: "Learning Project",
      tech: ["React", "Node.js", "Express", "SQLite"],
      problem: "Engineers waste time calculating complex IP address ranges manually.",
      objective: "Develop an interactive subnet masking and partitioning dashboard.",
      features: ["Mask bit calculators", "Subnet list partitions", "Visual IP address maps"],
      steps: ["Write binary subnet algorithms", "Build calculations panels in React", "Add range listings tables", "Deploy local Express configurations"]
    },
    {
      title: "Database Backup Automation Panel",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      problem: "Databases lack off-site backups, exposing them to hardware failures.",
      objective: "Build a backup scheduling console logging execution history.",
      features: ["Schedule backups (daily/weekly)", "Download archive link tables", "Execution status bars"],
      steps: ["Configure cron triggers on backend Node", "Integrate SQL dump scripts", "Assemble history tables in React", "Add file downloads triggers"]
    },
    {
      title: "Campus Wi-Fi Bandwidth Analyzer",
      difficulty: "Medium",
      category: "Problem-Solving Project",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      problem: "Bandwidth hogs slow down networks during peak lecture hours.",
      objective: "Develop a telemetry console highlighting heaviest data-consuming devices.",
      features: ["Live bandwidth charts", "IP block action triggers", "Limit configurations panel"],
      steps: ["Simulate network traffic logs", "Build dashboard charts in React", "Write Express API blocking controls", "Integrate MongoDB metrics"]
    },
    // Hard (6)
    {
      title: "Intrusion Detection Alert Panel",
      difficulty: "Hard",
      category: "Hackathon Project",
      tech: ["Next.js", "WebSockets", "PostgreSQL", "JWT"],
      problem: "Security teams miss server attacks because logs are buried in system files.",
      objective: "Build a socket monitoring system flashing alert feeds during port scans.",
      features: ["Live alert banners", "Host scan diagnostics details", "Resolve IP locations"],
      steps: ["Implement TCP scan alert triggers on backend", "Build high-speed socket alerts in React", "Integrate geolocation API mappings", "Secure connections with JWT"]
    },
    {
      title: "Self-Healing Server Daemon",
      difficulty: "Hard",
      category: "Resume Project",
      tech: ["Next.js", "Python", "Flask", "SQLite"],
      problem: "Critical web servers crash overnight, disrupting student services.",
      objective: "Build a background checker daemon auto-restarting crashed services.",
      features: ["Service state tables", "Restart action logs", "Slack alert notifications"],
      steps: ["Write python process monitor scripts", "Expose endpoints showing status logs", "Build management console in Next.js", "Integrate webhook notifications"]
    },
    {
      title: "Vulnerability Scanning Orchestrator",
      difficulty: "Hard",
      category: "Interview Project",
      tech: ["Next.js", "Node.js", "Express", "MongoDB"],
      problem: "Manual security audits are slow, missing out-of-date packages.",
      objective: "Build a web dashboard triggering security audits on connected code repos.",
      features: ["Scan status timelines", "Security threat levels charts", "CSV patches recommendations"],
      steps: ["Integrate scanning libraries on Node", "Build threat level analytics dashboards", "Store scan history profiles in MongoDB", "Configure Next.js UI tabs"]
    },
    {
      title: "Multi-Cloud Resource Inventory",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["Next.js", "Python", "FastAPI", "PostgreSQL"],
      problem: "IT teams lose track of virtual machines across AWS and GCP, racking up costs.",
      objective: "Develop a central aggregator tracking cloud instances.",
      features: ["Cost summary dashboards", "Stale instances checklist", "Cloud provider sync triggers"],
      steps: ["Mock cloud API responses", "Build relational resource schemas", "Design multi-cloud analytics boards", "Expose FastAPI server"]
    },
    {
      title: "IT Assets Auto-Discovery Hub",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["Next.js", "Node.js", "MongoDB", "REST API"],
      problem: "Asset registers quickly become stale as new devices connect to Wi-Fi.",
      objective: "Create a network scanner map listing active network adapters.",
      features: ["Subnet ping sweeper scripts", "MAC vendor lookup tools", "Export lists to PDF/CSV"],
      steps: ["Write node subnet ping scripts", "Integrate MAC vendor database lookups", "Build map layout listings", "Test database integrations"]
    },
    {
      title: "Identity and Access Control Manager",
      difficulty: "Hard",
      category: "Problem-Solving Project",
      tech: ["Next.js", "Node.js", "Express", "PostgreSQL"],
      problem: "Lab access permissions are messy, with students having unnecessary root access.",
      objective: "Develop a centralized user permission control board.",
      features: ["Role assignment menus", "Resource access registries", "Security policy status checks"],
      steps: ["Design PostgreSQL RBAC tables", "Write Express auth middleware modules", "Build role mapping panels in Next.js", "Test policy overrides"]
    },
    // Very Hard (4)
    {
      title: "Federated Identity SSO Server",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Next.js", "Go", "PostgreSQL", "JWT"],
      problem: "Students log into ten different college apps, each requiring a separate password.",
      objective: "Build a central authentication hub passing encrypted tokens to child apps.",
      features: ["OAuth2 authorization code flows", "Security key registries", "App permission controls"],
      steps: ["Write oauth endpoints in Go", "Build secure cookie tokens in Next.js", "Design PostgreSQL account mapping", "Test token exchanges"]
    },
    {
      title: "Zero-Trust API Gateway proxy",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Next.js", "Go", "Redis", "Docker"],
      problem: "Vulnerable backend APIs are exposed directly to public internet threats.",
      objective: "Build an API proxy validating JWT signatures and rate limiting requests.",
      features: ["Reverse proxy pipelines", "Token verification loops", "Rate limiting via Redis"],
      steps: ["Write HTTP proxy layers in Go", "Configure token checks utilizing Redis cache", "Build live proxy dashboard in Next.js", "Setup Docker deployments"]
    },
    {
      title: "Distributed File Sync Engine",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Node.js", "PostgreSQL", "Docker", "REST API"],
      problem: "Academic databases fall out of sync when local lab networks lose connectivity.",
      objective: "Build a file synchronizer agent resolving write conflicts.",
      features: ["Vector clock trackers", "File chunking split routines", "Admin conflict resolution logs"],
      steps: ["Write file hash comparisons on Node", "Configure vector clock tables in PostgreSQL", "Build sync panels in React", "Setup Docker Compose configs"]
    },
    {
      title: "Enterprise Network Traffic Monitor",
      difficulty: "Very Hard",
      category: "Industry-Style Project",
      tech: ["Go", "InfluxDB", "Docker", "REST API"],
      problem: "Standard traffic tools fail to capture packet logs at high speeds.",
      objective: "Build a packet monitoring agent streaming data logs to InfluxDB.",
      features: ["NetFlow data processing", "High-speed charts in Grafana", "Alert notifications daemon"],
      steps: ["Write NetFlow parser routines in Go", "Configure InfluxDB data mappings", "Set up Docker compose network simulations", "Test speed thresholds"]
    },
    // Extremely Hard (4)
    {
      title: "Kubernetes Custom Operator",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Go", "Docker", "Kubernetes", "CI/CD"],
      problem: "Deploying multi-node databases in Kubernetes requires complex manual config files.",
      objective: "Build a Go operator automating database cluster scaling.",
      features: ["Custom Resource Definitions (CRDs)", "Auto-scaling routines", "System health trace monitors"],
      steps: ["Write CRD schemas in Go", "Implement K8s controller reconciliation loops", "Configure test clusters", "Validate failover recoveries"]
    },
    {
      title: "BGP Routing Table Optimizer",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["Python", "Go", "PostgreSQL", "Docker"],
      problem: "ISP networks encounter bottlenecks due to poorly optimized routing tables.",
      objective: "Build an algorithmic routing optimizer simulation.",
      features: ["Dijkstra path algorithms", "Packet traffic simulators", "Routing table conflict logs"],
      steps: ["Write BGP routing path algorithms in Go", "Model network traffic profiles in Python", "Configure PostgreSQL logs", "Run cluster simulations"]
    },
    {
      title: "Cryptographic Certificate Authority",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["Go", "PostgreSQL", "Docker", "JWT"],
      problem: "Third-party SSL certificates are costly for internal local labs.",
      objective: "Create an internal private CA issuing and revoking SSL credentials.",
      features: ["PKI certificate generation", "OCSP revocation status checks", "Admin security keys dashboard"],
      steps: ["Write RSA certificate signing code in Go", "Design PostgreSQL certificate storage", "Build dashboard in React", "Setup Docker infrastructure"]
    },
    {
      title: "Distributed Packet Capture Pipeline",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Go", "Kafka", "Docker", "Kubernetes"],
      problem: "Security groups fail to capture real-time security breaches across large datacenters.",
      objective: "Build a distributed packet analyzer streaming logs to Kafka.",
      features: ["Packet sniffers in C/Go", "Kafka streams integration", "Threat logs dashboard"],
      steps: ["Write raw packet capturing scripts", "Set up Kafka cluster brokers", "Build dashboard panels in React", "Deploy to Kubernetes clusters"]
    }
  ],
  ECE: [
    // Easy (6)
    {
      title: "Arduino LED Matrix Banner",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Clubs lack dynamic digital message signs for meeting rooms.",
      objective: "Interface Arduino with an LED Matrix displaying scrolling notices.",
      features: ["Web dashboard to input text", "Serial USB transmissions", "Scrolling speed controllers"],
      steps: ["Write matrix display firmware", "Build HTML text forms", "Add serial communication hooks", "Validate scrolling speed"]
    },
    {
      title: "Light-Activated Smart Fan",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Lab fans run continuously overnight, wasting electricity.",
      objective: "Create a sensor fan prototype that shuts off when room lights turn off.",
      features: ["LDR sensor telemetry", "Relay on/off controllers", "Alert notifications board"],
      steps: ["Connect LDR sensor to ADC pins", "Write relay trigger loops", "Expose logs to HTML tables", "Test lux cutoffs"]
    },
    {
      title: "Digital Thermometer Board",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Students lack local monitors checking lab temperatures.",
      objective: "Interface LM35 temperature sensor displaying metrics on LCDs.",
      features: ["LM35 temperature reader", "OLED character screen", "High-heat warnings logs"],
      steps: ["Calibrate LM35 voltage readings", "Write OLED display codes", "Build warning light circuits", "Expose logs to local files"]
    },
    {
      title: "RF Remote Door Opener",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Lab keys are lost, making doors hard to open when hands are full.",
      objective: "Build an RF receiver locking door latch via keyfob buttons.",
      features: ["RF receiver logs", "Servo lock controls", "Status indicator lights"],
      steps: ["Wire RF receiver modules", "Write servo control scripts", "Build feedback boards", "Validate RF distance ranges"]
    },
    {
      title: "Soil Moisture Indicator LED",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Plants inside labs dry out due to lack of moisture tracking.",
      objective: "Interface soil probes to light warning LEDs when moisture drops.",
      features: ["Analog moisture logs", "Color warning LEDs", "Reset button logs"],
      steps: ["Calibrate capacitive moisture probes", "Write threshold warning pins", "Create HTML log displays", "Verify moisture values"]
    },
    {
      title: "Water Level Alarm System",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Overhead water tanks overflow, causing water waste.",
      objective: "Build an ultrasonic sensor board triggering buzzers when full.",
      features: ["Ultrasonic distance checker", "Water level percentage grids", "Buzzer warning alarm"],
      steps: ["Calculate distance from time of flight", "Map distance to percentage", "Write buzzer warning trigger", "Verify readings stability"]
    },
    // Medium (6)
    {
      title: "IoT Weather Telemetry Hub",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["ESP32", "HTML", "CSS", "JavaScript", "SQLite"],
      problem: "Local classrooms require micro-climate data for biology projects.",
      objective: "Interface ESP32 with DHT11 sensor to stream readings to a local web server.",
      features: ["Real-time temp/humidity dashboards", "Historical chart graphics", "Alert notifications on thresholds"],
      steps: ["Configure ESP32 Wi-Fi server", "Interface DHT11 sensor", "Build chart views in HTML/JS", "Set up SQLite history logs"]
    },
    {
      title: "Digital Logic Analyzer Simulator",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "HTML", "CSS", "JavaScript"],
      problem: "Students lack access to expensive physical logic analyzers at home.",
      objective: "Build a web-based simulator displaying waveform paths of AND/OR gates.",
      features: ["Logic gate workspace", "Interactive timing diagrams", "Input state switchers"],
      steps: ["Write logical gate solvers", "Build canvas timing waveform charts", "Design gate connections UI", "Test input changes"]
    },
    {
      title: "ESP32 Bluetooth Attendance Log",
      difficulty: "Medium",
      category: "Problem-Solving Project",
      tech: ["ESP32", "HTML", "CSS", "JavaScript", "Firebase"],
      problem: "Class roll calls consume 15 minutes of lecture time.",
      objective: "Build an ESP32 attendance scanner logging student phone Bluetooth MACs.",
      features: ["Bluetooth beacon scan logs", "Student MAC address registry", "Attendance report table sheets"],
      steps: ["Configure ESP32 BLE scans", "Establish Firebase database records", "Match MAC profiles to names", "Display class report boards"]
    },
    {
      title: "Analog Signal Waveform Generator",
      difficulty: "Medium",
      category: "Learning Project",
      tech: ["Arduino", "React", "Chart.js"],
      problem: "Students require frequency sources for analog circuit testing.",
      objective: "Interface DAC module producing sine, square, and triangle waves.",
      features: ["Wave selection dials", "Frequency control sliders", "Visual waveform graph previews"],
      steps: ["Write wave lookups tables on firmware", "Connect DAC output filters", "Build control panel interface", "Verify waveforms output"]
    },
    {
      title: "Smart Irrigation Relay Controller",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["ESP32", "HTML", "CSS", "Firebase"],
      problem: "Gardens are overwatered, wasting water during rainy weeks.",
      objective: "Build a Wi-Fi relay checking local weather APIs before watering.",
      features: ["Rain API sync triggers", "Manual relay override switch", "Water flow trackers"],
      steps: ["Interface ESP32 to weather API", "Write solenoid relay control scripts", "Build configuration page", "Connect to Firebase console"]
    },
    {
      title: "Digital Audio Spectrum Visualizer",
      difficulty: "Medium",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Filters testing is abstract without seeing frequency breakdowns.",
      objective: "Build an LED analyzer showing frequency splits using FFT.",
      features: ["FFT frequency split bands", "Peak frequency trackers", "Interactive RGB displays"],
      steps: ["Write FFT processing scripts on firmware", "Sample analog audio signals", "Map splits to LED matrices", "Test frequency bands output"]
    },
    // Hard (6)
    {
      title: "Real-time Oscilloscope Console",
      difficulty: "Hard",
      category: "Hackathon Project",
      tech: ["React", "Node.js", "WebSockets", "Arduino"],
      problem: "Oscilloscopes are bulky and hard to share for group reports.",
      objective: "Build a high-speed web interface streaming signal waveforms via WebSockets.",
      features: ["High-speed canvas waveforms", "Voltage amplitude triggers", "Frequency spectrum logs"],
      steps: ["Configure Arduino ADC sample loops", "Expose WebSocket server streams in Node", "Write canvas drawing scripts in React", "Integrate frequency measurements"]
    },
    {
      title: "FPGA UART Communication System",
      difficulty: "Hard",
      category: "Resume Project",
      tech: ["Verilog", "Python", "SQLite"],
      problem: "FPGA boards lack direct, friendly interfaces to stream logic metrics to PC apps.",
      objective: "Develop a Verilog UART controller sending state data to Python scripts.",
      features: ["Verilog TX/RX controllers", "Python serial database listener", "Activity timeline charts"],
      steps: ["Write Verilog state machine blocks", "Configure FPGA UART pinouts", "Write Python database logging script", "Verify data bytes consistency"]
    },
    {
      title: "Intelligent Traffic Light Controller",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["ESP32", "Python", "OpenCV", "Firebase"],
      problem: "Fixed-time traffic lights cause unnecessary delays on campus junctions.",
      objective: "Build an ESP32 junction model adjusting green light times based on queue lengths.",
      features: ["Vehicle counting algorithms", "ESP32 junction LED signals", "Congestion dashboard charts"],
      steps: ["Write vehicle counting scripts in OpenCV", "Send vehicle density data to Firebase", "Write ESP32 time-allocation rules", "Verify junction timings"]
    },
    {
      title: "Wearable ECG Monitor",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["ESP32", "React", "Node.js", "SQLite"],
      problem: "Cardiac patients lack lightweight, cheap home heart rhythm recorders.",
      objective: "Interface AD8232 heart sensor with ESP32 streaming readings to mobile web dashboards.",
      features: ["Live heart wave graphs", "Pulse rate anomaly alerts", "Download history log options"],
      steps: ["Interface AD8232 ECG sensor", "Filter raw sensor noise", "Stream data logs via WebSockets", "Build React ECG dashboard"]
    },
    {
      title: "Solar Panel Battery Optimizer",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["ESP32", "HTML", "CSS", "PostgreSQL"],
      problem: "Overcharging degrades solar batteries, shortening their life.",
      objective: "Create a charge controller logging battery parameters to cloud databases.",
      features: ["MPPT tracking loops", "Battery status indicators", "Overcharge cutoff switches"],
      steps: ["Interface voltage sensors", "Calibrate MPPT voltage steps", "Write database sync scripts", "Build monitoring dashboard"]
    },
    {
      title: "Smart Smart Power Socket",
      difficulty: "Hard",
      category: "Problem-Solving Project",
      tech: ["ESP32", "HTML", "CSS", "MongoDB"],
      problem: "Appliances left on standby waste electricity silently.",
      objective: "Build an ESP32 power outlet socket checking consumption.",
      features: ["Energy consumption graphs", "Relay timer switches", "Cost estimate dashboards"],
      steps: ["Interface current sensors", "Write power calculation formulas", "Set up database tracking grids", "Build React control forms"]
    },
    // Very Hard (4)
    {
      title: "SDR Signal Ingestor Panel",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["React", "Python", "FastAPI", "C++"],
      problem: "Software Defined Radio tools lack user-friendly web control dashboards.",
      objective: "Develop a web dashboard tuning SDR frequencies and showing spectrum analyses.",
      features: ["Waterfall spectrum canvas", "Frequency dial menus", "Demodulation audio logs"],
      steps: ["Write SDR driver interfaces in C++", "Configure spectrum analysis loops in Python", "Expose web interfaces in FastAPI", "Test radio tuning scripts"]
    },
    {
      title: "FPGA-Accelerated Cryptographic Node",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Verilog", "C++", "Docker", "REST API"],
      problem: "Standard CPUs verify secure encryption slowly under heavy load.",
      objective: "Implement hardware-accelerated AES algorithms on FPGA boards.",
      features: ["AES-128 hardware blocks", "C++ testing controllers", "Performance comparison tables"],
      steps: ["Write AES module blocks in Verilog", "Configure FPGA memory adapters", "Build API test panels in React", "Compare CPU vs FPGA speeds"]
    },
    {
      title: "Distributed Telemetry Mesh Network",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["ESP32", "Node.js", "MongoDB", "Docker"],
      problem: "Forest areas lack Wi-Fi, making wildfire telemetry impossible to gather.",
      objective: "Deploy a LoRa mesh network routing sensor alerts to base nodes.",
      features: ["LoRa mesh routing algorithms", "Wildfire sensor status dashboards", "Offline packet buffers"],
      steps: ["Write ESP32 LoRa routing scripts", "Assemble environmental sensor rigs", "Build central map UI dashboards", "Setup Docker server configurations"]
    },
    {
      title: "Autonomous Battery Balancing Grid",
      difficulty: "Very Hard",
      category: "Industry-Style Project",
      tech: ["ESP32", "HTML", "CSS", "PostgreSQL"],
      problem: "Battery pack cells discharge unevenly, causing sudden pack shutdowns.",
      objective: "Build an active cell balancer routing charge between cells.",
      features: ["Cell voltage monitors", "Active relay routing switches", "Safety alert status dashboards"],
      steps: ["Interface individual cell ADC circuits", "Write cell balancing logic rules", "Configure PostgreSQL logs", "Build safety dashboard pages"]
    },
    // Extremely Hard (4)
    {
      title: "Real-time CNC Controller Board",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Verilog", "C++", "React", "ROS"],
      problem: "Standard CNC mills lose coordinate accuracy during rapid operations.",
      objective: "Implement a high-speed stepper driver coordination system on FPGA.",
      features: ["Stepper coordinate interpolators", "G-code interpreter interfaces", "Visual toolpath canvas views"],
      steps: ["Write coordinate solvers in Verilog", "Build G-code interpreters in C++", "Create React control panels", "Validate axes coordination"]
    },
    {
      title: "Distributed Acoustic Sensor Array",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["C++", "Python", "WebSockets", "Docker"],
      problem: "Pinpointing loud gunshots or noise pollution in smart cities is slow.",
      objective: "Build an acoustic array triangulating sounds using time of arrival.",
      features: ["Time difference of arrival calculations", "Live sound location maps", "Sensor grid sync logs"],
      steps: ["Write acoustic sample loops in C++", "Implement location calculation algorithms", "Build WebSocket server streams", "Validate mapping accuracy"]
    },
    {
      title: "Multi-Channel LiDAR Scanner",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["Verilog", "C++", "React", "Three.js"],
      problem: "3D map scanning is expensive, requiring heavy lasers and receivers.",
      objective: "Build a custom rotary scanner rendering 3D maps using Three.js.",
      features: ["3D point cloud maps", "Rotary motor controls", "Point cloud filter options"],
      steps: ["Write rotary motor controllers in Verilog", "Configure point buffers in C++", "Render point clouds in Three.js", "Verify scanner mappings"]
    },
    {
      title: "High-Frequency Lock-In Amplifier",
      difficulty: "Extremely Hard",
      category: "Knowledge Project",
      tech: ["Verilog", "C++", "Python", "Docker"],
      problem: "Small sensor outputs are drowned in high environmental electrical noise.",
      objective: "Design a digital lock-in amplifier recovering signals from noise.",
      features: ["Phase-sensitive detector blocks", "Frequency multiplier registers", "Wave analytics dashboards"],
      steps: ["Write phase-sensitive solvers in Verilog", "Configure DAC filters outputs", "Build analytics boards in React", "Validate signal recovery speeds"]
    }
  ],
  EEE: [
    // Easy (6)
    {
      title: "Smart Solar Intensity Meter",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Students position solar panel prototypes randomly, wasting power.",
      objective: "Build an LDR intensity monitor plotting optimal sun angles.",
      features: ["Lux intensity meter", "Peak angle tracker", "Alert buzzer when dark"],
      steps: ["Connect LDR sensors", "Map ADC inputs to lux metrics", "Write serial graphing scripts", "Verify angle efficiency"]
    },
    {
      title: "Digital AC Phase Indicator",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Wiring multi-phase motors without phase indicators causes rotation faults.",
      objective: "Build a zero-crossing detector showing active mains frequencies.",
      features: ["AC zero-crossing timers", "Phase status indicator screen", "Warning alarms panels"],
      steps: ["Assemble opto-coupler zero-cross circuits", "Measure mains frequency offsets", "Display active cycles", "Test safety isolation"]
    },
    {
      title: "Battery Charge State Gauge",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Unmonitored lithium battery cells degrade from over-discharging.",
      objective: "Create an LED indicator bar showing voltage capacity.",
      features: ["Cell voltage readings", "LED capacity steps", "Low voltage alarms logs"],
      steps: ["Calibrate resistive voltage dividers", "Write LED segment code registers", "Configure warning alarm triggers", "Verify battery levels"]
    },
    {
      title: "Stepper Motor Velocity Dial",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Students lack easy control interfaces to calibrate test conveyor motors.",
      objective: "Interface potentiometer dials setting stepper rotations.",
      features: ["Potentiometer ADC speed mappings", "Stepper step pulse clocks", "Direction switch dials"],
      steps: ["Wire stepper drivers", "Write velocity map code loops", "Add direction check checks", "Validate rotation outputs"]
    },
    {
      title: "Current Overload Cutoff Relay",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Lab benches lack automatic circuit breakers for low-voltage setups.",
      objective: "Build a relay switch disconnecting power when current exceeds 2 Amps.",
      features: ["ACS712 current reader", "Relay trip triggers", "Reset push button"],
      steps: ["Calibrate current sensor scales", "Write relay tripping rules", "Build status panel interfaces", "Verify overload limits"]
    },
    {
      title: "Digital Ground Fault Detector",
      difficulty: "Easy",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Ground leakage currents pose safety hazards to lab technicians.",
      objective: "Build a sensor monitoring leakage currents and tripping indicators.",
      features: ["Current comparison logs", "Trip relay registers", "Audible fault alarm"],
      steps: ["Interface leakage current sensors", "Write delta evaluation loops", "Configure buzzer alert triggers", "Test current ground faults"]
    },
    // Medium (6)
    {
      title: "Smart Power Load Controller",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["ESP32", "HTML", "CSS", "JavaScript", "SQLite"],
      problem: "High-wattage appliances run during peak billing hours, raising costs.",
      objective: "Build a web-controlled outlet scheduler checking active power loads.",
      features: ["Energy dashboard charts", "Relay timers triggers", "Current overload cutoff alarms"],
      steps: ["Interface ACS712 current sensors", "Write power calculations formulas", "Setup SQLite dashboard tables", "Configure relay controls"]
    },
    {
      title: "Dual-Axis Solar Tracker",
      difficulty: "Medium",
      category: "Portfolio Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Fixed angle panels suffer lower energy output as the sun moves.",
      objective: "Build a panel tracking light using 4 LDRs and two servos.",
      features: ["Dual-axis angle trackers", "Servomotor position controls", "Voltage output telemetry"],
      steps: ["Assemble panel pan-tilt mechanics", "Write sensor balance algorithms", "Build serial diagnostic pages", "Compare tracker outputs"]
    },
    {
      title: "Electric Motor Speed Governor",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["React", "Python", "Flask", "SQLite"],
      problem: "DC motor speeds drift under changing load weights, causing conveyor jams.",
      objective: "Implement a digital PID control loop governing motor velocities.",
      features: ["PID speed regulation controls", "Speed dial selector dashboard", "Telemetry logs tables"],
      steps: ["Write PID calculation loop scripts", "Configure ADC tachometer feedback", "Build React parameter controls", "Validate speed changes"]
    },
    {
      title: "Smart Power Grid Simulator",
      difficulty: "Medium",
      category: "Learning Project",
      tech: ["React", "HTML", "CSS", "JavaScript"],
      problem: "Smart grid concepts are abstract, making load-shedding hard to visualize.",
      objective: "Build a web simulator detailing city load-shedding allocations.",
      features: ["Interactive grid layouts", "Power supply sliders", "Blackout sector alerts"],
      steps: ["Write grid balance models", "Build interactive maps in React", "Add blackout status alarms", "Test variable load profiles"]
    },
    {
      title: "Multi-Cell Battery Monitor (BMS)",
      difficulty: "Medium",
      category: "Resume Project",
      tech: ["ESP32", "HTML", "CSS", "Firebase"],
      problem: "Lithium battery packs crash if individual cell voltages fall out of balance.",
      objective: "Create an ESP32 logger displaying cell parameters on charts.",
      features: ["Cell voltage balance indicators", "Over-heat thermal limits", "Firebase datastream charts"],
      steps: ["Interface cell monitoring multiplexers", "Configure thermistor logs", "Build React telemetry boards", "Set up Firebase database logs"]
    },
    {
      title: "AC Voltage Variac Controller",
      difficulty: "Medium",
      category: "Learning Project",
      tech: ["Arduino", "HTML", "CSS", "JavaScript"],
      problem: "Lab variacs require manual adjustments, slowing automated testing.",
      objective: "Build a servo-driven variac setting voltages via serial lines.",
      features: ["Voltage setting selector", "Servo position controls", "AC voltage metrics dashboards"],
      steps: ["Write servo position maps on firmware", "Interface AC voltage detectors", "Build control interface panels", "Validate safety barriers"]
    },
    // Hard (6)
    {
      title: "MPPT Solar Charge Controller",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["ESP32", "React", "Node.js", "PostgreSQL"],
      problem: "Solar setups waste energy due to inefficient panel-to-battery matching.",
      objective: "Create an MPPT buck-converter streaming charging profiles to web portals.",
      features: ["MPPT tracking loops", "Wattage graphs", "Overcharge cutoff switches"],
      steps: ["Write MPPT tracking routines", "Assemble buck converter components", "Expose WebSockets data streams", "Build React charging dashboards"]
    },
    {
      title: "Smart Electricity Meter Dashboard",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["Next.js", "Node.js", "MongoDB", "WebSockets"],
      problem: "Tenants receive shock electricity bills without real-time tracking.",
      objective: "Develop a home electricity meter dashboard plotting usage.",
      features: ["Live power utilization graphs", "Monthly cost forecast trackers", "High load alert emails"],
      steps: ["Write current/voltage data generators", "Expose WebSocket logging channels", "Build cost charts in Next.js", "Integrate email alerts"]
    },
    {
      title: "Industrial PID Motor Controller",
      difficulty: "Hard",
      category: "Interview Project",
      tech: ["Next.js", "Python", "Flask", "PostgreSQL"],
      problem: "Factory motors experience torque surges during load changes.",
      objective: "Build a tuning dashboard managing PID values remotely.",
      features: ["PID tuning sliders", "Step response plots", "Fault log history tables"],
      steps: ["Write step response solvers in Python", "Build real-time charts in Next.js", "Connect database logging logs", "Verify speed calibrations"]
    },
    {
      title: "Micro-Grid Battery Inverter Sync",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["ESP32", "HTML", "CSS", "MongoDB"],
      problem: "Adding backup battery power to solar grids causes voltage conflicts.",
      objective: "Build a sync controller aligning inverter outputs with grid waves.",
      features: ["Phase-lock loop (PLL) telemetry", "Relay grid connector controls", "Inverter health logs"],
      steps: ["Write digital PLL codes on firmware", "Calibrate zero-crossing sensors", "Build monitoring dashboards", "Verify phase sync accuracy"]
    },
    {
      title: "Smart Home Peak Load Shaver",
      difficulty: "Hard",
      category: "Problem-Solving Project",
      tech: ["Next.js", "Node.js", "Express", "SQLite"],
      problem: "High peak electricity rates raise monthly utility costs.",
      objective: "Build a relay controller shedding heavy loads when total power spikes.",
      features: ["Load priority ranking dashboards", "Relay disconnect triggers", "Power limit configs"],
      steps: ["Write load prioritization loops", "Setup Express relay controllers", "Build priority sliders in Next.js", "Test overload cutoffs"]
    },
    {
      title: "Electric Vehicle Battery Lifecycle Hub",
      difficulty: "Hard",
      category: "Major Project",
      tech: ["Next.js", "Python", "FastAPI", "SQLite"],
      problem: "Assessing second-life battery packs requires manual cycle testing.",
      objective: "Develop a battery tester logging charge curves.",
      features: ["Capacity decay graphs", "State of health estimates", "Export data to Excel"],
      steps: ["Write python battery capacity estimators", "Stream charge logs via serial", "Build React lifecycle dashboards", "Validate state estimates"]
    },
    // Very Hard (4)
    {
      title: "Decentralized Micro-Grid Ledger",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Next.js", "Go", "Supabase", "Docker"],
      problem: "Neighbors lack a secure system to trade surplus solar power directly.",
      objective: "Build a decentralized ledger recording local power exchanges.",
      features: ["Smart contract trade records", "Energy transaction dashboards", "Wallet account credits"],
      steps: ["Write transaction registry nodes in Go", "Configure Supabase logs", "Build dashboard panels in Next.js", "Validate trade settlement speeds"]
    },
    {
      title: "Smart Smart Substation Controller",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["Next.js", "Python", "FastAPI", "PostgreSQL"],
      problem: "Transformer overloads cause widespread blackouts without rapid isolation.",
      objective: "Build a diagnostic console isolating faults within 50ms.",
      features: ["Transformer telemetry graphs", "Fault locator maps", "Remote circuit breaker triggers"],
      steps: ["Simulate transformer fault spikes in Python", "Expose control APIs in FastAPI", "Build mapping dashboards in Next.js", "Verify breaker trigger speeds"]
    },
    {
      title: "Grid Harmonic Wave Analyzer",
      difficulty: "Very Hard",
      category: "Final Year Project",
      tech: ["ESP32", "React", "Node.js", "MongoDB"],
      problem: "Non-linear electrical loads generate harmonics, heating up power grids.",
      objective: "Build an ESP32 FFT signal analyzer showing grid harmonic divisions.",
      features: ["FFT harmonic graphs", "Total Harmonic Distortion (THD) alerts", "Data CSV exports"],
      steps: ["Write FFT processing scripts on ESP32", "Stream spectral segments to Node server", "Build FFT charts in React", "Integrate MongoDB history"]
    },
    {
      title: "Smart Motor Coil Temperature Analyzer",
      difficulty: "Very Hard",
      category: "Industry-Style Project",
      tech: ["ESP32", "HTML", "CSS", "PostgreSQL"],
      problem: "Industrial pumps burn out because internal windings over-heat silently.",
      objective: "Develop a temperature estimator analyzing motor phase resistances.",
      features: ["Resistance temperature calculators", "Pump trip relay triggers", "Safety threshold dials"],
      steps: ["Interface high-precision current meters", "Write temperature estimations equations", "Configure PostgreSQL logs", "Build control dashboards"]
    },
    // Extremely Hard (4)
    {
      title: "Static VAR Grid Compensator",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["Verilog", "C++", "React", "Docker"],
      problem: "Industrial motor starters drop grid voltages, causing computer reboots.",
      objective: "Implement a digital compensator injecting reactive power on FPGA.",
      features: ["Phase-angle detection blocks", "Thyristor relay triggers", "Mains voltage stability charts"],
      steps: ["Write phase detection models in Verilog", "Configure thyristor switches in C++", "Build React diagnostic boards", "Validate voltage resets"]
    },
    {
      title: "Distributed Power Flow Calculator",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Go", "Kubernetes", "Redis", "Docker"],
      problem: "City grid models take hours to compute load flows under emergency changes.",
      objective: "Build a distributed solver calculating power paths across grid nodes.",
      features: ["Newton-Raphson flow solvers", "Grid node map views", "Task worker status logs"],
      steps: ["Write Newton-Raphson algorithms in Go", "Set up distributed Redis task worker pools", "Build dashboards in React", "Deploy to Kubernetes"]
    },
    {
      title: "Multi-Inverter Synchronization Matrix",
      difficulty: "Extremely Hard",
      category: "Final Year Project",
      tech: ["Verilog", "C++", "React", "Docker"],
      problem: "Paralleling multiple off-grid solar inverters causes destructive currents.",
      objective: "Build a high-speed controller aligning inverter waves.",
      features: ["Multi-phase synchronization boards", "Active current balancing registers", "Wave sync dials"],
      steps: ["Write wave-synchronizers in Verilog", "Build current balancing loops in C++", "Create React control panels", "Validate phase sync speeds"]
    },
    {
      title: "Smart EV Charger Grid Arbitrageur",
      difficulty: "Extremely Hard",
      category: "Industry-Style Project",
      tech: ["Go", "Kubernetes", "PostgreSQL", "Docker"],
      problem: "EV charging blocks overload local distribution lines during peak times.",
      objective: "Develop an automated controller pacing charging based on grid prices.",
      features: ["Price matching algorithms", "EV battery charging rate limiters", "Cost saving calculators"],
      steps: ["Write pricing algorithms in Go", "Configure PostgreSQL transactions schedules", "Build dashboards in React", "Deploy container networks"]
    }
  ]
};

// Fill out the remaining branches dynamically to make exactly 432 high-quality unique projects
const remainingBranches = [
  'Mechanical', 'Civil', 'AI/ML', 'Data Science', 'Cybersecurity', 'IoT', 
  'Embedded Systems', 'Robotics', 'Full Stack', 'Cloud', 'DevOps', 'Mobile Development', 'General'
];

// Helper to fill rest dynamically with distinct engineering templates to ensure 432 total projects
const fillAll432Projects = (): ProjectIdea[] => {
  const finalProjectsList: ProjectIdea[] = [];
  
  // 1. Process explicit branches
  Object.keys(branchProjects).forEach((branch) => {
    const list = branchProjects[branch];
    list.forEach((p, idx) => {
      finalProjectsList.push(assembleProject(p, branch, `${branch.toLowerCase()}_${idx}`));
    });
  });
  
  // 2. Generate for remaining branches (26 projects each) and General (16 projects)
  // Let's programmatically define highly structured, unique projects for each remaining branch
  // to avoid repetition and guarantee that every single project is practical, realistic, and non-empty.
  
  const vocabularies: Record<string, {
    titles: string[];
    problems: string[];
    objectives: string[];
    tech: string[][];
    features: string[][];
  }> = {
    Mechanical: {
      titles: [
        "Friction Wear Predictor", "Smart HVAC Damper Controller", "Gearbox Backlash Calibrator",
        "Acoustic Noise Diagnostic Board", "Hydraulic Pressure Monitor", "CNC Tool Wear Estimator",
        "Pneumatic Air Leakage Detector", "Solar Thermal Collector Governor", "Conveyor Belt Speed Governor",
        "Robotic End-Effector Controller", "Vibration Harmonic Damper Control", "Engine Exhaust Thermal Logger",
        "Wind Tunnel Velocity Controller", "Pump Cavitation Detector", "Suspension Stress Profiler",
        "Material Fatigue Tester Panel", "Thermal Expansion Logger", "Smart Lubricant Viscosity Meter",
        "Boiler Pressure Safety Valve Monitor", "Hydro-Turbine Speed Governor", "Flywheel Energy Storage Monitor",
        "Dual-Clutch Transmission Simulator", "Centrifugal Fan Damper Controller", "Pipe Corrosion Deflection Logger",
        "Heat Exchanger Thermal Optimizer", "Strap Tension Load Monitor"
      ],
      problems: [
        "High friction wear causes unexpected failures in mechanical gear assemblies.",
        "Static ventilation dampers consume excess power and maintain poor air mixtures.",
        "Backlash in robotic gear trains introduces positioning errors during operations."
      ],
      objectives: [
        "Build a telemetry dashboard tracking and predicting friction wear curves.",
        "Design a PID controller adjusting HVAC damper angles based on indoor air parameters.",
        "Implement a compensation algorithm correcting backlash errors in joint motors."
      ],
      tech: [
        ["React", "Python", "Flask", "Three.js"],
        ["HTML", "CSS", "JavaScript", "SQLite"],
        ["C++", "Arduino", "SQLite"]
      ],
      features: [
        ["3D CAD mesh visualizers", "Wear progress indicator bars", "CSV export logs"],
        ["Damper angle override sliders", "Air quality alerts", "Daily status reports"],
        ["Gear error calibration inputs", "Joint angle telemetry graphs", "Zero-position resets"]
      ]
    },
    Civil: {
      titles: [
        "Concrete Curing Moisture Tracker", "Smart Bridge Stress Logger", "Rainwater Drainage Overflow Monitor",
        "Seismic Ground Shaking Recorder", "Traffic Congestion Diagnostic Board", "Retaining Wall Tilt Monitor",
        "Soil Settlement Deflection Log", "Smart Water Pipeline Leak Detector", "Pavement Deflection Profiler",
        "Campus Traffic Flow Calculator", "Smart Building Ventilation Monitor", "Foundation Settlement Tracker",
        "Landslide Early Warning Telemetry", "Dam Water Level Relay Controller", "Air Quality Dispersion Map",
        "Urban Parking Spot Optimizer", "Smart Asphalt Cure Monitor", "Hydraulic Flow Rate Logger",
        "Smart Pile Driver Impact Counter", "Subgrade Soil Density Profiler", "Acoustic Noise Pollution Mapper",
        "Smart Geotextile Strain Logger", "Trench Safety Gas Detector", "Solar Radiation Roof Map",
        "Smart Water Supply Valving Board", "Tunnel Deflection Warning Panel"
      ],
      problems: [
        "Concrete cures unevenly if surface moisture levels drop below critical thresholds.",
        "Bridge structural columns develop microscopic cracks under heavy thermal shifts.",
        "Storm drains overflow during sudden rainfall due to static, unmonitored blockages."
      ],
      objectives: [
        "Create a wireless moisture sensor grid logging curing parameters.",
        "Build a deflection monitoring console showing structural loading levels.",
        "Design a water-level telemetry system with automatic drainage warning indicators."
      ],
      tech: [
        ["React", "Leaflet.js", "Firebase"],
        ["Next.js", "Node.js", "MongoDB", "REST API"],
        ["HTML", "CSS", "JavaScript", "SQLite"]
      ],
      features: [
        ["GIS map marker views", "Moisture warning alerts", "Historical data charts"],
        ["Strain gauge load graphs", "Overload alarm sounds", "Sensor status checks"],
        ["Water level height charts", "Buzzer warning alarms", "Pump relay overrides"]
      ]
    },
    "AI/ML": {
      titles: [
        "AI Resume ATS Matching Scanner", "AI Conversational Viva Practice Bot", "Visual Object Recognition Sandbox",
        "AI Academic Grade Predictor", "Smart Document Summarization Hub", "Medical Image Pathology Classifier",
        "AI Crop Disease Detector", "AI Code Refactoring Assistant", "Conversational SQL Query Generator",
        "AI Sentiment Feedback Dashboard", "Smart Traffic Density Classifier", "AI Campus Chatbot Assistant",
        "AI Anomaly Log Parser", "AI Sound Event Detector", "AI Document Key-Value Ingestor",
        "Smart Predictive Maintenance Classifier", "AI Signature Verification Panel", "AI Hand Gesture Control Board",
        "AI Text Summarization Dashboard", "AI Speech-to-Text Meeting Summarizer", "AI Real-time Translation Panel",
        "AI Financial Fraud Analyzer", "AI Product Demand Forecaster", "AI Campus Map Navigator Assistant",
        "AI Automated Quiz Evaluator", "AI Smart Recommendation Assistant"
      ],
      problems: [
        "Students get rejected by ATS software due to poorly structured resumes.",
        "Exam preparation is abstract without interactive practice questions.",
        "Classifying objects in video streams is difficult for traditional software logic."
      ],
      objectives: [
        "Build an NLP parser analyzing resume keyword alignments.",
        "Create a text chatbot asking course syllabus questions dynamically.",
        "Design an image classification dashboard mapping identified objects."
      ],
      tech: [
        ["React", "Python", "FastAPI", "NLP"],
        ["Next.js", "Node.js", "MongoDB", "WebSockets"],
        ["HTML", "CSS", "JavaScript", "TensorFlow"]
      ],
      features: [
        ["PDF parsing uploads", "ATS compatibility ratings", "Skills gap analyses"],
        ["Chat response fields", "Syllabus topic selector dropdowns", "Score summaries"],
        ["Camera feed previews", "Confidence score badges", "Detected items rosters"]
      ]
    },
    "Data Science": {
      titles: [
        "Campus Placement Analytics Hub", "Student Performance Insights Board", "Library Book Usage Analytics",
        "Electric Vehicle Charge Curve Dashboard", "Student Gym Usage Predictor", "Interactive Class Timetable Solver",
        "Carbon Footprint Tracker", "Student Expenses Insights Panel", "Campus Wifi Utilization Map",
        "Student Mood Analytics Dashboard", "Course Syllabus Progress Analytics", "Hostel Electricity Consumption Hub",
        "Campus Traffic Flow Analytics", "Alumni Careers Placement Tracker", "Student Lab Resource Allocator",
        "Smart Canteen Sales Forecast", "Academic Paper Citation Network Map", "Engineering Simulator Analytics Dashboard",
        "Water Flow Rate History Panel", "Equipment Checkout Life Analyzer", "Smart Student Attendance Profiler",
        "Lab Server Memory Leak Auditor", "Class Quiz Question Optimizer", "Solar Battery Health Analyzer",
        "Student Workspace Goal Tracker", "Student Placement Test Score Profiler"
      ],
      problems: [
        "Placement offices struggle to track batch performance and salary trends.",
        "Course grading databases are massive, making student gaps hard to identify."
      ],
      objectives: [
        "Develop a graphical analytics dashboard mapping student placement stats.",
        "Build a diagnostic data hub highlighting subjects with low passing rates."
      ],
      tech: [
        ["React", "Python", "FastAPI", "Tableau"],
        ["HTML", "CSS", "JavaScript", "SQLite"]
      ],
      features: [
        ["Salary histograms", "Eligible student rosters", "Company matching matrices"],
        ["Unit progress bars", "Final grade predictions", "Target goals checklist"]
      ]
    },
    Cybersecurity: {
      titles: [
        "SQL Injection Detection Firewall", "Vulnerability Security Port Scanner", "Zero-Trust Identity Manager",
        "Secure Password Vault Manager", "Wi-Fi Packet Sniffer Ingestor", "Host-Based File Integrity Auditor",
        "Centralized Log Threat Monitor", "API Request Rate Limiter Proxy", "Network ARP Spoofing Monitor",
        "Smart Authentication MFA Server", "Encrypted Chat Client Platform", "Digital Forensics Log Parser",
        "Ransomware Behavioral Alert Daemon", "SSO Access Authorization Gate", "Secure Shell SSH Session Recorder",
        "Phishing Email Diagnostic Tool", "Dynamic DNS Security Shield", "API Key Revocation Orchestrator",
        "Secure Web Proxy Access Logs", "Database Row Encryption Tool", "Smart Firewall Rules Editor",
        "Linux Process Privilege Auditor", "SSL Certificate Status Monitor", "Secure Encrypted USB Sync Agent",
        "Kubernetes Resource Security Scan", "Dynamic Vulnerability Assessment Map"
      ],
      problems: [
        "Web applications are vulnerable to SQL Injection attacks on login forms.",
        "System administrators miss vulnerability vectors on open TCP ports."
      ],
      objectives: [
        "Develop an interceptor middleware analyzing SQL query patterns.",
        "Build a scanning portal testing port connections and highlighting vulnerabilities."
      ],
      tech: [
        ["Next.js", "Node.js", "Express", "PostgreSQL"],
        ["HTML", "CSS", "JavaScript", "Docker"]
      ],
      features: [
        ["Threat alerts notifications", "Intercept logs tables", "Rule configurators"],
        ["Port status boards", "Software version checks", "PDF patch reports"]
      ]
    },
    IoT: {
      titles: [
        "IoT Weather Forecasting Hub", "Smart Smart Power Socket Relay", "Ambient Classroom Light Controller",
        "IoT Concrete Curing Monitor", "Smart Asset Location Tracker", "Water Flow Rate Meter Grid",
        "Smart Plant Moisture Relay", "IoT Lab Entrance Locker", "Sound Level Acoustic Monitor",
        "Smart Gas Leakage Warning Alarm", "Vibration Diagnostics Node", "Solar Power Array Logger",
        "Smart Canteen Food Scale Logger", "IoT Water Tank Level Valve", "RFID Locker Booking Panel",
        "Smart Chair Occupancy Detector", "Smart Gym Locker Alert", "IoT Server Room Thermal Alert",
        "Smart Window Rain Shield Control", "IoT Smart Trash Bin Indicator", "Battery Charger Load Shaver",
        "Smart Solenoid Water Valve", "RFID Student Attendance Log", "IoT Smart Grid Power Meter",
        "Smart Greenhouse Temperature Governor", "IoT Vibration Stress Ingestor"
      ],
      problems: [
        "Agricultural fields lack localized sensors to predict microclimate droughts.",
        "Appliances consume standby power continuously, inflating electrical costs."
      ],
      objectives: [
        "Interface ESP32 with sensors streaming temperature metrics to dashboards.",
        "Build a smart relay plug measuring and cutting standby current."
      ],
      tech: [
        ["ESP32", "HTML", "CSS", "Firebase"],
        ["Arduino", "React", "SQLite"]
      ],
      features: [
        ["Telemetry charts", "Threshold settings sliders", "Email warning alerts"],
        ["Relay toggle buttons", "Energy cost gauges", "Usage history logs"]
      ]
    },
    "Embedded Systems": {
      titles: [
        "Arduino LED Array Scrolling Banner", "Light-Activated Smart Fan Relay", "OLED Characters Digital Thermometer",
        "Digital AC Phase Zero Detector", "Cell Battery Voltage Monitor", "Stepper Motor Rotational Dial",
        "Current Overload Trip Relay", "Ultrasonic Fluid Level Monitor", "RF Latch Remote Lock",
        "Soil Moisture Probe Warning", "RGB Audio FFT Spectrum Analyzer", "ADC Variable Waveform Generator",
        "ESP32 Bluetooth Scan Registrar", "PWM AC Voltage Governor", "Relay Ground Fault Detector",
        "Solar Panel Voltage Compensator", "Conveyor Belt Obstacle Checker", "Industrial Gas Sensor Calibrator",
        "Precision Weighing Scale Calibration", "Laser Distance Range Profiler", "Water Flow Pulse Counter",
        "Active Cooling Thermal Governor", "Analog Pressure Transducer Logger", "Smart Card RFID Reader Terminal",
        "Digital Wave Signal Generator", "Rotary Encoder Calibration Panel"
      ],
      problems: [
        "Clubs lack dynamic digital displays to post meeting updates.",
        "Electric fans run in empty lab rooms, wasting energy."
      ],
      objectives: [
        "Interface Arduino with an LED Matrix displaying user-configured messages.",
        "Build a sensor relay prototype switching fans off when lights go dark."
      ],
      tech: [
        ["Arduino", "HTML", "CSS", "JavaScript"],
        ["ESP32", "React", "SQLite"]
      ],
      features: [
        ["Web sign boards controls", "Scrolling speed options", "Color presets selector"],
        ["Light sensors status", "Relay state indicator", "Warning chimes panel"]
      ]
    },
    Robotics: {
      titles: [
        "Robotic Arm Slider Control Panel", "Self-Balancing Robot Gyro Monitor", "Autonomous Floor Rover Map",
        "Inverse Kinematics Joint Solver", "Robotic Rover Camera Console", "Interactive Stepper Motor Calibrator",
        "Solenoid Sorting Conveyor Dashboard", "Servo Angle Calibration Workspace", "Robotic Claw Force Analyzer",
        "Lidar Room Point Cloud Visualizer", "Hexapod Robotic Leg Sync Simulator", "Dijkstra Navigation Pathfinder",
        "Visual Odometry Path Plotter", "Smart AGV Grid Task Dispatcher", "Drone Battery Telemetry Panel",
        "Omnidirectional Drive Kinematics Map", "Robotic Face Tracker Pan-Tilt", "IMU Attitude Pitch Roll Visualizer",
        "Robot Safety Stop Alert Panel", "Industrial Robotic Arm G-Code Solver", "Pick and Place Robot Monitor",
        "Dynamic Robotic Leg Simulator", "Mobile Rover Obstacle Alerts", "Smart Sorting Conveyor Belt Tracker",
        "Underwater ROV Sensor Dashboard", "Autonomous Rover Path Tracker"
      ],
      problems: [
        "Robotic arms are complex to calibrate and lack remote visual control systems.",
        "Two-wheeled rovers fall over if accelerometer calibrations drift."
      ],
      objectives: [
        "Create a Three.js interface to visualize and drive robotic arms.",
        "Build an IMU-stabilized control board balancing rovers."
      ],
      tech: [
        ["React", "Three.js", "ROS (Robot OS)"],
        ["C++", "Arduino", "SQLite"]
      ],
      features: [
        ["3D arm coordinate grids", "Joint angle sliders", "Override buttons"],
        ["Pitch and roll indicators", "Balance angle dials", "Auto-calibrator triggers"]
      ]
    },
    "Full Stack": {
      titles: [
        "Alumni Professional Networking Hub", "Campus Group Project Workspace", "Hostel Complaint Ticket Tracker",
        "Canteen Pre-Order Cart Portal", "Smart Library Desk Reservation Grid", "Student Study Group Matching App",
        "Campus Lost Items Bulletin Board", "Class Lab Check-out Registry", "Midterm Countdown Planner Panel",
        "Student Club Membership Portal", "Automated Quiz Seating Planner", "AI PDF Parsing ATS Auditor",
        "Placement Salary Analytics Board", "Smart Course Elective Recommender", "Multi-Tenant LMS Platform Console",
        "Decentralized Voting Ledger App", "Distributed Ingestion Log Viewer", "Distributed Cache Configuration Panel",
        "P2P Encrypted File Swapper Dashboard", "Custom Sandbox Execution Sandbox", "Distributed Transaction Coordinator",
        "Optimized Database Lexical Parser", "Student Course Selection Dashboard", "Student Project Goal Planner",
        "Smart Campus Helpdesk Ticketing System", "Interactive Student Attendance Table"
      ],
      problems: [
        "Students lack verified, secure portals to seek guidance from seniors.",
        "Group project teams struggle to coordinate code updates and schedules."
      ],
      objectives: [
        "Build a full-stack directory connecting users with department alumni.",
        "Develop a collaborative workspace supporting notes sharing and chat rooms."
      ],
      tech: [
        ["React", "Node.js", "Express", "PostgreSQL"],
        ["Next.js", "Node.js", "MongoDB", "WebSockets"]
      ],
      features: [
        ["Alumni directory views", "Mentorship reservation schedules", "Referral lists"],
        ["Real-time chat widgets", "Shared check-lists", "File upload links"]
      ]
    },
    Cloud: {
      titles: [
        "Multi-Cloud Resource Inventory Console", "Serverless Database Backup Daemon", "Cloud Instance Cost Aggregator",
        "S3 Encrypted Object Ingestion Pipeline", "Cloud Telemetry Event Aggregator", "Serverless Image Thumbnail Resizer",
        "Cloud Billing Alarm SMS Portal", "Distributed Secret Vault Manager", "Edge Network CDN Cache Monitor",
        "Dynamic IP DNS Registrant Controller", "Serverless API Gateway Throttle", "Elastic Scaling VM Group Coordinator",
        "Cloud Log Search and Filter Dashboard", "Docker Container Image Registry Dashboard", "Serverless Quiz Grading Ingestion Pool",
        "Cloud-Based Document PDF Converter", "Edge Node Health Check Daemon", "Multi-Region DB Sync Controller",
        "Cloud VPC Access Flow Log Parser", "Serverless SMS Notification Scheduler", "Static Site Deployment Pipeline",
        "Cloud Storage Lifecycle Optimizer", "Edge Server Log Pipeline", "Cloud API Performance Ingestor",
        "Distributed DB Query Balancer", "Cloud VM Performance Chart Dashboard"
      ],
      problems: [
        "AWS and GCP accounts run unused virtual machines, driving up costs.",
        "Uploading large file archives locks web servers, causing user delays."
      ],
      objectives: [
        "Develop an aggregator script tracking instance runtime costs.",
        "Build a serverless pipeline processing document uploads asynchronously."
      ],
      tech: [
        ["Next.js", "Python", "FastAPI", "PostgreSQL"],
        ["React", "Node.js", "Express", "MongoDB"]
      ],
      features: [
        ["Multi-provider bill summaries", "Idle machines warnings", "Sync triggers"],
        ["File dropzones", "Processing indicators", "Download URL cards"]
      ]
    },
    DevOps: {
      titles: [
        "Vulnerability Repository Scan Portal", "Self-Healing Server Restart Daemon", "Distributed Log Aggregator Pipeline",
        "Docker Container Orchestration Board", "Continuous Integration Git Action Runner", "Kubernetes Config Health Checker",
        "API Test Automation Pipeline Dashboard", "Web Server Performance Load Tester", "Database Migration Safety Checker",
        "Nginx Route Mapping Editor", "Git Commit Message Linter Service", "Docker Container Ingress Optimizer",
        "Kubernetes Horizontal Auto-scaler Dashboard", "Static Code Quality Analysis Dashboard", "Nginx SSL Certificate Ingestor",
        "Distributed System Latency Tracer Dashboard", "Server CPU Temperature Warning System", "Web Server SSL Security Auditor",
        "Kubernetes Resource Limit Auditor", "Continuous Deployment Blue-Green Coordinator", "Server Disk Usage Cleanup Daemon",
        "Git Branch Permissions Enforcer", "Docker Container Health Audit Dashboard", "Automated DB Schema Migration Monitor",
        "Distributed App Speed Ingestor", "Continuous Deployment Task Runner"
      ],
      problems: [
        "Developers push code with vulnerable packages, risking server security.",
        "Web servers fail during off-hours with no logs detailing root causes."
      ],
      objectives: [
        "Build a dashboard running vulnerability checks on connected Git repos.",
        "Develop a lightweight agent monitoring port status and auto-restarting services."
      ],
      tech: [
        ["Next.js", "Node.js", "Express", "MongoDB"],
        ["React", "Python", "Flask", "SQLite"]
      ],
      features: [
        ["Scan timeline meters", "Vulnerable package tables", "Patch notifications"],
        ["Service state grids", "Log monitors", "Slack alert hooks"]
      ]
    },
    "Mobile Development": {
      titles: [
        "Student Mood and Journal Tracker", "Classroom Compass Mobile Pathfinder", "College Timetable Reminder Alarm",
        "Peer-to-Peer Carpool Coordinator", "Student Grocery Shared Expense Tracker", "College Hostel Outing Pass Request",
        "Campus Sports Matches Organizer", "Mobile PDF Lecture Annotator", "Student Gym Workout Log App",
        "Campus Cafe Quick Preorder Cart", "Hostel Room Cleaning Request Scheduler", "Student Exam Flashcards Study App",
        "Campus Tour Augmented Maps App", "Student Club RSVP Ticket Scanner", "Alumni Mobile Mentorship Finder",
        "Student Job Hunt Tracker App", "Mobile Syllabus Progress Tracker", "Campus Laundry Dynamic Timer Alarm",
        "Student Notes Shared Drive App", "Student Group Project Checklist App", "Class Feedback Survey App",
        "Student Health Medication Reminder", "Campus Lost Items Photo Feed App", "Student CGPA Projection Calculator",
        "Student Lab Desk Reservation Mobile App", "Campus Events RSVP Tickets App"
      ],
      problems: [
        "Students face stress and anxiety with no central journaling app.",
        "Locating classrooms on massive campus grounds is difficult for newcomers."
      ],
      objectives: [
        "Design a mobile app containing daily mood journals and peer forums.",
        "Develop a location-aware campus map showing room-to-room path directions."
      ],
      tech: [
        ["React Native", "Firebase"],
        ["React Native", "Leaflet.js", "MongoDB"]
      ],
      features: [
        ["Mood log graphs", "Anonymous boards", "Breathe helpers"],
        ["Campus map overlay", "Route indicators", "Room listings"]
      ]
    },
    General: {
      titles: [
        "Personal Resume Profile Maker", "Midterm Subject Study Scheduler", "Student Group Task Board",
        "GPA Calculator Target Planner", "Student Monthly Expenses Tracker", "Engineering Lecture Slides PDF Reader",
        "Class Notes Markdown Organizer", "Campus Club RSVP Dashboard", "Student Code Snippets Notebook",
        "Student Flashcards Quiz Maker", "Smart Timetable Schedule Dashboard", "Engineering Student Resource Hub",
        "Lab Assignment Progress Checklists", "Student Daily Habits Routine Logger", "Viva Voice Exam Prep Simulator",
        "Student Internship Search Tracker"
      ],
      problems: [
        "Engineering students need a polished online profile to seek internships.",
        "Students struggle to balance midterm preparations across multiple classes."
      ],
      objectives: [
        "Create a single-page responsive portfolio listing skills and projects.",
        "Build a checklist application detailing pending assignments and exam dates."
      ],
      tech: [
        ["HTML", "CSS", "JavaScript"],
        ["React", "Local Storage"]
      ],
      features: [
        ["Responsive layouts", "Skill badges grids", "Contact form logs"],
        ["Calendar grids", "Syllabus unit checkers", "Daily study alarms"]
      ]
    }
  };

  // 3. Populate and construct the list of projects
  const difficultiesList: ('Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Extremely Hard')[] = [
    'Easy', 'Medium', 'Hard', 'Very Hard', 'Extremely Hard'
  ];

  remainingBranches.forEach((branch) => {
    const data = vocabularies[branch] || vocabularies['General'];
    const totalNeeded = branch === 'General' ? 16 : 26;

    for (let i = 0; i < totalNeeded; i++) {
      const difficulty = difficultiesList[i % difficultiesList.length];
      
      const title = data.titles[i % data.titles.length] || `${branch} Project ${i}`;
      const problem = data.problems[i % data.problems.length] || "Students face process delays during manual engineering workflows.";
      const objective = data.objectives[i % data.objectives.length] || "Build a responsive digital system to automate and display real-time logs.";
      
      const techArray = data.tech[i % data.tech.length] || ["HTML", "CSS", "JavaScript"];
      const featuresArray = data.features[i % data.features.length] || ["Real-time dashboard metrics", "Status configuration sliders", "CSV export logs"];
      
      const stepsArray = [
        "Set up the directory structure and database connections.",
        "Write backend endpoint routing configurations.",
        "Build the front-end user interfaces and responsive tables.",
        "Run end-to-end user path tests and deploy."
      ];

      const compactProj: CompactProject = {
        title,
        difficulty,
        category: getCategoryForIndex(i, branch),
        tech: techArray,
        problem,
        objective,
        features: featuresArray,
        steps: stepsArray
      };

      finalProjectsList.push(assembleProject(compactProj, branch, `${branch.toLowerCase()}_${i}`));
    }
  });

  return finalProjectsList;
};

// Helper category picker
const getCategoryForIndex = (idx: number, branch: string): string => {
  const categoriesList = [
    'Mini Project', 'Major Project', 'Hackathon Project', 'GitHub Project', 'Final Year Project'
  ];
  return categoriesList[idx % categoriesList.length];
};

// Main assembler function mapping CompactProject to full ProjectIdea
const assembleProject = (p: CompactProject, branch: string, id: string): ProjectIdea => {
  // Determine tech category splits
  const frontendTech: string[] = [];
  const backendTech: string[] = [];
  const databaseTech: string[] = [];
  const supportingTech: string[] = [];

  const frontendSet = new Set(['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Tailwind CSS', 'Bootstrap']);
  const backendSet = new Set(['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'Kotlin', 'PHP', 'Go', 'Verilog', 'C++']);
  const databaseSet = new Set(['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Supabase', 'Redis']);

  p.tech.forEach((t) => {
    if (frontendSet.has(t)) {
      frontendTech.push(t);
    } else if (backendSet.has(t)) {
      backendTech.push(t);
    } else if (databaseSet.has(t)) {
      databaseTech.push(t);
    } else {
      supportingTech.push(t);
    }
  });

  // Normalize categories to the 5 allowed ones
  let category = p.category;
  const categoryMap: Record<string, string> = {
    'Learning Project': 'Mini Project',
    'Knowledge Project': 'Mini Project',
    'Problem-Solving Project': 'Major Project',
    'Portfolio Project': 'GitHub Project',
    'Resume Project': 'GitHub Project',
    'Interview Project': 'GitHub Project',
    'Hackathon': 'Hackathon Project',
    'Industry-Style Project': 'Major Project'
  };
  if (categoryMap[category]) {
    category = categoryMap[category];
  }

  // Normalize branches to CSE, IT, Full Stack
  let mappedBranch = branch;
  const branchMap: Record<string, string> = {
    'ECE': 'CSE',
    'EEE': 'CSE',
    'AI/ML': 'CSE',
    'Data Science': 'CSE',
    'Embedded Systems': 'CSE',
    'Mechanical': 'IT',
    'Civil': 'IT',
    'Cybersecurity': 'IT',
    'DevOps': 'IT',
    'IoT': 'Full Stack',
    'Robotics': 'Full Stack',
    'Cloud': 'Full Stack',
    'Mobile Development': 'Full Stack',
    'General': 'Full Stack'
  };
  if (branchMap[branch]) {
    mappedBranch = branchMap[branch];
  }

  // Default values based on difficulty
  const budget = p.difficulty === 'Easy' ? 'Low' : p.difficulty === 'Medium' ? 'Medium' : 'High';
  const teamSize = (p.difficulty === 'Easy' || p.difficulty === 'Medium') ? 'Solo' : p.difficulty === 'Hard' ? '2-3 members' : '4+ members';
  const projectType = p.difficulty === 'Easy' ? 'Mini Project' : p.difficulty === 'Medium' ? 'Major Project' : 'Hackathon';
  
  const resumeVal = (p.difficulty === 'Easy') ? 'Low' : (p.difficulty === 'Medium') ? 'Medium' : 'High';
  const githubVal = (p.difficulty === 'Easy' || p.difficulty === 'Medium') ? 'Medium' : 'High';
  const interviewVal = (p.difficulty === 'Easy') ? 'Low' : (p.difficulty === 'Medium') ? 'Medium' : 'High';
  const hackSuit = (p.difficulty === 'Easy' || p.difficulty === 'Medium') ? 'Low' : (p.difficulty === 'Hard') ? 'Medium' : 'High';

  const expectedOutcome = `A functional prototype of ${p.title} deployed with structured metrics, showing under 150ms response latencies.`;
  const futureScope = "Integrate predictive ML models, support web socket alert notifications, and add offline data caching configurations.";

  const tags = [mappedBranch.toLowerCase(), p.difficulty.toLowerCase(), category.toLowerCase(), ...p.tech.map(t => t.toLowerCase())];

  return {
    id: `project_${id}`,
    title: p.title,
    shortSummary: p.problem.substring(0, 100) + "...",
    branch: mappedBranch,
    category,
    difficulty: p.difficulty,
    budget: budget as 'Low' | 'Medium' | 'High',
    teamSize: teamSize as 'Solo' | '2-3 members' | '4+ members',
    projectType: projectType as 'Mini Project' | 'Major Project' | 'Hackathon',
    useCase: `Helps engineering departments and students automate the tracking of ${p.title.toLowerCase()} configurations.`,
    relevanceScore: 100,
    resumeValue: resumeVal as 'High' | 'Medium' | 'Low',
    githubValue: githubVal as 'High' | 'Medium' | 'Low',
    interviewValue: interviewVal as 'High' | 'Medium' | 'Low',
    hackathonSuitability: hackSuit as 'High' | 'Medium' | 'Low',
    problemStatement: p.problem,
    objective: p.objective,
    features: p.features,
    technologiesUsed: p.tech,
    implementationSteps: p.steps,
    expectedOutcome,
    futureScope,
    optionalEnhancements: ["Add Docker compose deployment configs", "Integrate automated GitHub actions testing workflows"],
    recommendedStackVariants: [`${p.tech.join(' + ')}`, `${p.tech[0]} + FastAPI + SQLite`],
    tags,
    saved: false,
    completionLevelIndicator: p.difficulty === 'Easy' ? 90 : p.difficulty === 'Medium' ? 60 : p.difficulty === 'Hard' ? 30 : 10
  };
};

// Global library instance containing all 432 projects
export const baseProjects: ProjectIdea[] = fillAll432Projects();

// Dynamic expansion engine generating detailed project fields on the fly
export const expandProjectIdea = (p: ProjectIdea): ProjectIdea => {
  const whyItMatters = `This project addresses a critical gap in ${p.branch} operations: "${p.problemStatement}". By automating this workflow, students develop deep domain understanding while delivering a tool that has direct practical application.`;
  const targetUsers = ["Engineering Students", "Faculty Advisors", "Lab Technicians", "Department Evaluators"];
  
  // Deterministic architectures based on tech stack
  const backend = p.technologiesUsed.find(t => ['Node.js', 'Express', 'Django', 'Flask', 'Go', 'Python'].includes(t)) || 'Node.js/Express';
  const database = p.technologiesUsed.find(t => ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Supabase'].includes(t)) || 'PostgreSQL';
  const frontend = p.technologiesUsed.find(t => ['React', 'Next.js', 'Vue', 'Angular'].includes(t)) || 'Vanilla JS';

  const suggestedArchitecture = `Three-tier Client-Server Architecture:
- Frontend View Layer: Built with ${frontend} for modular component rendering and state tracking.
- API Backend Controller Layer: Built with ${backend} implementing REST endpoints and payload verification.
- Storage Database Layer: Powered by ${database} storing relational schemas and indexing core telemetry logs.`;

  const dbSchemaName = database.toLowerCase().includes('mongo') ? 'MongoDB Collections Schema' : 'PostgreSQL Table Schema';
  const suggestedDatabaseSchema = `${dbSchemaName}:
- Users table: { id: UUID, email: VARCHAR(100), name: VARCHAR(100), role: ENUM('admin', 'student') }
- Records table: { id: UUID, userId: UUID, title: VARCHAR(100), logData: JSONB/TEXT, status: VARCHAR(20), timestamp: TIMESTAMP }
- Analytics table: { id: UUID, recordId: UUID, score: INT, matchedDetails: TEXT, createdDate: TIMESTAMP }`;

  const suggestedAPIs = [
    `POST /api/v1/auth/register - Register user profiles`,
    `POST /api/v1/auth/login - Retrieve session authorization tokens`,
    `GET /api/v1/projects/${p.id}/logs - Fetch historical telemetry files`,
    `POST /api/v1/projects/${p.id}/logs - Post new data entries`
  ];

  const suggestedUIPages = [
    "Authentication Screen - User login and registrations",
    "Home Dashboard - Overview panel showing metrics, status graphs, and warnings",
    "Analytics Workspace - Tabular logs filterable by category and date ranges",
    "Admin Configuration Panel - Set thresholds, view connected users, and trigger backups"
  ];

  const suggestedComponents = [
    "SidebarNav - Main application navigation panel",
    "MetricCard - Reusable KPI display card showing values and offsets",
    "LogTable - Data table component supporting sorting and pagination filters",
    "WarningBanner - Notification alerts flashing when parameters violate thresholds"
  ];

  const validationEdgeCases = [
    "Network dropouts: Write log operations must queue locally in the browser and sync once connection is restored.",
    "Form inputs sanitization: Check and prevent SQL injection or cross-site scripting strings in search boxes.",
    "Database limits: Gracefully truncate or archive historical logs if file sizes exceed 100MB."
  ];

  const errorHandlingPlan = [
    "API Failures: Display non-blocking toast alerts prompting users to retry the operation.",
    "Invalid Credentials: Highlight inputs in red with inline error messages showing validation failures.",
    "Database Downtime: Catch connection exceptions and serve cached local storage profiles."
  ];

  const loadingEmptyStates = [
    "Skeleton Cards: Show loading outline templates when listing metrics to prevent layout shifts.",
    "Empty Library Warning: Display a clean, illustrations-driven prompt asking users to create their first log entry.",
    "Search Not Found: Banner saying 'No results match your query' with a clear reset filters button."
  ];

  const resumeTalkingPoints = [
    `Designed and deployed the full-stack ${p.title} architecture utilizing ${p.technologiesUsed.join(', ')} under 3 weeks.`,
    `Engineered database schemas in ${database} that reduced telemetry logs query times by 30%.`,
    `Built a fully responsive frontend dashboard showing real-time updates and status alarms.`
  ];

  const interviewQuestions = [
    `Why did you select ${database} over other database options for this project?`,
    `How did you handle user authentication and session security in your API routes?`,
    `What strategies did you implement to handle high request concurrency?`
  ];

  const githubReadmeValue = `# ${p.title}

${p.problemStatement}

## Core Features
${p.features.map(f => `- ${f}`).join('\n')}

## Recommended Stack
- Frontend: ${frontend}
- Backend: ${backend}
- Database: ${database}

## Quick Setup
\`\`\`bash
npm install
npm run dev
\`\`\`
`;

  const demoExpectations = `Explain the problem statement clearly, show the database connection logging logs, trigger a warning status by inputting out-of-bounds parameters, and demonstrate the CSV export downloads.`;
  const suggestedDeployment = `Host the frontend client statically on Vercel or Netlify. Run the backend API on Render or a Dockerized AWS EC2 instance. Connect the database utilizing Supabase or MongoDB Atlas.`;

  // Dynamic Prompt generation
  const buildPromptBase = `Build a complete, premium web application titled "${p.title}" using ${p.technologiesUsed.join(', ')}.
Objective: ${p.objective}
Problem Statement: ${p.problemStatement}

Required Core Features:
${p.features.map((f, i) => `${i+1}. ${f}`).join('\n')}

UI Style Guidelines:
- Modern typography (Outfit, Inter) with a clean, grid-based card layout.
- Glassmorphism effects, harmonized CSS color variables, and transition animations on hover actions.
- Support both dark mode and light mode viewports.
- Fully responsive on mobile, tablet, and desktop viewports.`;

  const promptAntigravity = `${buildPromptBase}

Antigravity Specific Instructions:
- Break down the logic into components located in the \`src/components/\` directory.
- Use TypeScript with strict interfaces. Do not use 'any'.
- Use the \`replace_file_content\` tool to incrementally edit code without overwriting entire files.
- Run type check checks using \`npm run build\` and resolve any warnings before submitting.`;

  const promptCursor = `${buildPromptBase}

Cursor Specific Instructions:
- Reference database schemas using @src/data/schemas.
- Add descriptive JSDoc comments to all controllers.
- Test endpoint parameters using mock cursor testing files.`;

  const promptBase44 = `${buildPromptBase}

Base44 Specific Instructions:
- Utilize Base44 modular grid layout tokens.
- Add performance markers measuring page loads to target under 200ms.`;

  const promptClaude = `${buildPromptBase}

Claude Specific Instructions:
- Generate complete, executable code blocks for frontend and backend files.
- Wrap explanations in clean markdown headers.
- Provide step-by-step terminal instructions to build and run the server.`;

  const promptGeneric = `${buildPromptBase}

Generic Instructions:
- Follow standard MVC architecture principles.
- Add descriptive code comments explaining state logic.
- Ensure all input forms contain proper validation checks.`;

  return {
    ...p,
    whyItMatters,
    targetUsers,
    suggestedArchitecture,
    suggestedDatabaseSchema,
    suggestedAPIs,
    suggestedUIPages,
    suggestedComponents,
    validationEdgeCases,
    errorHandlingPlan,
    loadingEmptyStates,
    resumeTalkingPoints,
    interviewQuestions,
    githubReadmeValue,
    demoExpectations,
    suggestedDeployment,
    promptAntigravity,
    promptCursor,
    promptBase44,
    promptClaude,
    promptGeneric
  };
};
