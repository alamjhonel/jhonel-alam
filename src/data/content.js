// ---------------------------------------------------------------------------
// Central content store for the Signal & Cipher portfolio.
// All copy is paraphrased from source material — no verbatim resume lines,
// no fabricated metrics, dates, or tools beyond what was provided.
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Jhonel Alam',
  title: 'Cybersecurity Specialist',
  // Rotating focus areas surfaced by the hero typing effect.
  roles: ['Network Security', 'DevSecOps', 'Automation Engineer', 'Active Directory Specialist', 'Security Engineer'],
  tagline:
    'I harden the quiet layers most people never see — building the identity, monitoring, and response fabric that keeps enterprise systems standing when it counts.',
  phone: '09708335114',
  email: 'jhonel.alam@gmail.com',
  cv: '/Jhonel_Alam_Resume_New.pdf',
  location: 'Manila, Philippines',
}

export const about = {
  kicker: 'System Profile',
  heading: 'Defense engineered from the ground up.',
  paragraphs: [
    'I am a cybersecurity specialist grounded in network security, systems administration, and hands-on technical troubleshooting. My day-to-day is finding weak points before attackers do — surfacing vulnerabilities, closing them, and keeping enterprise infrastructure running clean.',
    'My experience includes working with network and security technologies, troubleshooting infrastructure issues, and learning how security controls are applied in real-world environments. I’m also familiar with security standards and best practices such as CIS Benchmarks and MBSS, and I’m continuously developing my skills through hands-on projects, labs, and practical cybersecurity work.',
    'I’m passionate about learning, solving technical problems, and building a stronger understanding of cybersecurity from both an engineering and defensive perspective.',  ],
  stats: [
    { label: 'Focus', value: 'Blue Team / Infra' },
    { label: 'Baselines', value: 'CIS · MBSS' },
    { label: 'Domains', value: 'Finance · Enterprise' },
    { label: 'Practice', value: 'DevSecOps' },
  ],
}

// --- Core Technical Skills ------------------------------------------------
// Each category expands to reveal related tools + a grounded, real-world note.
export const skillGroups = [
  {
    id: 'threat',
    label: 'Threat & Response',
    code: 'TR-01',
    summary: 'Detecting, triaging, and containing active threats.',
    items: [
      'Threat Analysis & Incident Response',
      'Vulnerability Management & Mitigation',
    ],
    tools: ['CrowdStrike', 'FortiSIEM', 'NG SIEM Falcon'],
    example:
      'Ran threat hunts and rapid host isolation through CrowdStrike Falcon EDR, correlating alerts across FortiSIEM and NG SIEM Falcon to cut noise and act on what mattered.',
  },
  {
    id: 'hardening',
    label: 'Compliance & Hardening',
    code: 'CH-02',
    summary: 'Baselining systems and locking down the perimeter.',
    items: [
      'Security Hardening & Compliance (CIS, MBSS)',
      'Network Security & Infrastructure Hardening',
    ],
    tools: ['CIS Benchmarks', 'MBSS', 'Fortinet', 'Palo Alto'],
    example:
      'Applied hardening across domain controllers, Windows servers, and endpoints to CIS and MBSS baselines, then held the perimeter with Fortinet and Palo Alto firewall policy.',
  },
  {
    id: 'identity',
    label: 'Identity & Access',
    code: 'IA-03',
    summary: 'Centralizing who can reach what, and proving it.',
    items: ['Identity & Access Management (Active Directory, AD FS, SAML, SSO)'],
    tools: ['Active Directory', 'AD FS', 'SAML', 'SSO', 'Cisco ISE'],
    example:
      'Built a bank-wide Active Directory from scratch and rolled out AD FS, SAML, and SSO so identity lived in one governed place instead of scattered logins.',
  },
  {
    id: 'monitoring',
    label: 'Security Monitoring',
    code: 'SM-04',
    summary: 'Watching the wire and the edge, continuously.',
    items: ['Security Monitoring (SIEM, EDR, Cloudflare)'],
    tools: ['FortiSIEM', 'CrowdStrike EDR', 'Cloudflare', 'ManageEngine Endpoint Central'],
    example:
      'Kept eyes on traffic and edge — SIEM log correlation, EDR telemetry, and Cloudflare edge rules for rate limiting, DDoS mitigation, and WAF coverage.',
  },
]

