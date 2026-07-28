/**
 * Kiharu TVC — Student Portal
 * React + Tailwind CSS  |  Mock data · Backend-ready API layer
 *
 * API LAYER  ─────────────────────────────────────────────────────────────
 * Every data call lives in the `api` object below.
 * To connect a real Node.js + SQL backend, replace each function body
 * with a real fetch/axios call. The component code never changes.
 * Example real implementation:
 *
 *   login: async (id, pwd) => {
 *     const res = await fetch('/api/auth/login', {
 *       method:'POST', headers:{'Content-Type':'application/json'},
 *       body: JSON.stringify({ studentId: id, password: pwd })
 *     });
 *     if (!res.ok) throw new Error('Invalid credentials');
 *     return res.json();   // { token, student }
 *   }
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   BRAND COLOURS  (mirrors Kiharu TVC's existing site palette)
══════════════════════════════════════════════════════════════ */
const C = {
  maroon:      "#6a1830",
  maroonDark:  "#4a0f20",
  maroonLight: "#8a2040",
  orange:      "#f26b2a",
  blue:        "#85c0ea",
  blueDark:    "#0a3a6a",
  bg:          "#f4f1ee",
  muted:       "#6b6b6b",
};

/* ══════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════ */
const MOCK = {
  students: {
    "KTU/2024/001": {
      password: "student123",
      name: "Amina Mwangi",
      programme: "Diploma in Computing & Informatics",
      year: 2,
      semester: 2,
      academicYear: "2025/2026",
      email: "a.mwangi@kiharutvc.ac.ke",
      phone: "0712 345 678",
      dob: "2003-04-12",
      status: "Active",
    },
    "KTU/2023/042": {
      password: "pass42",
      name: "Brian Kamau",
      programme: "Diploma in Electrical Engineering",
      year: 3,
      semester: 1,
      academicYear: "2025/2026",
      email: "b.kamau@kiharutvc.ac.ke",
      phone: "0798 765 432",
      dob: "2001-11-20",
      status: "Active",
    },
  },

  grades: [
    { id:1, unitCode:"CIT 101", unitName:"Introduction to Computing",        cat:26, exam:62, total:88, grade:"A",  points:4.0, status:"Pass",   semester:1 },
    { id:2, unitCode:"CIT 102", unitName:"Mathematics for ICT",              cat:22, exam:55, total:77, grade:"B+", points:3.5, status:"Pass",   semester:1 },
    { id:3, unitCode:"CIT 103", unitName:"Communication Skills",             cat:28, exam:60, total:88, grade:"A",  points:4.0, status:"Pass",   semester:1 },
    { id:4, unitCode:"CIT 104", unitName:"Computer Hardware & Maintenance",  cat:20, exam:35, total:55, grade:"C",  points:2.0, status:"Pass",   semester:1 },
    { id:5, unitCode:"CIT 105", unitName:"Entrepreneurship",                 cat:18, exam:28, total:46, grade:"D",  points:1.0, status:"Supp.", semester:1 },
    { id:6, unitCode:"CIT 201", unitName:"Web Development",                  cat:null, exam:null, total:null, grade:"—", points:null, status:"In Progress", semester:2 },
    { id:7, unitCode:"CIT 202", unitName:"Database Systems",                 cat:null, exam:null, total:null, grade:"—", points:null, status:"In Progress", semester:2 },
    { id:8, unitCode:"CIT 203", unitName:"Networking Fundamentals",          cat:null, exam:null, total:null, grade:"—", points:null, status:"In Progress", semester:2 },
    { id:9, unitCode:"CIT 204", unitName:"Operating Systems",                cat:null, exam:null, total:null, grade:"—", points:null, status:"In Progress", semester:2 },
    { id:10,unitCode:"CIT 205", unitName:"Systems Analysis & Design",        cat:null, exam:null, total:null, grade:"—", points:null, status:"In Progress", semester:2 },
  ],

  availableUnits: [
    { code:"CIT 201", name:"Web Development",              credits:3, enrolled:true,  prereq:null,      desc:"HTML5, CSS3, JavaScript, PHP fundamentals" },
    { code:"CIT 202", name:"Database Systems",             credits:3, enrolled:true,  prereq:"CIT 101", desc:"SQL, normalisation, MySQL, PostgreSQL" },
    { code:"CIT 203", name:"Networking Fundamentals",      credits:3, enrolled:true,  prereq:"CIT 101", desc:"OSI model, TCP/IP, subnetting, routing" },
    { code:"CIT 204", name:"Operating Systems",            credits:3, enrolled:true,  prereq:null,      desc:"Linux, Windows, process & memory management" },
    { code:"CIT 205", name:"Systems Analysis & Design",   credits:3, enrolled:true,  prereq:null,      desc:"UML, DFD, SDLC methodologies" },
    { code:"CIT 206", name:"Mobile Application Dev.",     credits:3, enrolled:false, prereq:"CIT 201", desc:"Android & Flutter mobile development" },
    { code:"CIT 207", name:"Software Engineering",        credits:3, enrolled:false, prereq:"CIT 101", desc:"Agile, Scrum, testing & quality assurance" },
    { code:"CIT 208", name:"Cloud Computing",             credits:3, enrolled:false, prereq:null,      desc:"AWS, Azure, GCP fundamentals" },
    { code:"CIT 209", name:"Cybersecurity Essentials",    credits:3, enrolled:false, prereq:"CIT 203", desc:"Threats, cryptography, firewalls, ethical hacking" },
  ],

  fees: {
    totalFees: 30000,
    paid: 22000,
    deadline: "10 Jun 2026",
    breakdown: [
      { item:"Tuition Fee",          amount:22000 },
      { item:"Examination Fee",      amount: 2500 },
      { item:"Library & Lab Fee",    amount: 2000 },
      { item:"Student Activity Fee", amount: 1500 },
      { item:"Medical / Insurance",  amount: 2000 },
    ],
    payments: [
      { id:"TXN001", date:"15 Jan 2026", amount:12000, method:"M-Pesa",      ref:"QA7Z3X2K1" },
      { id:"TXN002", date:"10 Mar 2026", amount:10000, method:"Bank Deposit", ref:"BK93821074" },
    ],
  },

  assignments: [
    { id:1, unit:"CIT 201", title:"Build a Responsive College Website",         deadline:"2026-06-08", status:"pending",   marks:null, maxMarks:30 },
    { id:2, unit:"CIT 202", title:"Database Design for a Library System",       deadline:"2026-06-10", status:"pending",   marks:null, maxMarks:30 },
    { id:3, unit:"CIT 203", title:"Network Topology Lab Report",                deadline:"2026-06-12", status:"pending",   marks:null, maxMarks:30 },
    { id:4, unit:"CIT 204", title:"Linux Command Line Practical Exercises",     deadline:"2026-05-28", status:"submitted", marks:22,   maxMarks:30 },
    { id:5, unit:"CIT 205", title:"DFD for a Student Registration System",      deadline:"2026-05-20", status:"submitted", marks:25,   maxMarks:30 },
  ],

  notices: [
    { type:"warning", icon:"⚠️", label:"Deadline",   text:"Fees clearance deadline: 10 Jun 2026" },
    { type:"info",    icon:"📝", label:"Exam Notice", text:"KNEC exam timetable now available at academics office" },
    { type:"success", icon:"🎓", label:"Event",       text:"Graduation Ceremony: 18 Jul 2026" },
  ],
};

