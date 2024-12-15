type AlertPreference = 'ALL' | 'CRITICAL_ONLY';

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  alertPreference: AlertPreference;
}

export const staffData: StaffMember[] = [
  {
    id: 1,
    name: "Smiljan Rakovic",
    role: "Head of Supply Chain and Logistics",
    department: "Logistics",
    phone: "+41 76 434 41 39",
    email: "smiljan@thesunrisecorp.com",
    alertPreference: 'ALL'  // Gets all alerts
  },
  {
    id: 2,
    name: "Justin Ambar",
    role: "Head of Cultivation",
    department: "Cultivation",
    phone: "+1 (613) 263-9598",
    email: "justin@thesunrisecorp.com",
    alertPreference: 'ALL'  // Gets all alerts
  },
  {
    id: 3,
    name: "Marc Eversfield",
    role: "Director",
    department: "Management",
    phone: "+49 177 6517671",
    email: "marc@thesunrisecorp.com",
    alertPreference: 'CRITICAL_ONLY'  // Only gets critical alerts
  },
  {
    id: 4,
    name: "Steve Shiffman",
    role: "CEO",
    department: "Management",
    phone: "+1 (514) 582-4541",
    email: "steve@thesunrisecorp.com",
    alertPreference: 'CRITICAL_ONLY'  // Only gets critical alerts
  }
];
