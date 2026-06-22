export type ScreenId =
  | "dashboard"
  | "ai-checker"
  | "appointments"
  | "video-call"
  | "chat"
  | "profile"
  | "analytics";

export type UserRole = "patient" | "doctor" | "admin";

export type MessageItem = {
  role: "ai" | "user";
  text: string;
  meta: string;
};

export type DoctorItem = {
  id: number;
  name: string;
  specialty: string;
  initials: string;
  rating: number;
  availability: string;
  tone: "green" | "blue" | "amber";
};

export type PatientItem = {
  name: string;
  issue: string;
  status: "Active" | "Pending" | "Closed";
};

export type NavItem = {
  id: ScreenId;
  label: string;
  href: string;
  badge?: string;
  requiredRoles: UserRole[];
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", requiredRoles: ["patient", "doctor", "admin"] },
  { id: "ai-checker", label: "AI Checker", href: "/ai-checker", requiredRoles: ["patient"] },
  { id: "appointments", label: "Appointments", href: "/appointments", requiredRoles: ["patient", "doctor"] },
  { id: "video-call", label: "Video Call", href: "/video-call", requiredRoles: ["patient", "doctor"] },
  { id: "chat", label: "Chat", href: "/chat", badge: "3", requiredRoles: ["patient", "doctor"] },
  { id: "profile", label: "Profile", href: "/profile", requiredRoles: ["patient", "doctor", "admin"] },
  { id: "analytics", label: "Analytics", href: "/analytics", requiredRoles: ["doctor", "admin"] },
];

export const statCards = [
  {
    label: "Upcoming Appts",
    value: "3",
    tone: "blue",
    change: "↑ 1 this week",
  },
  {
    label: "Health Score",
    value: "87",
    tone: "green",
    change: "↑ 4 pts this month",
  },
  {
    label: "Consultations",
    value: "12",
    tone: "amber",
    change: "2 this month",
  },
  {
    label: "Prescriptions",
    value: "4",
    tone: "purple",
    change: "1 expired",
  },
] as const;

export const appointments = [
  {
    time: "09:00 AM",
    day: "Today",
    doctor: "Dr. Priya Kapoor",
    specialty: "General Consultation",
    initials: "PK",
    mode: "Video",
    tone: "green",
  },
  {
    time: "02:30 PM",
    day: "Tomorrow",
    doctor: "Dr. Michael Reed",
    specialty: "Cardiology Review",
    initials: "MR",
    mode: "Chat",
    tone: "blue",
  },
  {
    time: "11:00 AM",
    day: "Apr 22",
    doctor: "Dr. Aisha Loren",
    specialty: "Dermatology",
    initials: "AL",
    mode: "In-person",
    tone: "amber",
  },
] as const;

export const doctors: DoctorItem[] = [
  {
    id: 0,
    name: "Dr. Priya Kapoor",
    specialty: "Neurologist",
    initials: "PK",
    rating: 5,
    availability: "Available today",
    tone: "green",
  },
  {
    id: 1,
    name: "Dr. Michael Reed",
    specialty: "Cardiologist",
    initials: "MR",
    rating: 4,
    availability: "Available tomorrow",
    tone: "blue",
  },
  {
    id: 2,
    name: "Dr. Aisha Loren",
    specialty: "Dermatologist",
    initials: "AL",
    rating: 5,
    availability: "Next: Apr 22",
    tone: "amber",
  },
];

export const calendarDays = [
  "", "", "", "1", "2", "3", "4",
  "5", "6", "7", "8", "9", "10", "11",
  "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30", "", "",
] as const;

export const daysWithSlots = new Set(["21", "22", "23", "24", "28"]);

export const timeSlotsByDay: Record<string, { label: string; taken?: boolean }[]> =
  {
    "21": [
      { label: "09:30" },
      { label: "10:00", taken: true },
      { label: "10:30" },
      { label: "11:00" },
      { label: "02:00" },
      { label: "02:30" },
      { label: "03:00", taken: true },
      { label: "03:30" },
    ],
    "22": [
      { label: "09:00" },
      { label: "09:30" },
      { label: "11:00" },
      { label: "11:30" },
      { label: "01:00" },
      { label: "03:00", taken: true },
      { label: "03:30" },
      { label: "04:00" },
    ],
  };

