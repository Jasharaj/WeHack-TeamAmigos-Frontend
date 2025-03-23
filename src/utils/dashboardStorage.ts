interface Report {
  id: string;
  title: string;
  content: string;
  date: string;
  caseId?: string;
  caseName?: string;
  status: 'draft' | 'final';
  lastModified: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  caseId?: string;
  caseName?: string;
}

interface Dispute {
  id: string;
  title: string;
  description: string;
  parties: {
    plaintiff: string;
    defendant: string;
  };
  status: 'pending' | 'mediation' | 'resolved' | 'court';
  category: 'civil' | 'criminal' | 'corporate' | 'family' | 'property';
  dateCreated: string;
  lastUpdated: string;
  nextHearing?: string;
  documents?: string[];
}

interface Document {
  id: string;
  title: string;
  description: string;
  category: 'contract' | 'evidence' | 'court' | 'identification' | 'other';
  dateUploaded: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
}

const REPORTS_KEY = 'lawyer_reports';
const REMINDERS_KEY = 'lawyer_reminders';
const DISPUTES_KEY = 'lawyer_disputes';
const DOCUMENTS_KEY = 'documents';

// Reports Functions
export function saveReports(reports: Report[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function loadReports(): Report[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REPORTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Reminders Functions
export function saveReminders(reminders: Reminder[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export function loadReminders(): Reminder[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REMINDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Disputes Functions
export function saveDisputes(disputes: Dispute[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DISPUTES_KEY, JSON.stringify(disputes));
}

export function loadDisputes(): Dispute[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DISPUTES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Documents Functions
export function loadDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(DOCUMENTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export function saveDocuments(documents: Document[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export type { Report, Reminder, Dispute, Document };
