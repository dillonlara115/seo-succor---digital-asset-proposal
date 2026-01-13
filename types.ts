
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
