import { Gig, User, ChatThread, WalletTransaction } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u2', name: 'Sarah J.', role: 'client', avatar: 'https://picsum.photos/id/65/200/200', rating: 4.9, location: 'London, UK', isVerified: true }, // Diaspora Client
  { id: 'u3', name: 'Dr. Moyo', role: 'client', avatar: 'https://picsum.photos/id/66/200/200', rating: 5.0, location: 'Avenues, Harare', isVerified: true }, // Local Client
  { id: 'u4', name: 'Tinashe M.', role: 'atumwa', avatar: 'https://picsum.photos/id/68/200/200', rating: 4.6, location: 'Warren Park', isVerified: true },
];

// Defined Roles for Login
// MOCK_ATUMWA is unverified to demonstrate ID upload flow
export const MOCK_ATUMWA: User = {
  id: 'u1',
  name: 'Blessing C.',
  role: 'atumwa',
  avatar: 'https://picsum.photos/id/64/200/200',
  rating: 4.8,
  location: 'Harare CBD',
  jobsCompleted: 142,
  isVerified: false 
};

// MOCK_CLIENT is unverified to demonstrate email verification flow
export const MOCK_CLIENT: User = {
  ...MOCK_USERS[0],
  isVerified: false
}; 

export const MOCK_ADMIN: User = {
  id: 'admin1',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff',
  rating: 5.0,
  location: 'Eastgate Centre',
  jobsCompleted: 0,
  isVerified: true
};

