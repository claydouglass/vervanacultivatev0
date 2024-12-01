export type PartnerType = 'LOGISTICS' | 'IMPORTER' | 'CUSTOMS' | 'REFINER' | 'DISTRIBUTOR' | 'RETAILER';

export interface BusinessPartner {
  id: string;
  name: string;
  type: PartnerType[];
  website?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerContact {
  id: string;
  partner_id: string;
  name: string;
  role?: string;
  email: string;
  phone?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface BatchInteraction {
  id: string;
  partner_id: string;
  batch_id: string;
  interaction_type: PartnerType;
  start_date: string;
  end_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  throughput_quantity?: number;
  throughput_unit?: string;
  performance_rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