// --- Experience -----------------------------------------------------------
export const experience = [
  {
    id: 'philtrust',
    role: 'Jr. IT Security Engineer',
    org: 'Philippine Trust Company (Philtrust Bank)',
    period: 'Aug 2025 – Aug 2026',
    location: 'Manila, Philippines',
    tag: 'Financial / Enterprise',
    summary:
      'Stood up and secured a bank-wide identity and monitoring stack aligned to banking regulatory frameworks.',
    bullets: [
      'Designed and built a bank-wide Active Directory environment from the ground up, aligned to CIS Benchmarks, MBSS, and banking regulatory requirements.',
      'Drove system hardening across domain controllers, Windows servers, endpoints, and critical financial applications.',
      'Wired Active Directory into the enterprise security stack: CrowdStrike, Fortinet, Palo Alto, Cisco ISE, ManageEngine Endpoint Central, and Cloudflare.',
      'Rolled out AD FS, SAML, and SSO to bring identity under one roof.',
      'Owned endpoint security in CrowdStrike Falcon EDR — threat hunting, policy allow/deny tuning, and fast host isolation.',
      'Triaged alerts and stitched together logs across Fortinet FortiSIEM and NG SIEM Falcon.',
      'Configured and maintained Fortinet and Palo Alto firewalls for traffic control and perimeter watch.',
      'Ran ManageEngine Endpoint Central for DLP, application control, patching, and vulnerability remediation.',
      'Tuned Cloudflare edge protections: rate limiting, DDoS mitigation, DNS security, and WAF policy.',
      'Wrote internal automation scripts to streamline repetitive security-monitoring work.',
    ],
  },
  {
    id: 'dhl',
    role: 'Data Analyst & IT Support Intern',
    org: 'DHL Global Forwarding (Phils.)',
    period: 'Feb 2025 – May 2025',
    location: 'Pasay, Philippines',
    tag: 'Enterprise IT',
    summary: 'Supported secure onboarding and turned manual reporting into automation.',
    bullets: [
      'Provisioned IT accounts and hardware assets in ServiceNow for secure employee onboarding.',
      'Cleared IT tickets spanning connectivity, access control, system errors, and software issues.',
      'Automated HR and operational reporting with Excel and VBA to cut manual processing time.',
      'Maintained IT inventory logs and produced audit-ready documentation.',
    ],
  },
  {
    id: 'techm',
    role: 'Technical Support Associate',
    org: 'Tech Mahindra',
    period: 'Sep 2022 – Oct 2022',
    location: 'Quezon City, Philippines',
    tag: 'Support',
    summary: 'Front-line technical support under SLA.',
    bullets: [
      'Delivered SLA-bound support across hardware, OS, and network issues.',
      'Escalated complex incidents to tier-2 with detailed diagnostics.',
    ],
  },
]

// --- Security Toolstack ---------------------------------------------------
// Tools I operate hands-on, grouped by the job they do.
export const tools = [
  {
    name: 'Palo Alto',
    category: 'Firewall',
    use: 'Next-gen firewall policy, App-ID/threat prevention, and perimeter segmentation.',
  },
  {
    name: 'Fortinet',
    category: 'Firewall',
    use: 'FortiGate policy, VPN, and branch-edge traffic control across sites.',
  },
  {
    name: 'FortiSIEM',
    category: 'SIEM',
    use: 'Log correlation, alert triage, and event stitching for incident response.',
  },
  {
    name: 'CrowdStrike NG SIEM',
    category: 'SIEM',
    use: 'Next-gen SIEM detections and cross-telemetry threat hunting.',
  },
  {
    name: 'CrowdStrike Falcon',
    category: 'EDR',
    use: 'Endpoint detection & response — threat hunting, policy tuning, host isolation.',
  },
  {
    name: 'ManageEngine Endpoint Central',
    category: 'Endpoint',
    use: 'Patch management, DLP, application control, and vulnerability remediation.',
  },
  {
    name: 'Cloudflare',
    category: 'Edge / WAF',
    use: 'WAF rules, rate limiting, DDoS mitigation, and DNS security at the edge.',
  },
  {
    name: 'Active Directory',
    category: 'Identity',
    use: 'Domain design, GPO hardening, and centralized authentication built from scratch.',
  },
  {
    name: 'IAM',
    category: 'Identity',
    use: 'AD FS, SAML, and SSO — one governed identity plane instead of scattered logins.',
  },
]

