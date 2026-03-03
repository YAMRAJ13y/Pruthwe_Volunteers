// ═══════════════════════════════════════════════
//  PRUTHWEE PLATFORM TYPES
// ═══════════════════════════════════════════════

export type EventCategory = 'environment' | 'education' | 'health' | 'sports' | 'cultural';

export type UserRole = 'volunteer' | 'organiser' | 'admin';

export interface AuthUser {
  id:          string;
  email:       string;
  role:        UserRole;
  created_at?: string;
}

export interface VolunteerProfile {
  userId:       string;
  // Name
  fullName?:    string;    // "Arjun Patel" — used by VolunteerLayout, EventRegistrationModal
  firstName?:   string;
  lastName?:    string;
  // Contact
  phone?:       string;
  city?:        string;
  // Volunteer stats (populated after login / from DB)
  total_hours?: number;
  status_tier?: string;    // matches STATUS_TIERS[n].id e.g. 'silver'
  mq_score?:   number;
  events_attended?: number;
  certificates_count?: number;
  // Preferences
  skills?:      string[];
  causes?:      string[];
  availability?: string;
  languages?:   string[];
  // Profile extras
  bio?:         string;
  dob?:         string;
  gender?:      string;
  tshirt?:      string;
  medical?:     string;
  firstEvent?:  string;
  notifications?: {
    email:  boolean;
    sms:    boolean;
    push:   boolean;
  };
  visibility?: {
    profile: boolean;
    hours:   boolean;
    city:    boolean;
  };
  org_name?:   string;     // for organiser accounts
}