export const MOCK_GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Urgent Prescription Pickup',
    description: 'Need someone to pick up a prescription from Greenwood Pharmacy on Fife Ave and deliver to my mother in the Avenues.',
    type: 'prescription',
    price: 15.00,
    paymentMethod: 'ecocash',
    urgency: 'priority',
    status: 'open',
    locationStart: 'Greenwood Pharmacy, Fife Ave',
    locationEnd: 'Jacaranda Mews, Avenues',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[1], // Dr. Moyo
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    distance: '2.5 km'
  },
  {
    id: 'g2',
    title: 'Legal Document Drop-off',
    description: 'Deliver signed contracts to the High Court. Must be there before 4 PM.',
    type: 'paperwork',
    price: 25.00,
    paymentMethod: 'cash_usd',
    urgency: 'express',
    status: 'in-progress', // Changed to in-progress for demo
    locationStart: 'Honey & Blanckenberg, 2nd St',
    locationEnd: 'High Court, Samora Machel',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[0], // Sarah (Diaspora)
    postedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    distance: '1.2 km',
    assignedTo: 'u1' // Assigned to mock Atumwa
  },
  {
    id: 'g3',
    title: 'Grocery Run for Family',
    description: 'Fresh veggies, Maize Meal, and Cooking Oil from Food Lovers. Delivery to Mt Pleasant.',
    type: 'shopping',
    price: 18.50,
    paymentMethod: 'zig',
    urgency: 'standard',
    status: 'open',
    locationStart: 'Food Lovers Market, Avondale',
    locationEnd: 'Office Park, Mt Pleasant',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[0], // Sarah (Diaspora)
    postedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    distance: '3.0 km'
  },
  {
    id: 'g4',
    title: 'Bus Parcel Collection',
    description: 'Collect a parcel sent from Bulawayo arriving at Roadport. It is a box of auto parts.',
    type: 'parcel',
    price: 20.00,
    paymentMethod: 'ecocash',
    urgency: 'standard',
    status: 'in-progress',
    locationStart: 'Roadport Bus Station',
    locationEnd: 'Greendale',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[2], // Tinashe
    postedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    distance: '8.0 km',
    assignedTo: 'u1' // Assigned to the mock Atumwa
  },
  {
    id: 'g5',
    title: 'Gym Bag Retrieval',
    description: 'Left my gym bag at the studio in Sam Levy\'s. Need it brought to my office in town.',
    type: 'parcel',
    price: 12.00,
    paymentMethod: 'cash_usd',
    urgency: 'standard',
    status: 'open', // This should be marked expired by logic
    locationStart: 'ProFitness, Borrowdale',
    locationEnd: 'Eastgate Centre, CBD',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 96 hours ago (4 days)
    distance: '11.5 km'
  },
  {
    id: 'g6',
    title: 'Last Minute Airport Delivery',
    description: 'Need a package delivered to RGM Airport departures drop-off zone.',
    type: 'parcel',
    price: 45.00,
    paymentMethod: 'cash_usd',
    urgency: 'priority',
    status: 'open',
    locationStart: 'Meikles Hotel',
    locationEnd: 'RGM Int. Airport',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(), // 52 hours ago (within last 24h of 72h window)
    distance: '14 km'
  },
  {
    id: 'g7',
    title: 'Coffee Run - Urgent',
    description: 'Need 2 lattes and a croissant from Java Coffee in Borrowdale delivered to my office in CBD.',
    type: 'shopping',
    price: 8.50,
    paymentMethod: 'ecocash',
    urgency: 'express',
    status: 'open',
    locationStart: 'Java Coffee, Borrowdale',
    locationEnd: 'Merchant Bank, CBD',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[1],
    postedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    distance: '4.5 km'
  },
  {
    id: 'g8',
    title: 'Medical Records Pickup',
    description: 'Pick up X-rays and lab results from Parirenyatwa Hospital for my grandmother.',
    type: 'paperwork',
    price: 22.00,
    paymentMethod: 'cash_usd',
    urgency: 'standard',
    status: 'open',
    locationStart: 'Parirenyatwa Hospital',
    locationEnd: 'Hatfield, Harare',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[2],
    postedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    distance: '6.2 km'
  },
  {
    id: 'g9',
    title: 'Birthday Cake Delivery',
    description: 'Surprise delivery of a custom cake from Cake Palace to a birthday party in Mt Pleasant.',
    type: 'parcel',
    price: 15.00,
    paymentMethod: 'zig',
    urgency: 'express',
    status: 'in-progress',
    locationStart: 'Cake Palace, Avondale',
    locationEnd: 'Mt Pleasant Heights',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    distance: '5.8 km',
    assignedTo: 'u1'
  },
  {
    id: 'g10',
    title: 'Office Supplies Run',
    description: 'Pick up printer cartridges and stationery from Office World in CBD.',
    type: 'shopping',
    price: 18.00,
    paymentMethod: 'ecocash',
    urgency: 'standard',
    status: 'open',
    locationStart: 'Office World, CBD',
    locationEnd: 'Belgravia, Harare',
    stops: [],
    checklist: [],
    postedBy: MOCK_USERS[1],
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    distance: '3.1 km'
  }
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: 'c1',
    participant: MOCK_USERS[0],
    lastMessage: 'Is the prescription ready for pickup?',
    lastMessageTime: '10:30 AM',
    unreadCount: 1
  },
  {
    id: 'c2',
    participant: MOCK_USERS[1],
    lastMessage: 'Thank you for the quick delivery!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'c3',
    participant: MOCK_USERS[2],
    lastMessage: 'Can you help with a parcel tomorrow?',
    lastMessageTime: '2h ago',
    unreadCount: 2
  },
  {
    id: 'c4',
    participant: MOCK_USERS[0],
    lastMessage: 'Delivery completed successfully!',
    lastMessageTime: '1d ago',
    unreadCount: 0
  }
];

export const WALLET_HISTORY: WalletTransaction[] = [
  { id: 't1', date: '2023-10-25', amount: 25.00, type: 'credit' as const, description: 'Legal Doc Delivery', status: 'completed' as const },
  { id: 't2', date: '2023-10-24', amount: 15.00, type: 'credit' as const, description: 'Coffee Run - Avondale', status: 'completed' as const },
  { id: 't3', date: '2023-10-22', amount: -5.00, type: 'debit' as const, description: 'Platform Fee', status: 'completed' as const },
  { id: 't4', date: '2023-10-20', amount: 40.00, type: 'credit' as const, description: 'Roadport Parcel', status: 'completed' as const },
  { id: 't5', date: '2023-10-18', amount: 22.00, type: 'credit' as const, description: 'Pharmacy Pickup', status: 'completed' as const },
  { id: 't6', date: '2023-10-16', amount: 18.50, type: 'credit' as const, description: 'Grocery Run - Mt Pleasant', status: 'completed' as const },
  { id: 't7', date: '2023-10-14', amount: 12.00, type: 'credit' as const, description: 'Gym Bag Retrieval', status: 'completed' as const },
  { id: 't8', date: '2023-10-12', amount: 35.00, type: 'credit' as const, description: 'Airport Delivery', status: 'completed' as const },
  { id: 't9', date: '2023-10-10', amount: -2.50, type: 'debit' as const, description: 'Service Charge', status: 'completed' as const },
  { id: 't10', date: '2023-10-08', amount: 28.00, type: 'credit' as const, description: 'Medical Records', status: 'completed' as const },
];