// --- Featured Project -----------------------------------------------------
export const featuredProject = {
  name: 'Internal Network Security Monitoring Tool',
  kicker: 'Featured Build',
  blurb:
    'A custom internal console I built to pull network security operations into one place — asset inventory, firewall health, and device access, without hopping between five different tabs.',
  why: "I got tired of checking firewalls by hand and chasing asset lists across spreadsheets. So I built one console that ingests the sheets, shows firewall health at a glance, and lets me jump onto a device and run checks inline — turning a pile of repetitive security-ops chores into a single workflow that speeds up incident response.",
  capabilities: [
    { title: 'Excel ingestion', desc: 'Parses asset/host inventories and firewall rule sheets into a searchable dashboard.' },
    { title: 'Firewall monitoring', desc: 'Live-style view of firewall health, rule counts, and alerts.' },
    { title: 'Direct SSH / PuTTY login', desc: 'Opens SSH sessions to network devices straight from the tool.' },
    { title: 'Command execution', desc: 'Runs predefined or custom commands on hosts and returns output inline.' },
  ],
  stack: ['Python', 'SSH / Paramiko', 'openpyxl', 'REST polling'],
  // Representative sample of the inventory this tool manages (values shown for the showcase).
  assets: [
    { host: 'core-fw-01', ip: '10.10.0.1', type: 'Firewall', vendor: 'Fortinet', site: 'HQ-DC', status: 'online' },
    { host: 'core-fw-02', ip: '10.10.0.2', type: 'Firewall', vendor: 'Palo Alto', site: 'HQ-DC', status: 'online' },
    { host: 'dc-ad-01', ip: '10.10.1.10', type: 'Domain Controller', vendor: 'Windows', site: 'HQ-DC', status: 'online' },
    { host: 'dc-ad-02', ip: '10.10.1.11', type: 'Domain Controller', vendor: 'Windows', site: 'DR-Site', status: 'online' },
    { host: 'edr-mgmt', ip: '10.10.2.20', type: 'EDR Console', vendor: 'CrowdStrike', site: 'HQ-DC', status: 'degraded' },
    { host: 'siem-node-1', ip: '10.10.2.30', type: 'SIEM', vendor: 'FortiSIEM', site: 'HQ-DC', status: 'online' },
    { host: 'edge-proxy', ip: '10.10.3.5', type: 'Edge / WAF', vendor: 'Cloudflare', site: 'Edge', status: 'online' },
    { host: 'nac-ise-01', ip: '10.10.1.40', type: 'NAC', vendor: 'Cisco ISE', site: 'HQ-DC', status: 'offline' },
  ],
  firewalls: [
    { name: 'core-fw-01', vendor: 'Fortinet', health: 96, rules: 412, alerts: 2, throughput: '1.8 Gbps', state: 'healthy' },
    { name: 'core-fw-02', vendor: 'Palo Alto', health: 91, rules: 388, alerts: 5, throughput: '1.2 Gbps', state: 'healthy' },
    { name: 'branch-fw-03', vendor: 'Fortinet', health: 74, rules: 176, alerts: 11, throughput: '340 Mbps', state: 'watch' },
    { name: 'edge-waf', vendor: 'Cloudflare', health: 99, rules: 63, alerts: 0, throughput: '—', state: 'healthy' },
  ],
  // Scripted SSH-style responses that mirror the tool's inline command output.
  sshCommands: {
    'show interfaces': [
      'GigabitEthernet0/0  up   up   10.10.0.1/24    in 1.2G  out 880M',
      'GigabitEthernet0/1  up   up   203.0.113.2/29  in 640M  out 410M',
      'GigabitEthernet0/2  admin-down            (unassigned)',
    ],
    'get system status': [
      'Version: FortiOS v7.4.3 build2573',
      'Serial-Number: FGT-100F-0001',
      'System time: Wed Sep 03 09:41:12',
      'Uptime: 42 days 06:18:55',
    ],
    'show firewall policy summary': [
      'Total policies : 412',
      'Enabled        : 401',
      'Disabled       : 11',
      'Last modified  : 2 days ago',
    ],
    'diagnose sys top': [
      'PID   NAME            CPU%   MEM%',
      '412   ipsengine        6.2    9.1',
      '188   sslvpnd          2.1    4.4',
      '77    cmdbsvr          1.0    3.2',
    ],
  },
}