/* ══════════════════════════════════════════════════════════════
   API SERVICE LAYER  — replace bodies to connect real backend
══════════════════════════════════════════════════════════════ */
const api = {
  /** POST /api/auth/login */
  login: async (studentId, password) => {
    await delay(600);
    const student = MOCK.students[studentId];
    if (!student || student.password !== password) throw new Error("Invalid student ID or password.");
    return { token: "mock-jwt-token", student: { ...student, studentId } };
  },

  /** GET /api/students/me */
  getMe: async () => { await delay(300); return MOCK.students["KTU/2024/001"]; },

  /** GET /api/grades?semester=all */
  getGrades: async (semester = "all") => {
    await delay(400);
    return semester === "all" ? MOCK.grades : MOCK.grades.filter(g => g.semester === Number(semester));
  },

  /** GET /api/courses?semester=2 */
  getAvailableUnits: async () => { await delay(400); return [...MOCK.availableUnits]; },

  /** POST /api/enroll */
  enrollUnit: async (code) => { await delay(500); return { success: true, code }; },

  /** POST /api/drop-course */
  dropUnit: async (code) => { await delay(500); return { success: true, code }; },

  /** GET /api/fees */
  getFees: async () => { await delay(400); return { ...MOCK.fees }; },

  /** POST /api/payment */
  makePayment: async (payload) => {
    await delay(800);
    return { success: true, ref: "TXN" + Math.random().toString(36).slice(2,10).toUpperCase(), ...payload };
  },

  /** GET /api/assignments */
  getAssignments: async () => { await delay(400); return [...MOCK.assignments]; },

  /** POST /api/submission */
  submitAssignment: async (id, file, comment) => {
    await delay(700);
    return { success: true, id, fileName: file.name, timestamp: new Date().toISOString() };
  },
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/* ══════════════════════════════════════════════════════════════
   UTILITY HOOKS & HELPERS
══════════════════════════════════════════════════════════════ */
function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { ...state, refetch: load };
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, toast: add };
}

const fmt = {
  currency: (n) => `KES ${n.toLocaleString()}`,
  pct: (paid, total) => Math.round((paid / total) * 100),
  date: (d) => new Date(d).toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" }),
  initials: (name) => name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(),
  daysLeft: (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000*60*60*24));
  },
};

const gpaColour = (gpa) => gpa >= 3.5 ? "#1a7a30" : gpa >= 2.5 ? "#b45309" : "#991b1b";

/* ══════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
══════════════════════════════════════════════════════════════ */

/** Pill / chip badge */
function Badge({ variant = "default", children, className = "" }) {
  const map = {
    pass:      "bg-emerald-50 text-emerald-800 border border-emerald-200",
    fail:      "bg-red-50 text-red-800 border border-red-200",
    supp:      "bg-orange-50 text-orange-800 border border-orange-200",
    pending:   "bg-amber-50 text-amber-800 border border-amber-200",
    submitted: "bg-blue-50 text-blue-800 border border-blue-200",
    late:      "bg-red-50 text-red-800 border border-red-200",
    enrolled:  "bg-indigo-50 text-indigo-800 border border-indigo-200",
    progress:  "bg-sky-50 text-sky-800 border border-sky-200",
    default:   "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${map[variant] ?? map.default} ${className}`}>
      {children}
    </span>
  );
}