export const FEED_UPDATES = [
  // Achievement posts
  {
    id: 1,
    user: MOCK_ATUMWA,
    content: '🎉 Just hit 150 deliveries! Thanks to all my amazing clients in Harare. CBD to Borrowdale, I\'m your guy! 🚀',
    time: '30m ago',
    type: 'achievement',
    likes: 12,
    comments: 5
  },
  // Gig completion celebration
  {
    id: 2,
    user: MOCK_USERS[0],
    content: '⭐⭐⭐⭐⭐ Amazing service! Blessing delivered my urgent prescription in record time. You\'re a lifesaver! 💊🙏 #AtumwaHero',
    time: '1h ago',
    type: 'review',
    gigId: 'g1',
    likes: 8,
    comments: 2
  },
  // New gig posted
  {
    id: 3,
    user: MOCK_USERS[1],
    content: '📢 NEW GIG: Urgent coffee run from Java Coffee Borrowdale to CBD. $8.50 - perfect for someone in the area! ☕',
    time: '2h ago',
    type: 'gig_post',
    gigId: 'g7',
    likes: 3,
    comments: 1
  },
  // Messenger availability
  {
    id: 4,
    user: MOCK_ATUMWA,
    content: '🟢 Available now! Just finished a delivery in Avondale. Ready for pickups in Borrowdale, CBD, or Avenues. DM me! 📍',
    time: '3h ago',
    type: 'availability',
    location: 'Avondale',
    likes: 6,
    comments: 3
  },
  // Community tip
  {
    id: 5,
    user: MOCK_USERS[2],
    content: '💡 Pro tip: For secure deliveries, ask your Atumwa to take a quick photo of the package before pickup. Peace of mind! 📸',
    time: '4h ago',
    type: 'tip',
    likes: 15,
    comments: 7
  },
  // Milestone celebration
  {
    id: 6,
    user: MOCK_USERS[0],
    content: '🏆 Completed my 50th delivery with Atumwa! From diaspora to local - this platform connects us all. 🌍❤️',
    time: '5h ago',
    type: 'milestone',
    likes: 22,
    comments: 9
  },
  // Local event/discovery
  {
    id: 7,
    user: MOCK_USERS[1],
    content: '📍 Found this amazing new coffee spot in Borrowdale! Perfect pickup location for your coffee runs. Try the Ethiopian blend! ☕🇪🇹',
    time: '6h ago',
    type: 'discovery',
    location: 'Borrowdale',
    likes: 11,
    comments: 4
  },
  // Platform feature highlight
  {
    id: 8,
    user: MOCK_ADMIN,
    content: '🚀 New Feature Alert! You can now track your Atumwa in real-time on the live map. See exactly where they are and ETA updates! 🗺️',
    time: '8h ago',
    type: 'announcement',
    likes: 34,
    comments: 12
  },
  // Quick gig completed
  {
    id: 9,
    user: MOCK_ATUMWA,
    content: '⚡ Lightning fast delivery! Picked up documents from Samora Machel and delivered to High Court in under 20 minutes. Traffic was on my side today! 🏃‍♂️💨',
    time: '10h ago',
    type: 'speed_delivery',
    gigId: 'g2',
    likes: 9,
    comments: 3
  },
  // Weekend availability
  {
    id: 10,
    user: MOCK_USERS[2],
    content: '🌅 Good morning Harare! Available for weekend deliveries. Specializing in medical records and pharmacy pickups. Let\'s make your Saturday easier! 💼',
    time: '12h ago',
    type: 'weekend_available',
    likes: 7,
    comments: 2
  },
  // Helpful review
  {
    id: 11,
    user: MOCK_USERS[0],
    content: '📦 Shoutout to Tinashe for handling my fragile parcel with such care! Wrapped it perfectly and delivered safely to Greendale. 5 stars! ⭐⭐⭐⭐⭐',
    time: '16h ago',
    type: 'review',
    gigId: 'g4',
    likes: 13,
    comments: 5
  },
  // Community support
  {
    id: 12,
    user: MOCK_USERS[1],
    content: '🙏 To all the Atumwas working in the rain today - you\'re appreciated! Safe travels and stay dry out there. ☔❤️',
    time: '18h ago',
    type: 'community',
    likes: 28,
    comments: 14
  }
];
