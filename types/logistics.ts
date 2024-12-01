export interface LogisticsCompany {
  id: string;
  name: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface LogisticsContact {
  id: string;
  company_id: string;
  name: string;
  role?: string;
  email: string;
  phone?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface LogisticsAccess {
  id: string;
  company_id: string;
  contact_id: string;
  user_id: string;
  access_level: 'read' | 'write' | 'admin';
  created_at: string;
  expires_at?: string;
  created_by: string;
}