/** Card wrapper */
function Card({ children, className = "", onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${hover ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** Section heading inside a page */
function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-bold" style={{ color: C.maroon, fontFamily: "'Playfair Display', serif" }}>{title}</h1>
      {subtitle && <p className="text-sm mt-1" style={{ color: C.muted }}>{subtitle}</p>}
    </div>
  );
}

/** Stat summary card */
function StatCard({ icon, label, value, accent = C.maroon, sub }) {
  return (
    <Card className="p-5 border-l-4" style={{ borderLeftColor: accent }}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[22px] font-black leading-none" style={{ color: accent }}>{value}</div>
      <div className="text-xs font-medium mt-1.5" style={{ color: C.muted }}>{label}</div>
      {sub && <div className="text-[11px] mt-1" style={{ color: C.muted }}>{sub}</div>}
    </Card>
  );
}

/** Loading skeleton */
function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-gray-100" />
      ))}
    </div>
  );
}

/** Toast stack */
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white pointer-events-auto
            ${t.type === "error" ? "bg-red-700" : t.type === "info" ? "bg-blue-700" : "bg-emerald-700"}`}
          style={{ minWidth: 260 }}
        >
          <span>{t.type === "error" ? "✗" : "✓"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/** Simple modal (no fixed positioning—uses absolute in a relative container trick via portal-like wrapper) */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >✕</button>
        <h3 className="text-xl font-bold mb-1" style={{ color: C.maroon, fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/** Styled input */
function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">{label}</label>}
      <input
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none transition-all focus:border-[#6a1830] focus:ring-2 focus:ring-[#6a183015]"
        {...props}
      />
    </div>
  );
}

/** Styled select */
function Select({ label, children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-bold text-gray-500 mb-1.5 tracking-wide uppercase">{label}</label>}
      <select
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none bg-white transition-all focus:border-[#6a1830] focus:ring-2 focus:ring-[#6a183015]"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/** Primary button */
function Btn({ children, onClick, disabled, loading, variant = "primary", size = "md", className = "" }) {
  const base = "inline-flex items-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-5 py-3 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg",
    outline: "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
    danger: "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100",
    success: "text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg",
  };
  const bg = variant === "primary"
    ? `background: linear-gradient(135deg, ${C.maroon}, ${C.maroonLight})`
    : variant === "success"
    ? "background: linear-gradient(135deg, #1a7a30, #2d9e48)"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={bg ? { background: bg.replace("background: ","") } : {}}
    >
      {loading ? <span className="animate-spin text-base">⟳</span> : null}
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: LOGIN
══════════════════════════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!id || !pwd) { setError("Please enter your student ID and password."); return; }
    setLoading(true); setError("");
    try {
      const result = await api.login(id.trim(), pwd);
      onLogin(result);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${C.maroonDark} 0%, ${C.maroon} 45%, #c0392b 70%, #e05a1a 100%)` }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: C.orange, transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: C.blue, transform: "translate(-30%,30%)" }} />

      {/* College branding */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>🏛️</div>
        <h1 className="text-white text-xl font-black tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>KIHARU TECHNICAL &amp;</h1>
        <h1 className="text-white text-xl font-black tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>VOCATIONAL COLLEGE</h1>
        <p className="text-white/60 text-xs mt-1 tracking-widest uppercase">Student Academic Portal</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-9 w-full max-w-sm relative z-10">
        <h2 className="text-lg font-bold mb-1" style={{ color: C.maroon }}>Sign in to your account</h2>
        <p className="text-xs mb-6" style={{ color: C.muted }}>Enter your credentials to access the portal</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <span>✗</span>{error}
          </div>
        )}

        <Input
          label="Student ID"
          type="text"
          placeholder="e.g. KTU/2024/001"
          value={id}
          onChange={e => setId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          autoFocus
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
        />

        <Btn onClick={submit} loading={loading} size="lg" className="w-full justify-center mt-2">
          {loading ? "Signing in…" : "Sign In to Portal"}
        </Btn>

        <div className="mt-6 p-3 rounded-xl text-center text-xs" style={{ background: "#fdf5f7" }}>
          <span style={{ color: C.muted }}>Demo — ID: </span>
          <strong style={{ color: C.maroon }}>KTU/2024/001</strong>
          <span style={{ color: C.muted }}> · Password: </span>
          <strong style={{ color: C.maroon }}>student123</strong>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: C.muted }}>
          KNEC &amp; TVETA Accredited Institution
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LAYOUT: SIDEBAR + TOPBAR
══════════════════════════════════════════════════════════════ */
const NAV = [
  { id: "dashboard",   icon: "🏠", label: "Dashboard" },
  { id: "grades",      icon: "📊", label: "My Grades" },
  { id: "units",       icon: "📚", label: "Unit Registration" },
  { id: "fees",        icon: "💰", label: "Fees & Payments" },
  { id: "assignments", icon: "📤", label: "Assignments" },
];

