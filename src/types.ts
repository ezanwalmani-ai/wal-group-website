export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: 'dsp' | 'afp' | 'bpo' | 'digital' | 'web';
  shortDesc: string;
  fullDesc: string;
  techList?: string[];
  keyPoints: string[];
  iconName: string;
  heroImage: string;
}

export interface Ticket {
  id: string; // WM-YYYYMMDD-XXXX
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  department: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  message: string;
  status: 'Open' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed';
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
  attachments?: string[];
}

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedinUrl?: string;
  position: string;
  experienceYears: number;
  currentCompany?: string;
  noticePeriod: string;
  expectedSalary: string;
  resumeFileName?: string;
  coverLetter?: string;
  appliedAt: string;
  status: 'New' | 'Reviewed' | 'Interviewing' | 'Hired' | 'Rejected';
}

export interface IndustrySlide {
  id: string;
  name: string;
  label: string;
  icon: string;
  imageUrl: string;
  description: string;
}
