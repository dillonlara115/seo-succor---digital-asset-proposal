
export interface ProposalData {
  clientName: string;
  industry: string;
  coreProblem: string;
  generatedSummary?: string;
}

export interface Phase {
  title: string;
  items: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: string;
  type: 'pricing' | 'lease' | 'maintenance' | 'addon';
  recurring?: boolean;
  recurringPeriod?: 'monthly' | 'yearly';
}

export interface Cart {
  pricingPlan: CartItem | null;
  leasePlan: CartItem | null;
  maintenancePlan: CartItem | null;
  addons: CartItem[];
}

// Admin/Database Types
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  url?: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'pricing' | 'lease' | 'maintenance' | 'addon';
  base_price: string;
  description?: string;
  features: string[];
  category?: string;
  display_order: number;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  slug: string;
  client_name: string;
  industry?: string;
  core_problem?: string;
  generated_summary?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'archived';
  selected_services: {
    pricingPlan: CartItem | null;
    leasePlan: CartItem | null;
    maintenancePlan: CartItem | null;
    addons: CartItem[];
  };
  customizations: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  accepted_at?: string;
}

export interface ProposalSubmission {
  id: string;
  proposal_id: string;
  contact_name: string;
  email: string;
  phone?: string;
  notes?: string;
  submitted_at: string;
}
