// ═══════════════════════════════════════════════
//  PRUTHWEE PLATFORM CONSTANTS
// ═══════════════════════════════════════════════

// ── NAVIGATION ───────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'For Volunteers',  href: '/for-volunteers' },
  { label: 'For Organisers',  href: '/for-organisers' },
  { label: 'Events',          href: '/events' },
  { label: 'About',           href: '/about' },
  { label: 'Contact',         href: '/contact' },
] as const;

// ── STATUS TIER SYSTEM ────────────────────────
export const STATUS_TIERS = [
  {
    id:         'none',
    label:      'New',
    hoursMin:   0,
    hoursMax:   0.24,
    color:      '#9CA3AF',
    bgColor:    'rgba(156, 163, 175, 0.12)',
    borderColor:'rgba(156, 163, 175, 0.3)',
    icon:       '⬜',
    perks:      ['Profile creation', 'Event browsing'],
  },
  {
    id:         'volunteer',
    label:      'Volunteer',
    hoursMin:   0.25,
    hoursMax:   24.75,
    color:      '#6EE07A',
    bgColor:    'rgba(110, 224, 122, 0.12)',
    borderColor:'rgba(110, 224, 122, 0.3)',
    icon:       '🌿',
    perks:      ['Certificate access', 'Profile visibility to organisers'],
  },
  {
    id:         'bronze',
    label:      'Bronze',
    hoursMin:   25,
    hoursMax:   74.75,
    color:      '#CD7F32',
    bgColor:    'rgba(205, 127, 50, 0.12)',
    borderColor:'rgba(205, 127, 50, 0.3)',
    icon:       '🥉',
    perks:      ['Featured in volunteer spotlight', 'Priority registration for popular events'],
  },
  {
    id:         'silver',
    label:      'Silver',
    hoursMin:   75,
    hoursMax:   199.75,
    color:      '#C0C0C0',
    bgColor:    'rgba(192, 192, 192, 0.12)',
    borderColor:'rgba(192, 192, 192, 0.3)',
    icon:       '🥈',
    perks:      ['Silver badge on profile', 'Newsletter shoutout', 'Event discount'],
  },
  {
    id:         'gold',
    label:      'Gold',
    hoursMin:   200,
    hoursMax:   499.75,
    color:      '#FFD700',
    bgColor:    'rgba(255, 215, 0, 0.12)',
    borderColor:'rgba(255, 215, 0, 0.3)',
    icon:       '🥇',
    perks:      ['Gold badge', 'Awards ceremony invite', 'Pruthwee merch'],
  },
  {
    id:         'platinum',
    label:      'Platinum',
    hoursMin:   500,
    hoursMax:   999.75,
    color:      '#E5E4E2',
    bgColor:    'rgba(229, 228, 226, 0.12)',
    borderColor:'rgba(229, 228, 226, 0.3)',
    icon:       '💎',
    perks:      ['Platinum recognition', 'Press feature', 'Summit speaker invite'],
  },
  {
    id:         'diamond',
    label:      'Diamond',
    hoursMin:   1000,
    hoursMax:   Infinity,
    color:      '#A7EBF2',
    bgColor:    'rgba(167, 235, 242, 0.12)',
    borderColor:'rgba(167, 235, 242, 0.4)',
    icon:       '🌟',
    perks:      ['Diamond Ambassador status', 'Pruthwee Advisory Board invite'],
  },
] as const;

// ── EVENT CATEGORIES ──────────────────────────
export const EVENT_CATEGORIES = [
  { id: 'environment', label: 'Environment',  icon: '🌿', color: '#6EE07A' },
  { id: 'education',   label: 'Education',    icon: '📚', color: '#93C5FD' },
  { id: 'health',      label: 'Health',       icon: '❤️', color: '#FCA5A5' },
  { id: 'sports',      label: 'Sports',       icon: '⚽', color: '#FCD34D' },
  { id: 'cultural',    label: 'Cultural',     icon: '🎭', color: '#C4B5FD' },
] as const;