// --- CMDB (Configuration Management Database) -----------------------------
export const cmdb = {
  name: 'Configuration Management Database (CMDB)',
  kicker: 'Featured Build',
  blurb:
    'A CMDB I built to inventory every configuration item — firewalls, switches, racks, servers, and workstations — and map how they depend on each other, so the blast radius of any change or outage is visible before it bites.',
  why: 'Assets lived in scattered spreadsheets and nobody could answer "if this switch dies, what goes down with it?" I built a single register with real dependency mapping, so impact analysis, change reviews, and incident triage all read from one source of truth — with a full audit trail behind every edit.',
  capabilities: [
    { title: 'Asset inventory', desc: 'One register for firewalls, switches, racks, servers, and workstations with owner, site, and lifecycle state.' },
    { title: 'Dependency mapping', desc: 'Every CI links to what it depends on and what depends on it.' },
    { title: 'Impact analysis', desc: 'Walks the dependency graph to show blast radius before a change or during an incident.' },
    { title: 'Audit trail', desc: 'Immutable history of every CI change — who, what, and when.' },
    { title: 'Syslog & SMTP integration', desc: 'Ingests device syslog and fires SMTP email alerts on state changes and audit events.' },
  ],
  stack: ['Python', 'PostgreSQL', 'Syslog (RFC 5424)', 'SMTP'],
  // Asset classes (configuration item types) the CMDB tracks.
  classes: [
    { name: 'Firewalls', code: 'FW', count: 8 },
    { name: 'Switches', code: 'SW', count: 34 },
    { name: 'Racks', code: 'RK', count: 12 },
    { name: 'Servers', code: 'SRV', count: 76 },
    { name: 'Workstations', code: 'WS', count: 240 },
  ],
  // Dependency + impact records: what each CI relies on and what relies on it.
  dependencies: [
    {
      ci: 'core-fw-01', type: 'Firewall', rack: 'rack-a12',
      dependsOn: ['core-sw-01', 'rack-a12 PDU'],
      supports: ['dc-ad-01', 'siem-node-1', 'edge-proxy', 'vlan-30 workstations'],
      impact: 'critical',
    },
    {
      ci: 'core-sw-01', type: 'Switch', rack: 'rack-a12',
      dependsOn: ['rack-a12 PDU'],
      supports: ['core-fw-01', 'dc-ad-01', 'srv-esx-04'],
      impact: 'critical',
    },
    {
      ci: 'dc-ad-01', type: 'Server', rack: 'rack-b03',
      dependsOn: ['core-sw-01', 'srv-esx-04'],
      supports: ['domain auth', '240 workstations', 'siem-node-1'],
      impact: 'high',
    },
    {
      ci: 'srv-esx-04', type: 'Server', rack: 'rack-b03',
      dependsOn: ['core-sw-01', 'rack-b03 PDU'],
      supports: ['dc-ad-01', 'siem-node-1'],
      impact: 'high',
    },
    {
      ci: 'ws-fin-118', type: 'Workstation', rack: '—',
      dependsOn: ['core-sw-01', 'dc-ad-01'],
      supports: ['finance user session'],
      impact: 'low',
    },
  ],
  // Change / audit history.
  audit: [
    { ts: '09-03 09:12', actor: 'jalam', action: 'update', ci: 'core-fw-01', detail: 'policy set 412 → 415' },
    { ts: '09-02 16:40', actor: 'jalam', action: 'create', ci: 'ws-fin-118', detail: 'onboarded finance workstation' },
    { ts: '09-02 11:07', actor: 'system', action: 'alert', ci: 'core-sw-01', detail: 'syslog: port Gi0/12 flap' },
    { ts: '09-01 22:15', actor: 'jalam', action: 'retire', ci: 'srv-legacy-02', detail: 'decommissioned, rack-b07 freed' },
  ],
  // External integrations.
  integrations: [
    { name: 'Syslog', proto: 'UDP/514 · RFC 5424', desc: 'Ingests device & firewall logs to auto-update CI state.', status: 'connected' },
    { name: 'SMTP', proto: 'TLS/587', desc: 'Emails owners on state changes, impact alerts, and audit events.', status: 'connected' },
  ],
}

// --- Certifications -------------------------------------------------------
export const certCategories = ['All', 'Cybersecurity', 'Cloud', 'Networking', 'Compliance']