export const notifications = [
  {
    title: "Appointment reminder:",
    body: "Video call with Dr. Priya Kapoor tomorrow at 9:00 AM",
    time: "2m ago",
    tone: "blue",
  },
  {
    title: "Lab results ready:",
    body: "Your blood panel results have been uploaded to your records",
    time: "1h ago",
    tone: "green",
  },
  {
    title: "Prescription refill:",
    body: "Metformin 500mg prescription expires in 5 days",
    time: "3h ago",
    tone: "amber",
  },
] as const;

export const aiStarterMessages: MessageItem[] = [
  {
    role: "ai" as const,
    text: "Hello! I'm your MedflowAI health assistant. I can help assess your symptoms, provide health info, and connect you with the right specialist. How are you feeling today?",
    meta: "MedflowAI · 10:30 AM",
  },
  {
    role: "user" as const,
    text: "I've been having a persistent headache for 3 days along with fatigue.",
    meta: "You · 10:32 AM",
  },
  {
    role: "ai" as const,
    text: "I understand. Let me ask a few questions to better assess your situation.\n\n1. Headache location: forehead, temples, back of head, or all-over?\n2. Pain level: on a scale of 1–10, how intense?\n3. Other symptoms: nausea, light sensitivity, neck stiffness, or fever?",
    meta: "MedflowAI · 10:32 AM",
  },
  {
    role: "user" as const,
    text: "Mostly temples and forehead, about 5/10. No fever but some light sensitivity.",
    meta: "You · 10:35 AM",
  },
  {
    role: "ai" as const,
    text: "Based on your symptoms this is consistent with a tension headache or possibly migraine without aura. Rest in a quiet room, stay hydrated, and consider OTC pain relief if appropriate. Would you like me to connect you with a neurologist?",
    meta: "MedflowAI · 10:35 AM",
  },
];

export const aiChips = [
  "Headache in temples",
  "Feeling fatigued",
  "Sore throat & cough",
  "Chest discomfort",
] as const;

export const assessmentSummary = [
  { label: "Tension Headache", value: 72, tone: "amber" },
  { label: "Migraine", value: 48, tone: "red" },
  { label: "Dehydration", value: 30, tone: "blue" },
] as const;

export const chatConversations = [
  {
    id: 0,
    name: "Dr. Priya Kapoor",
    initials: "PK",
    preview: "See you tomorrow at 9 AM",
    unread: 2,
    online: true,
    tone: "green",
  },
  {
    id: 1,
    name: "MedflowAI Assistant",
    initials: "AI",
    preview: "Symptom check complete",
    unread: 0,
    online: true,
    tone: "blue",
  },
  {
    id: 2,
    name: "Dr. Michael Reed",
    initials: "MR",
    preview: "Please review the report",
    unread: 1,
    online: false,
    tone: "blue",
  },
] as const;

export const chatMessages: MessageItem[] = [
  {
    role: "ai" as const,
    text: "Hello Sarah, I reviewed your symptom report. The description is consistent with tension headache. I've prepared some questions for our video call tomorrow.",
    meta: "Dr. Kapoor · 8:45 AM",
  },
  {
    role: "user" as const,
    text: "Thank you Doctor. Should I continue with the ibuprofen until then?",
    meta: "You · 8:52 AM",
  },
  {
    role: "ai" as const,
    text: "Yes, 400mg every 6–8 hours with food is fine. Also avoid excessive screen time and drink plenty of water. See you tomorrow at 9 AM.",
    meta: "Dr. Kapoor · 9:01 AM",
  },
  {
    role: "user" as const,
    text: "Great, thank you! See you tomorrow.",
    meta: "You · 9:03 AM",
  },
];

export const profileVitals = [
  { label: "Heart Rate", value: "72 bpm", tone: "red" },
  { label: "Blood Pressure", value: "118/76", tone: "blue" },
  { label: "Temperature", value: "36.8°C", tone: "amber" },
] as const;

export const recentPatients: PatientItem[] = [
  { name: "Sarah Johnson", issue: "Neurology follow-up", status: "Active" },
  { name: "Daniel White", issue: "Chest pain review", status: "Pending" },
  { name: "Mia Collins", issue: "Dermatology consult", status: "Closed" },
];