// ── EVENT STATUS ──────────────────────────────
export const EVENT_STATUS = {
  DRAFT:     'draft',
  PUBLISHED: 'published',
  OPEN:      'open',
  ONGOING:   'ongoing',
  CLOSED:    'closed',
} as const;

// ── USER ROLES ────────────────────────────────
export const USER_ROLES = {
  VOLUNTEER:   'volunteer',
  ORGANISER:   'organiser',
  ADMIN:       'admin',
} as const;

export const ORGANISER_SUB_ROLES = {
  EO_ADMIN:       'eo_admin',
  EVENT_ADMIN:    'event_admin',
  SECTOR_ADMIN:   'sector_admin',
  GROUP_MANAGER:  'group_manager',
} as const;

// ── SKILLS ────────────────────────────────────
export const VOLUNTEER_SKILLS = [
  'Driving',
  'First Aid',
  'Photography',
  'Cooking',
  'Teaching',
  'Carpentry',
  'Event Management',
  'Translation',
  'Social Media',
  'Public Speaking',
  'Medical',
  'Legal',
  'IT / Tech Support',
  'Music / Performance',
  'Sports Coaching',
  'Counselling',
  'Sign Language',
  'Graphic Design',
] as const;

// ── CAUSES ────────────────────────────────────
export const CAUSES = [
  { id: 'environment',      label: 'Environment',      icon: '🌿' },
  { id: 'education',        label: 'Education',        icon: '📚' },
  { id: 'health',           label: 'Health',           icon: '❤️' },
  { id: 'sports',           label: 'Sports',           icon: '⚽' },
  { id: 'cultural',         label: 'Cultural',         icon: '🎭' },
  { id: 'women',            label: 'Women Empowerment',icon: '♀️' },
  { id: 'children',         label: 'Child Welfare',    icon: '👶' },
] as const;

// ── LANGUAGES ─────────────────────────────────
export const LANGUAGES = [
  'Gujarati', 'Hindi', 'English', 'Marathi',
  'Rajasthani', 'Punjabi', 'Tamil', 'Telugu',
  'Kannada', 'Malayalam', 'Bengali', 'Odia',
] as const;

// ── INDIAN CITIES (48 covered) ────────────────
export const CITIES = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
  'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Mehsana',
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
  'Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad',
  'Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi',
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
  'Hyderabad', 'Warangal', 'Visakhapatnam', 'Vijayawada',
  'Kolkata', 'Howrah', 'Durgapur', 'Asansol',
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
  'Lucknow', 'Kanpur', 'Agra', 'Varanasi',
  'Bhopal', 'Indore',
] as const;

// ── PLATFORM STATS ─────────────────────────────
export const PLATFORM_STATS = [
  { label: 'Volunteers',     value: 12000,  suffix: '+',  display: '12K+' },
  { label: 'Events Hosted',  value: 320,    suffix: '+',  display: '320+' },
  { label: 'Cities Covered', value: 48,     suffix: '',   display: '48'   },
  { label: 'Hours Logged',   value: 500000, suffix: '+',  display: '5L+'  },
] as const;

// ── PARTNER LOGOS (placeholder names) ─────────
export const PARTNER_LOGOS = [
  { name: 'Ministry of Environment (MoEF)', short: 'MoEF' },
  { name: 'NITI Aayog',                     short: 'NITI Aayog' },
  { name: 'CSR India',                      short: 'CSR India' },
  { name: 'National Youth Corps (NYK)',      short: 'NYK' },
  { name: 'MSJE',                           short: 'MSJE' },
] as const;

// ── ASSIGNMENT TYPES ──────────────────────────
export const ASSIGNMENT_TYPES = {
  REGISTRATION: 'registration',
  ALLOCATION:   'allocation',
} as const;

// ── ALLOCATION STATUS ─────────────────────────
export const ALLOCATION_STATUS = {
  ALLOCATED:  'allocated',
  ACTIVATED:  'activated',
  CONFIRMED:  'confirmed',
  COMPLETED:  'completed',
} as const;

