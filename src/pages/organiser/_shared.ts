export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  city: string;
  organiser: string;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  city: string;
  status: RegistrationStatus;
  mqScore: number;
  tier: string;
  tierColor: string;
}

export interface Assignment {
  id: string;
  time: string;
  need: number;
  allocated: number;
}

export interface SectorTask {
  id: string;
  name: string;
  assignments: Assignment[];
}

export interface Sector {
  id: string;
  name: string;
  location: string;
  tasks: SectorTask[];
}

export const REG_STATUS_META: Record<RegistrationStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'Pending',
    color: '#FCD34D',
    bg: 'rgba(252,211,77,0.1)',
    border: 'rgba(252,211,77,0.3)',
  },
  approved: {
    label: 'Approved',
    color: '#6EE07A',
    bg: 'rgba(110,224,122,0.1)',
    border: 'rgba(110,224,122,0.3)',
  },
  rejected: {
    label: 'Rejected',
    color: '#FCA5A5',
    bg: 'rgba(252,165,165,0.1)',
    border: 'rgba(252,165,165,0.3)',
  },
};

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Sabarmati River Clean-Up 2026',
    date: 'Mar 15, 2026',
    city: 'Ahmedabad',
    organiser: 'Paryavaran Trust',
  },
  {
    id: 'e2',
    title: 'Tree Plantation Drive – Gandhinagar',
    date: 'Mar 22, 2026',
    city: 'Gandhinagar',
    organiser: 'Green India Foundation',
  },
  {
    id: 'e3',
    title: 'Pruthwee Summit 2026 Volunteer Crew',
    date: 'Apr 12–13, 2026',
    city: 'Gandhinagar',
    organiser: 'Pruthwe volunteers',
  },
];

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'r1',
    name: 'Arjun Patel',
    email: 'arjun.patel@gmail.com',
    city: 'Ahmedabad',
    status: 'approved',
    mqScore: 94,
    tier: 'Gold',
    tierColor: '#FFD700',
  },
  {
    id: 'r2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    city: 'Ahmedabad',
    status: 'approved',
    mqScore: 91,
    tier: 'Gold',
    tierColor: '#FFD700',
  },
  {
    id: 'r3',
    name: 'Mihir Joshi',
    email: 'mihir.joshi@gmail.com',
    city: 'Surat',
    status: 'approved',
    mqScore: 97,
    tier: 'Platinum',
    tierColor: '#E5E4E2',
  },
  {
    id: 'r4',
    name: 'Tanvi Patel',
    email: 'tanvi.patel@gmail.com',
    city: 'Surat',
    status: 'approved',
    mqScore: 65,
    tier: 'Bronze',
    tierColor: '#CD7F32',
  },
  {
    id: 'r5',
    name: 'Nita Shah',
    email: 'nita.shah@gmail.com',
    city: 'Vadodara',
    status: 'pending',
    mqScore: 81,
    tier: 'Silver',
    tierColor: '#C0C0C0',
  },
  {
    id: 'r6',
    name: 'Rohan Shah',
    email: 'rohan.shah@gmail.com',
    city: 'Vadodara',
    status: 'pending',
    mqScore: 61,
    tier: 'Volunteer',
    tierColor: '#6EE07A',
  },
  {
    id: 'r7',
    name: 'Karan Bhatt',
    email: 'karan.bhatt@gmail.com',
    city: 'Rajkot',
    status: 'approved',
    mqScore: 89,
    tier: 'Gold',
    tierColor: '#FFD700',
  },
  {
    id: 'r8',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@gmail.com',
    city: 'Ahmedabad',
    status: 'approved',
    mqScore: 84,
    tier: 'Silver',
    tierColor: '#C0C0C0',
  },
  {
    id: 'r9',
    name: 'Dev Mehta',
    email: 'dev.mehta@gmail.com',
    city: 'Ahmedabad',
    status: 'approved',
    mqScore: 77,
    tier: 'Silver',
    tierColor: '#C0C0C0',
  },
  {
    id: 'r10',
    name: 'Sonal Desai',
    email: 'sonal.desai@gmail.com',
    city: 'Gandhinagar',
    status: 'approved',
    mqScore: 73,
    tier: 'Bronze',
    tierColor: '#CD7F32',
  },
];

export const MOCK_SECTORS: Sector[] = [
  {
    id: 's1',
    name: 'River Collection',
    location: 'Riverfront West',
    tasks: [
      {
        id: 't1',
        name: 'Waste Collection Team A',
        assignments: [
          { id: 'a1', time: '07:00 – 09:00', need: 3, allocated: 0 },
          { id: 'a2', time: '09:00 – 11:00', need: 3, allocated: 0 },
        ],
      },
      {
        id: 't2',
        name: 'Waste Collection Team B',
        assignments: [{ id: 'a3', time: '07:00 – 11:00', need: 2, allocated: 0 }],
      },
    ],
  },
  {
    id: 's2',
    name: 'Logistics',
    location: 'Assembly Zone',
    tasks: [
      {
        id: 't3',
        name: 'Material Distribution',
        assignments: [{ id: 'a4', time: '06:30 – 08:30', need: 2, allocated: 0 }],
      },
      {
        id: 't4',
        name: 'Transport Coordination',
        assignments: [{ id: 'a5', time: '08:00 – 12:00', need: 2, allocated: 0 }],
      },
    ],
  },
  {
    id: 's3',
    name: 'Medical Support',
    location: 'First Aid Desk',
    tasks: [
      {
        id: 't5',
        name: 'First Aid Response',
        assignments: [{ id: 'a6', time: '07:00 – 12:00', need: 2, allocated: 0 }],
      },
    ],
  },
  {
    id: 's4',
    name: 'Media & Photography',
    location: 'Event Media Point',
    tasks: [
      {
        id: 't6',
        name: 'Photo Coverage',
        assignments: [{ id: 'a7', time: '07:00 – 12:00', need: 1, allocated: 0 }],
      },
    ],
  },
];
