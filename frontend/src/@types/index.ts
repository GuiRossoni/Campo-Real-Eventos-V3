export type UserRole = 'ALUNO' | 'PROFESSOR' | 'COORDENADOR' | 'ROOT';

export interface User {
  id: string;
  name: string;
  email: string;
  ra?: string;
  course?: string;
  institution?: string;
  period?: string;
  role: UserRole;
  password?: string;
}

export type EventStatus = 'ANALISE' | 'PUBLICADO' | 'ENCERRADO' | 'CANCELADO';

export interface Event {
  id: string;
  name: string;
  description: string;
  banner: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  category: string;
  maxParticipants: number;
  status: EventStatus;
  creatorId: string;
  creatorName: string;
  isFeatured: boolean;
  price: number;
}

export interface Workshop {
  id: string;
  eventId: string;
  name: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  maxParticipants: number;
  price: number;
  enrolledCount: number;
  hours?: number;
}

export type PaymentStatus = 'PENDENTE' | 'APROVADO' | 'CANCELADO';

export interface Enrollment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRa?: string;
  eventId: string;
  eventName: string;
  selectedWorkshops: string[];
  totalValue: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRa?: string;
  eventId: string;
  workshopId?: string;
  checkedInAt: string;
  checkedInBy: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userRa?: string;
  eventId: string;
  eventName: string;
  hours: number;
  hash: string;
  issuedAt: string;
  coordinationSignature: string;
  workshopsDetails?: string;
}

export interface SystemLog {
  id: string;
  action: string;
  userEmail: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
}

export interface HomeBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkToEventId?: string;
  isActive: boolean;
}

export type ExpenseCategory = 'INFRAESTRUTURA' | 'REFEICAO' | 'MARKETING' | 'PALESTRANTE' | 'SERVICOS' | 'PATROCINIO' | 'APORTE' | 'OUTROS';

export interface FinancialExpense {
  id: string;
  eventId: string;
  eventName: string;
  description: string;
  category: ExpenseCategory;
  value: number;
  type: 'DESPESA' | 'ENTRADA';
  date: string;
  createdAt: string;
}