// ── COMMUNICATION CHANNELS ────────────────────
export const COMM_CHANNELS = {
  EMAIL: 'email',
  SMS:   'sms',
} as const;

// ── SUMMIT 2026 ───────────────────────────────
export const SUMMIT_DATE = new Date('2026-04-12T00:00:00+05:30');
export const SUMMIT_VENUE = 'Gandhinagar, Gujarat';
export const SUMMIT_DAYS = ['12th April 2026', '13th April 2026'] as const;

// ── ROUTES ────────────────────────────────────
export const ROUTES = {
  // Public
  HOME:           '/',
  FOR_VOLUNTEERS: '/for-volunteers',
  FOR_ORGANISERS: '/for-organisers',
  EVENTS:         '/events',
  EVENT_DETAIL:   '/events/:id',
  SUMMIT:         '/summit-2026',
  GALLERY:        '/gallery',
  PARTNERS:       '/partners',
  ABOUT:          '/about',
  CONTACT:        '/contact',
  NEWS:           '/news',
  NEWS_ARTICLE:   '/news/:slug',
  NEWSLETTER:     '/newsletter',
  NOT_FOUND:      '*',

  // Auth
  LOGIN:    '/login',
  REGISTER: '/register',

  // Volunteer portal
  DASHBOARD:    '/dashboard',
  ASSIGNMENTS:  '/dashboard/assignments',
  CERTIFICATES: '/dashboard/certificates',
  PROFILE:      '/profile',
  GROUPS:       '/dashboard/groups',

  // Organiser portal
  ORG_DASHBOARD:   '/organiser/dashboard',
  CREATE_EVENT:    '/organiser/events/create',
  EDIT_EVENT:      '/organiser/events/:id/edit',
  SECTORS:         '/organiser/events/:id/sectors',
  REGISTRATIONS:   '/organiser/events/:id/registrations',
  ALLOCATIONS:     '/organiser/events/:id/allocations',
  MESSAGES:        '/organiser/events/:id/messages',
  CLOSE_EVENT:     '/organiser/events/:id/close',
  EVENT_GROUPS:    '/organiser/events/:id/groups',

  // Admin
  ADMIN: '/admin',
} as const;

// ── CONTACT INFO ──────────────────────────────
export const CONTACT = {
  address:  'Pruthwee Community Centre, Lavad, Dahegam, Gandhinagar — 382305, Gujarat',
  phone:    '+91-9142982258',
  email:    'volunteer@pruthwee.org',
  website:  'https://pruthwee.org',
  maps:     'https://maps.google.com/?q=Lavad,Dahegam,Gujarat',
} as const;

export const SOCIAL_LINKS = {
  instagram:  'https://instagram.com/pruthweevolunteers',
  linkedin:   'https://linkedin.com/company/pruthwee',
  whatsapp:   'https://wa.me/919142982258',
  youtube:    'https://youtube.com/@pruthwee',
} as const;

// ── AVAILABILITY TYPES ────────────────────────
export const AVAILABILITY_TYPES = [
  { id: 'full',       label: 'Full Duration',    desc: 'Available for the entire event' },
  { id: 'days',       label: 'Individual Days',  desc: 'Select specific days' },
  { id: 'shifts',     label: 'Shift-based',      desc: 'Select specific time slots' },
] as const;

// ── ORGANISER TYPES ───────────────────────────
export const ORGANISER_TYPES = [
  { id: 'ngo',       label: 'NGO / Non-Profit' },
  { id: 'corporate', label: 'Corporate CSR' },
  { id: 'govt',      label: 'Government Body' },
  { id: 'education', label: 'Educational Institution' },
  { id: 'other',     label: 'Other' },
] as const;

// ── TSHIRT SIZES ──────────────────────────────
export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

// ── PAGINATION ────────────────────────────────
export const EVENTS_PER_PAGE = 12;
export const NEWS_PER_PAGE   = 9;

// ── API ───────────────────────────────────────
export const API_TIMEOUT = 10000; // 10s