export const certifications = [
  { name: 'Google Cybersecurity Professional Certificate', issuer: 'Coursera', date: 'Aug 2026', id: 'LOJWHMU5PI3X', category: 'Cybersecurity', pdf: 'google-cybersecurity' },
  { name: 'Google Network Security Certificate', issuer: 'Coursera', date: 'Aug 2026', category: 'Networking', pdf: 'google-network-security' },
  { name: 'Google IT Support Professional Certificate', issuer: 'Coursera', date: 'Aug 2026', category: 'Networking' },
  { name: 'AWS Certified SysOps Administrator – Associate', issuer: 'AWS', date: 'Nov 2023', category: 'Cloud' },
  { name: 'Cryptography & Security: Protect Data from Cyber Threats', issuer: 'Certification', date: 'Dec 2025', category: 'Cybersecurity' },
  { name: 'Cryptography & Cybersecurity', issuer: 'Certification', date: 'Jan 2025', category: 'Cybersecurity' },
  { name: 'SAP Security: Deep Dive into Roles and Authorization', issuer: 'Certification', date: 'Jan 2025', category: 'Compliance' },
  { name: 'Master Course in Google Cloud Digital Leader', issuer: 'Certification', category: 'Cloud' },
  { name: 'Cybersecurity', issuer: 'CISCO', category: 'Cybersecurity' },
  { name: 'Critical Infrastructure Protection', issuer: 'OPSWAT', category: 'Compliance' },
  { name: 'Data Protection & Security', issuer: 'Encryption · Access Control · GDPR · Risk Mgmt', category: 'Compliance' },
  { name: 'National Certificate II – Computer System Servicing', issuer: 'TESDA', category: 'Networking' },
]

// --- Technical Activities -------------------------------------------------
export const activities = [
  {
    id: 'pentest',
    title: 'Penetration Testing',
    platform: 'Red-Team Engagements',
    desc: 'Executing structured penetration tests across web, network, and host surfaces — reconnaissance, enumeration, exploitation, post-exploitation, and a prioritized remediation report tied to real business risk.',
    tags: ['Recon', 'Exploitation', 'Reporting'],
  },
  {
    id: 'vapt',
    title: 'Internal VAPT',
    platform: 'Enterprise Internal Assessments',
    desc: 'Running Vulnerability Assessment and Penetration Testing against internal infrastructure — domain hardening gaps, misconfigured AD trusts, privilege-escalation paths, endpoint exposure, and network segmentation validation with actionable fixes.',
    tags: ['Vulnerability', 'AD Hardening', 'Segmentation'],
  },
  {
    id: 'htb',
    title: 'Ethical Hacking & Labs',
    platform: 'Hack The Box',
    desc: 'Working through advanced labs and challenge machines to sharpen both penetration-testing instincts and defensive reflexes.',
    tags: ['Pentest', 'Defense', 'Labs'],
  },
  {
    id: 'ctf',
    title: 'Capture The Flag',
    platform: 'Competitive CTF',
    desc: 'Competing in CTF events across cryptography, forensics, reverse engineering, and defensive tactics under time pressure.',
    tags: ['Crypto', 'Forensics', 'Reversing'],
  },
  {
    id: 'osint',
    title: 'OSINT Reconnaissance',
    platform: 'Open-source frameworks',
    desc: 'Running intelligence-gathering exercises with open-source tooling to support threat analysis and footprint mapping.',
    tags: ['Recon', 'Threat Intel'],
  },
]

// --- Education ------------------------------------------------------------
export const education = {
  degree: 'Bachelor of Science in Computer Science',
  school: 'Technological University of the Philippines',
  date: 'Sept 2021',
  thesisTitle: 'Code Assessment Using Rubric-Based Fuzzy Logic',
  thesisDesc:
    'An automated grading engine that scores source code against rubrics using fuzzy-logic algorithms, translating fuzzy human judgement into consistent, repeatable assessment.',
}

// --- Navigation sections --------------------------------------------------
export const sections = [
  { id: 'hero', label: 'Home', cmd: 'home' },
  { id: 'about', label: 'About', cmd: 'about' },
  { id: 'skills', label: 'Skills', cmd: 'skills' },
  { id: 'experience', label: 'Experience', cmd: 'experience' },
  { id: 'project', label: 'Project', cmd: 'project' },
  { id: 'certifications', label: 'Certifications', cmd: 'certifications' },
  { id: 'activities', label: 'Activities', cmd: 'activities' },
  { id: 'education', label: 'Education', cmd: 'education' },
  { id: 'contact', label: 'Contact', cmd: 'contact' },
]