function AppShell({ student, onLogout, children, activePage, setPage, pendingCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>
      {/* Topbar */}
      <div className="text-xs px-5 py-1.5 flex justify-between items-center" style={{ background: C.maroonDark, color: "rgba(255,255,255,0.65)" }}>
        <span>📍 Gaturi Ward, Kiambugi, Murang'a County · ☎ 0720 657 630</span>
        <span className="hidden sm:inline">Semester 2 · {student.academicYear}</span>
      </div>

      {/* Main header */}
      <header className="bg-white border-b-2 sticky top-0 z-30 shadow-sm" style={{ borderBottomColor: C.maroon }}>
        <div className="max-w-screen-xl mx-auto px-5 py-3 flex items-center gap-4">
          {/* Hamburger (mobile) */}
          <button className="lg:hidden p-2 rounded-lg" style={{ color: C.maroon }} onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect y="3" width="20" height="2" rx="1"/><rect y="9" width="20" height="2" rx="1"/><rect y="15" width="20" height="2" rx="1"/>
            </svg>
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: C.maroon }}>🏛️</div>
            <div className="hidden sm:block">
              <div className="font-black text-sm leading-tight" style={{ color: C.maroon, fontFamily: "'Playfair Display', serif" }}>KIHARU TVC</div>
              <div className="text-[10px]" style={{ color: C.muted }}>Student Academic Portal</div>
            </div>
          </div>

          {/* Student chip */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-gray-100" style={{ background: "#fdf5f7" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.maroon}, ${C.maroonLight})` }}
              >{fmt.initials(student.name)}</div>
              <div>
                <div className="text-xs font-bold leading-tight" style={{ color: C.maroon }}>{student.name}</div>
                <div className="text-[10px]" style={{ color: C.muted }}>{student.studentId}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:text-white"
              style={{ borderColor: `${C.maroon}40`, color: C.maroon }}
              onMouseEnter={e => { e.currentTarget.style.background = C.maroon; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.maroon; }}
            >↩ Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-52 flex-shrink-0">
          <SidebarNav activePage={activePage} setPage={setPage} pendingCount={pendingCount} />
        </aside>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="relative z-10 w-64 bg-white h-full p-4 shadow-xl flex flex-col">
              <button className="self-end mb-4 text-gray-400" onClick={() => setMobileOpen(false)}>✕</button>
              <SidebarNav activePage={activePage} setPage={(p) => { setPage(p); setMobileOpen(false); }} pendingCount={pendingCount} />
            </aside>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ activePage, setPage, pendingCount }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
      {NAV.map(item => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-all duration-150 text-left
            ${activePage === item.id ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          style={activePage === item.id ? { background: `linear-gradient(135deg, ${C.maroon}, ${C.maroonLight})` } : {}}
        >
          <span className="text-base">{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.id === "assignments" && pendingCount > 0 && (
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activePage === item.id ? "bg-white/25 text-white" : "text-white"}`}
              style={activePage !== item.id ? { background: C.orange } : {}}>
              {pendingCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: DASHBOARD
══════════════════════════════════════════════════════════════ */
function DashboardPage({ student, setPage }) {
  const completedGrades = MOCK.grades.filter(g => g.total !== null);
  const gpa = completedGrades.length
    ? (completedGrades.reduce((s, g) => s + (g.points || 0), 0) / completedGrades.length).toFixed(2)
    : "—";
  const enrolled = MOCK.availableUnits.filter(u => u.enrolled).length;
  const pending = MOCK.assignments.filter(a => a.status === "pending").length;
  const feePct = fmt.pct(MOCK.fees.paid, MOCK.fees.totalFees);
  const outstanding = MOCK.fees.totalFees - MOCK.fees.paid;

  const steps = [
    { label: "Unit Registration",    done: true,  detail: `${enrolled} units enrolled` },
    { label: "Fees (Partial)",        done: true,  detail: `${feePct}% cleared` },
    { label: "Pending Assignments",   done: false, detail: `${pending} submissions due` },
    { label: "End-of-Semester Exams", done: false, detail: "Scheduled Jul 2026" },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.maroonDark}, ${C.maroon} 55%, #c0392b)` }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: C.orange, transform: "translate(30%,-30%)" }} />
        <div className="relative z-10">
          <p className="text-white/60 text-xs mb-1 uppercase tracking-widest">Academic Year {student.academicYear}</p>
          <h2 className="text-white text-2xl font-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back, {student.name.split(" ")[0]} 👋
          </h2>
          <p className="text-white/70 text-sm">{student.programme} · Year {student.year} · Semester {student.semester}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>🎓 {student.programme}</span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>📋 {student.studentId}</span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300" style={{ background: "rgba(0,200,100,0.15)" }}>✓ {student.status}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📚" label="Enrolled Units"      value={enrolled}           accent={C.maroon} />
        <StatCard icon="⭐" label="Current GPA"         value={gpa}                accent={C.orange} sub="/ 4.0 scale" />
        <StatCard icon="💳" label="Outstanding Fees"    value={fmt.currency(outstanding)} accent={C.blueDark} sub={`Due ${MOCK.fees.deadline}`} />
        <StatCard icon="✅" label="Assignments Done"    value={`${MOCK.assignments.filter(a=>a.status==="submitted").length}/${MOCK.assignments.length}`} accent="#1a7a30" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>Quick Actions</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { icon:"📊", label:"View My Grades",         page:"grades" },
              { icon:"📚", label:"Register / Drop Units",  page:"units" },
              { icon:"💰", label:"Pay Fees",               page:"fees" },
              { icon:"📤", label:"Submit an Assignment",   page:"assignments" },
            ].map(a => (
              <button
                key={a.page}
                onClick={() => setPage(a.page)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 text-sm font-semibold text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{a.icon}</span>
                <span className="flex-1">{a.label}</span>
                <span style={{ color: C.muted }}>→</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Notices */}
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>🔔 Recent Notices</h3>
          <div className="flex flex-col gap-3">
            {MOCK.notices.map((n, i) => {
              const cls = {
                warning: { bg: "#fef9c3", border: "#fde047", text: "#854d0e" },
                info:    { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
                success: { bg: "#dcfce7", border: "#86efac", text: "#166534" },
              }[n.type];
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: cls.bg, border: `1px solid ${cls.border}` }}>
                  <span>{n.icon}</span>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide mb-0.5" style={{ color: cls.text }}>{n.label}</div>
                    <div className="text-xs font-medium" style={{ color: cls.text }}>{n.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Semester progress */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>📈 Semester 2 Progress</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={s.done ? { background: "#1a7a30", color: "white" } : { background: "#e5e7eb", color: "#6b7280" }}
                >{s.done ? "✓" : i + 1}</div>
                <div>
                  <div className="text-xs font-bold leading-tight">{s.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: GRADES
══════════════════════════════════════════════════════════════ */
function GradesPage() {
  const [semFilter, setSemFilter] = useState("all");
  const { data: grades, loading } = useAsync(() => api.getGrades(semFilter), [semFilter]);

  const completed = (grades || []).filter(g => g.total !== null);
  const gpa = completed.length
    ? (completed.reduce((s, g) => s + (g.points || 0), 0) / completed.length).toFixed(2)
    : null;

  const gpaPct = gpa ? (parseFloat(gpa) / 4.0 * 100).toFixed(1) : 0;
  const circumference = 2 * Math.PI * 44;
  const strokeDash = circumference - (circumference * gpaPct / 100);

  const statusVariant = (s) => {
    if (s === "Pass") return "pass";
    if (s === "Supp.") return "supp";
    if (s === "In Progress") return "progress";
    return "fail";
  };

  return (
    <div>
      <PageHeader title="My Grades" subtitle={`Academic performance — ${MOCK.students["KTU/2024/001"].programme}`} />

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[["all","All Semesters"],["1","Semester 1 · 2025/26"],["2","Semester 2 · 2025/26"]].map(([v,l]) => (
          <button
            key={v}
            onClick={() => setSemFilter(v)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all
              ${semFilter === v ? "text-white border-transparent shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            style={semFilter === v ? { background: C.maroon } : {}}
          >{l}</button>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* GPA ring */}
        <Card className="p-6 flex flex-col items-center text-center">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>Overall GPA</h3>
          <div className="relative w-28 h-28 mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="9" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke={C.maroon} strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={gpa ? strokeDash : circumference}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black" style={{ color: C.maroon }}>{gpa ?? "—"}</span>
              <span className="text-[10px]" style={{ color: C.muted }}>/ 4.0</span>
            </div>
          </div>
          <div className="text-xs font-bold" style={{ color: gpa && parseFloat(gpa) >= 3.5 ? "#1a7a30" : C.muted }}>
            {gpa && parseFloat(gpa) >= 3.5 ? "✨ Very Good Standing" : gpa ? "Good Standing" : "No completed grades"}
          </div>
        </Card>

        <Card className="p-6 col-span-1 lg:col-span-2">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>Grade Summary</h3>
          <div className="grid grid-cols-3 gap-3 h-full">
            {[
              { val: completed.filter(g=>g.status==="Pass").length, label:"Passed Units", bg:"#f0fdf4", color:"#1a7a30" },
              { val: completed.filter(g=>g.status==="Supp.").length, label:"Supplementary", bg:"#fff7ed", color:C.orange },
              { val: completed.length ? Math.round(completed.reduce((s,g)=>s+g.total,0)/completed.length) + "%" : "—", label:"Average Score", bg:"#eff6ff", color:C.blueDark },
            ].map((s,i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl" style={{ background: s.bg }}>
                <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[11px] text-center font-medium" style={{ color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm" style={{ color: C.maroon }}>
            {semFilter === "all" ? "All Semesters" : `Semester ${semFilter} · 2025/2026`}
          </h3>
          <Btn variant="outline" size="sm" onClick={() => alert("PDF transcript generation would be triggered here (backend endpoint: GET /api/transcript)")}>
            📄 Download Transcript
          </Btn>
        </div>
        {loading ? <Skeleton rows={6} /> : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wide text-left" style={{ background: "#fdf5f7", color: C.maroon }}>
                  {["Unit Code","Unit Name","CAT /30","Exam /70","Total /100","Grade","Status"].map(h => (
                    <th key={h} className="px-4 py-3 border-b border-gray-100 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(grades || []).map(g => (
                  <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: C.orange }}>{g.unitCode}</td>
                    <td className="px-4 py-3 font-medium">{g.unitName}</td>
                    <td className="px-4 py-3 text-center">{g.cat ?? "—"}</td>
                    <td className="px-4 py-3 text-center">{g.exam ?? "—"}</td>
                    <td className="px-4 py-3 text-center font-bold" style={{ color: g.total ? (g.total >= 50 ? "#1a7a30" : "#991b1b") : C.muted }}>
                      {g.total ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-black" style={{ color: C.maroon }}>{g.grade}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant(g.status)}>{g.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: UNIT REGISTRATION
══════════════════════════════════════════════════════════════ */
function UnitsPage({ toast }) {
  const { data: units, loading, refetch } = useAsync(api.getAvailableUnits);
  const [localUnits, setLocalUnits] = useState(null);
  const [saving, setSaving] = useState(null);

  useEffect(() => { if (units) setLocalUnits(units); }, [units]);

  const enrolled = (localUnits || []).filter(u => u.enrolled);
  const totalCredits = enrolled.reduce((s, u) => s + u.credits, 0);
  const MAX_CREDITS = 21;

  const toggle = async (code) => {
    const unit = localUnits.find(u => u.code === code);
    if (!unit) return;

    if (!unit.enrolled) {
      if (totalCredits + unit.credits > MAX_CREDITS) { toast(`Credit limit exceeded (max ${MAX_CREDITS})`, "error"); return; }
      const prereqUnit = unit.prereq ? localUnits.find(u => u.code === unit.prereq) : null;
      if (prereqUnit && !prereqUnit.enrolled) { toast(`Prerequisite required: ${unit.prereq}`, "error"); return; }
    }

    setSaving(code);
    try {
      if (unit.enrolled) {
        await api.dropUnit(code);
        toast(`${unit.name} dropped`, "info");
      } else {
        await api.enrollUnit(code);
        toast(`${unit.name} added ✓`, "success");
      }
      setLocalUnits(prev => prev.map(u => u.code === code ? { ...u, enrolled: !u.enrolled } : u));
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(null); }
  };

  const confirmReg = () => toast(`Registration confirmed for ${enrolled.length} units 🎉`, "success");

  return (
    <div>
      <PageHeader title="Unit Registration" subtitle="Semester 2 · 2025/2026 — Registration window open until 15 Jun 2026" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="📚" label="Enrolled Units" value={enrolled.length} accent={C.maroon} />
        <StatCard icon="⚖️" label="Credit Hours"   value={totalCredits}    accent={C.orange} sub={`of ${MAX_CREDITS} max`} />
        <StatCard icon="🔒" label="Credit Limit"   value={MAX_CREDITS}     accent={C.blueDark} />
      </div>

      {/* Credit bar */}
      <Card className="p-5 mb-6">
        <div className="flex justify-between text-xs font-medium mb-2" style={{ color: C.muted }}>
          <span>Credit load: {totalCredits} / {MAX_CREDITS}</span>
          <span className={totalCredits > 18 ? "text-orange-600 font-bold" : ""}>{Math.round(totalCredits/MAX_CREDITS*100)}% of limit</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "#ece9e4" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalCredits/MAX_CREDITS)*100,100)}%`, background: totalCredits > 18 ? C.orange : C.maroon }}
          />
        </div>
      </Card>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm" style={{ color: C.maroon }}>Available Units — Semester 2</h3>
        <Btn onClick={confirmReg} size="sm">💾 Confirm Registration</Btn>
      </div>

      {loading ? <Skeleton rows={6} /> : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(localUnits || []).map(u => (
            <Card key={u.code} className={`p-5 border-2 transition-all duration-200 ${u.enrolled ? "border-blue-200 bg-blue-50/30" : "border-transparent"}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-black" style={{ color: C.orange }}>{u.code}</span>
                {u.enrolled && <Badge variant="enrolled">✓ Enrolled</Badge>}
              </div>
              <h4 className="font-bold text-sm mb-1">{u.name}</h4>
              <p className="text-xs mb-3" style={{ color: C.muted }}>{u.desc}</p>
              <div className="flex gap-3 text-[11px] font-medium mb-4" style={{ color: C.muted }}>
                <span>📚 {u.credits} credits</span>
                <span>{u.prereq ? `🔗 Prereq: ${u.prereq}` : "✅ No prereq"}</span>
              </div>
              {u.enrolled ? (
                <Btn variant="danger" size="sm" loading={saving === u.code} onClick={() => toggle(u.code)} className="w-full justify-center">
                  Drop Unit
                </Btn>
              ) : (
                <Btn variant="outline" size="sm" loading={saving === u.code} onClick={() => toggle(u.code)} className="w-full justify-center">
                  + Add Unit
                </Btn>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: FEES & PAYMENTS
══════════════════════════════════════════════════════════════ */
function FeesPage({ toast }) {
  const { data: fees, loading } = useAsync(api.getFees);
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payPhone, setPayPhone] = useState("");
  const [payMethod, setPayMethod] = useState("M-Pesa STK Push");
  const [paying, setPaying] = useState(false);

  if (loading) return <Skeleton rows={8} />;
  if (!fees) return null;

  const outstanding = fees.totalFees - fees.paid;
  const pct = fmt.pct(fees.paid, fees.totalFees);

  const processPayment = async () => {
    if (!payAmount || isNaN(payAmount) || Number(payAmount) < 100) { toast("Enter a valid amount (min KES 100)", "error"); return; }
    if (!payPhone) { toast("Enter your M-Pesa phone number", "error"); return; }
    setPaying(true);
    try {
      const res = await api.makePayment({ amount: Number(payAmount), phone: payPhone, method: payMethod });
      setPayModal(false);
      setPayAmount(""); setPayPhone("");
      toast(`Payment of ${fmt.currency(Number(payAmount))} initiated! Ref: ${res.ref}`, "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setPaying(false); }
  };

  return (
    <div>
      <PageHeader title="Fees & Payments" subtitle="Financial account summary — Academic Year 2025/2026" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="💵" label="Total Fees (Sem 2)" value={fmt.currency(fees.totalFees)} accent={C.maroon} />
        <StatCard icon="✅" label="Amount Paid"        value={fmt.currency(fees.paid)}      accent="#1a7a30" />
        <StatCard icon="⚠️" label="Outstanding"        value={fmt.currency(outstanding)}    accent={C.orange} sub={`Due ${fees.deadline}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Progress card */}
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>Payment Progress</h3>
            <div className="flex justify-between text-xs font-medium mb-2" style={{ color: C.muted }}>
              <span>Paid: {fmt.currency(fees.paid)}</span><span>Total: {fmt.currency(fees.totalFees)}</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden mb-2" style={{ background: "#ece9e4" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1a7a30, #2d9e48)" }} />
            </div>
            <p className="text-xs mb-5" style={{ color: C.muted }}>{pct}% cleared · Due by {fees.deadline}</p>
            <Btn variant="success" onClick={() => setPayModal(true)} className="w-full justify-center">💳 Make a Payment</Btn>

            {/* Mpesa details */}
            <div className="mt-4 p-4 rounded-xl" style={{ background: "#fdf9f5", border: "1px solid #ece9e4" }}>
              <div className="text-[11px] font-black uppercase tracking-wide mb-2" style={{ color: C.muted }}>M-Pesa Paybill Details</div>
              <div className="text-xs space-y-1">
                <div>📱 Paybill: <strong style={{ color: C.maroon }}>522 533</strong></div>
                <div>🔢 Account: <strong style={{ color: C.maroon }}>KTU/2024/001</strong></div>
                <div>🕐 Business Hours: Mon–Fri 8AM–5PM</div>
              </div>
            </div>
          </Card>

          {/* Fee breakdown */}
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>Fee Breakdown — Semester 2</h3>
            <div className="space-y-2">
              {fees.breakdown.map((b, i) => (
                <div key={i} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm">
                  <span style={{ color: C.muted }}>{b.item}</span>
                  <span className="font-semibold">{fmt.currency(b.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 font-black text-sm border-t-2" style={{ borderTopColor: C.maroon, color: C.maroon }}>
                <span>TOTAL</span><span>{fmt.currency(fees.totalFees)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column — payment history */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: C.maroon }}>Payment History</h3>
            <Btn variant="outline" size="sm" onClick={() => toast("Export would download statement PDF", "info")}>📥 Export</Btn>
          </div>
          <div className="space-y-3">
            {fees.payments.map(p => (
              <div key={p.id} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "#f0fdf4" }}>✅</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm">{fmt.currency(p.amount)}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.muted }}>{p.method} · {p.date}</div>
                    </div>
                    <Badge variant="pass">Paid</Badge>
                  </div>
                  <div className="text-[11px] font-mono mt-1" style={{ color: C.muted }}>Ref: {p.ref}</div>
                </div>
                <button
                  className="text-xs font-semibold flex-shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => toast("Receipt PDF would open here", "info")}
                >📄</button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payment modal */}
      <Modal open={payModal} onClose={() => setPayModal(false)} title="Make a Payment">
        <p className="text-xs mb-5" style={{ color: C.muted }}>Outstanding balance: <strong style={{ color: C.maroon }}>{fmt.currency(outstanding)}</strong></p>
        <div className="bg-green-600 text-white text-center py-3 rounded-xl font-black text-lg tracking-widest mb-5">M-PESA</div>
        <Input label="Amount (KES)" type="number" placeholder="e.g. 8000" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
        <Input label="M-Pesa Phone Number" type="tel" placeholder="07XX XXX XXX" value={payPhone} onChange={e => setPayPhone(e.target.value)} />
        <Select label="Payment Method" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
          <option>M-Pesa STK Push</option>
          <option>Paybill (Manual)</option>
          <option>Bank Transfer</option>
        </Select>
        <Btn variant="success" loading={paying} onClick={processPayment} className="w-full justify-center mt-2">
          💳 Process Payment
        </Btn>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: ASSIGNMENTS
══════════════════════════════════════════════════════════════ */
function AssignmentsPage({ toast }) {
  const { data: assignments, loading, refetch } = useAsync(api.getAssignments);
  const [localAsg, setLocalAsg] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  useEffect(() => { if (assignments) setLocalAsg(assignments); }, [assignments]);

  const list = localAsg || [];
  const pending = list.filter(a => a.status === "pending");
  const submitted = list.filter(a => a.status === "submitted");
  const now = new Date();

  const submit = async () => {
    if (!file) { toast("Please select a file", "error"); return; }
    setSubmitting(true);
    try {
      await api.submitAssignment(submitTarget.id, file, comment);
      setLocalAsg(prev => prev.map(a => a.id === submitTarget.id ? { ...a, status: "submitted" } : a));
      toast(`"${submitTarget.title}" submitted successfully 🎉`, "success");
      setSubmitTarget(null); setFile(null); setComment("");
    } catch (e) { toast(e.message, "error"); }
    finally { setSubmitting(false); }
  };

  const asgStatusBadge = (a) => {
    if (a.status === "submitted") return <Badge variant="submitted">✓ Submitted{a.marks !== null ? ` · ${a.marks}/${a.maxMarks}` : ""}</Badge>;
    if (new Date(a.deadline) < now) return <Badge variant="late">⚠ Overdue</Badge>;
    const dl = fmt.daysLeft(a.deadline);
    return <Badge variant={dl <= 2 ? "late" : "pending"}>⏳ {dl}d left</Badge>;
  };

  return (
    <div>
      <PageHeader title="Assignments" subtitle="Coursework submissions — Semester 2 · 2025/2026" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📋" label="Total"     value={list.length}      accent={C.maroon} />
        <StatCard icon="✅" label="Submitted" value={submitted.length} accent="#1a7a30" />
        <StatCard icon="⏳" label="Pending"   value={pending.length}   accent={C.orange} />
        <StatCard icon="📅" label="Next Due"  value={pending.length ? `${fmt.daysLeft(pending.sort((a,b)=>new Date(a.deadline)-new Date(b.deadline))[0].deadline)}d` : "—"} accent={C.blueDark} />
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>All Assignments</h3>
        {loading ? <Skeleton rows={5} /> : (
          <div className="divide-y divide-gray-50">
            {list.map(a => (
              <div key={a.id} className="py-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="text-[11.5px] font-black uppercase tracking-wide mb-1" style={{ color: C.orange }}>{a.unit}</div>
                  <div className="text-sm font-bold mb-1">{a.title}</div>
                  <div className="text-[11.5px]" style={{ color: C.muted }}>📅 Deadline: {fmt.date(a.deadline)}</div>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {asgStatusBadge(a)}
                  {a.status === "pending" && (
                    <Btn size="sm" onClick={() => { setSubmitTarget(a); setFile(null); setComment(""); }}>
                      📤 Submit
                    </Btn>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Submission form */}
      {submitTarget && (
        <Card className="p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: C.maroon }}>📤 Submit: {submitTarget.title}</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Unit</label>
              <div className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold" style={{ color: C.orange }}>{submitTarget.unit}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Deadline</label>
              <div className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-semibold">{fmt.date(submitTarget.deadline)}</div>
            </div>
          </div>

          {/* Upload zone */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Upload File (PDF, DOCX, ZIP)</label>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${file ? "border-emerald-300 bg-emerald-50/30" : "border-gray-200 hover:border-gray-300 bg-gray-50/50"}`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.zip" onChange={e => setFile(e.target.files[0])} />
              <div className="text-4xl mb-2">{file ? "✅" : "📁"}</div>
              {file ? (
                <div>
                  <p className="text-sm font-bold text-emerald-700">{file.name}</p>
                  <p className="text-xs text-emerald-600 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold"><span style={{ color: C.maroon }}>Click to browse</span> or drag & drop</p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>PDF, DOCX, ZIP — Max 10 MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Comments (optional)</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all focus:border-[#6a1830] focus:ring-2 focus:ring-[#6a183015] resize-none"
              placeholder="Any notes for your lecturer…"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Btn loading={submitting} onClick={submit}>📤 Submit Assignment</Btn>
            <Btn variant="outline" onClick={() => setSubmitTarget(null)}>Cancel</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("dashboard");
  const { toasts, toast } = useToast();

  // Load Google Fonts
  useEffect(() => {
    if (!document.querySelector("#kiharu-fonts")) {
      const l = document.createElement("link");
      l.id = "kiharu-fonts";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap";
      document.head.appendChild(l);
    }
    document.body.style.fontFamily = "'DM Sans', system-ui, sans-serif";
    document.body.style.background = C.bg;
    document.body.style.margin = "0";
  }, []);

  const pendingCount = MOCK.assignments.filter(a => a.status === "pending").length;

  if (!session) return <LoginPage onLogin={r => setSession(r)} />;

  const pageComponent = {
    dashboard:   <DashboardPage   student={session.student} setPage={setPage} />,
    grades:      <GradesPage />,
    units:       <UnitsPage toast={toast} />,
    fees:        <FeesPage toast={toast} />,
    assignments: <AssignmentsPage toast={toast} />,
  }[page];

  return (
    <>
      <AppShell student={session.student} onLogout={() => setSession(null)} activePage={page} setPage={setPage} pendingCount={pendingCount}>
        {pageComponent}
      </AppShell>
      <ToastStack toasts={toasts} />
    </>
  );
}