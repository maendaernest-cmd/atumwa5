export type UserRole = 'client' | 'atumwa' | 'admin' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  rating: number;
  location: string;
  jobsCompleted?: number;
  isVerified: boolean;
  isOnline?: boolean;
  isSuspended?: boolean;
  isBanned?: boolean;
  suspensionReason?: string;
  banReason?: string;
  earnings?: number;
  completedTasks?: number;
  averageRating?: number;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  // Authentication fields
  passwordHash?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Account security
  failedLoginAttempts: number;
  lockedUntil?: string;
  // 2FA (optional)
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeToTerms: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export type GigType = 'prescription' | 'paperwork' | 'parcel' | 'shopping';
export type PaymentMethod = 'ecocash' | 'cash_usd' | 'zig';
export type UrgencyLevel = 'standard' | 'express' | 'priority';
export type TaskStatus = 'draft' | 'open' | 'in-progress' | 'purchased' | 'delivered' | 'verified' | 'completed' | 'expired' | 'cancelled';

export interface Stop {
  id: string;
  type: 'pickup' | 'dropoff';
  location: string;
  address: string;
  instructions?: string;
  contactName?: string;
  contactPhone?: string;
  completed?: boolean;
  completedAt?: string;
  proofOfDelivery?: DeliveryProof[];
}

export interface DeliveryProof {
  id: string;
  type: 'photo' | 'signature' | 'qr_code' | 'barcode' | 'notes';
  url?: string;
  data?: string;
  timestamp: string;
  verified?: boolean;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: GigType;
  stops: Omit<Stop, 'id' | 'completed' | 'completedAt' | 'proofOfDelivery'>[];
  checklist: ChecklistItem[];
  estimatedPrice: number;
  paymentMethod: PaymentMethod;
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
  photos?: string[];
}

export interface RecurringTask {
  id: string;
  templateId: string;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6, Sunday = 0
    timeOfDay: string; // HH:MM format
    nextRun: string; // ISO date
  };
  clientId: string;
  isActive: boolean;
  createdTasks: string[]; // IDs of tasks created from this recurring task
}

export interface TimeWindow {
  start: string; // ISO datetime
  end: string; // ISO datetime
  flexible: boolean;
}

export interface Gig {
  id: string;
  orderNumber?: string;
  title: string;
  description: string;
  type: GigType;
  price: number;
  estimatedPrice?: number;
  paymentMethod: PaymentMethod;
  urgency: UrgencyLevel;
  status: TaskStatus;
  locationStart: string;
  locationEnd: string;
  stops: Stop[]; // Multi-stop support
  checklist: ChecklistItem[];
  timeWindow?: TimeWindow;
  postedBy: User;
  postedAt: string; // ISO date string
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance: string;
  assignedTo?: string; // ID of the Atumwa who accepted the gig
  assignedAt?: string;
  completedAt?: string;
  templateId?: string; // If created from template
  recurringId?: string; // If part of recurring task
  bids?: Bid[]; // For bidding system
  proofOfDelivery?: DeliveryProof[];
  messengerNotes?: string;
  clientRating?: number;
  clientReview?: string;
  messengerRating?: number;
  messengerReview?: string;
  tipAmount?: number;
  totalEarnings?: number;
}

export interface Bid {
  id: string;
  messengerId: string;
  messenger: User;
  amount: number;
  message?: string;
  timestamp: string;
  accepted?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface ChatThread {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isTyping?: boolean;
  relatedGigId?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  gigId?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface EarningsSummary {
  totalEarnings: number;
  thisWeek: number;
  thisMonth: number;
  pendingPayouts: number;
  completedTasks: number;
  averageRating: number;
  tipsReceived: number;
  transactions: WalletTransaction[];
}

export interface ClientDashboard {
  activeTasks: Gig[];
  upcomingTasks: Gig[];
  completedTasks: Gig[];
  recurringTasks: RecurringTask[];
  templates: TaskTemplate[];
  savedAddresses: Address[];
  credits: number;
  totalSpent: number;
  completedTasksCount: number;
}

export interface MessengerDashboard {
  availableTasks: Gig[];
  activeTasks: Gig[];
  completedTasks: Gig[];
  earnings: EarningsSummary;
  rating: number;
  completedCount: number;
  responseRate: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  shiftStatus: 'off' | 'available' | 'busy';
}

export interface Address {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeMessengers: number;
  activeClients: number;
  totalTasks: number;
  completedTasks: number;
  averageTaskValue: number;
  totalRevenue: number;
  disputeRate: number;
  completionRate: number;
  popularAreas: { area: string; taskCount: number }[];
  hourlyActivity: { hour: number; tasks: number }[];
  taskTypeDistribution: { type: GigType; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
}
