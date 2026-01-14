-- Supabase Database Schema for SEO Succor Proposal System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Items (Dev Work)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  url TEXT,
  category TEXT, -- e.g., 'ecommerce', 'corporate', 'healthcare'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services (Pricing Plans, Lease Plans, Maintenance, Add-ons)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pricing', 'lease', 'maintenance', 'addon')),
  base_price TEXT NOT NULL, -- Store as string like "$3,000" or "$199/mo"
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  category TEXT, -- For grouping (e.g., 'seo', 'web-dev', 'paid-search')
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb, -- Flexible storage for plan-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  client_name TEXT NOT NULL,
  industry TEXT,
  core_problem TEXT,
  generated_summary TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'archived')),
  selected_services JSONB DEFAULT '{}'::jsonb, -- Stores cart state
  customizations JSONB DEFAULT '{}'::jsonb, -- Any custom content overrides
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
);

-- Proposal Submissions (track when clients accept)
CREATE TABLE IF NOT EXISTS proposal_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_active ON portfolio_items(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(type, is_active);
CREATE INDEX IF NOT EXISTS idx_proposals_slug ON proposals(slug);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_proposal_id ON proposal_submissions(proposal_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for testimonials, portfolio, and services
CREATE POLICY "Public can read active testimonials" ON testimonials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active portfolio items" ON portfolio_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active services" ON services
    FOR SELECT USING (is_active = true);

-- Public can read proposals by slug (no auth required)
CREATE POLICY "Public can read proposals" ON proposals
    FOR SELECT USING (true);

-- Public can insert proposal submissions
CREATE POLICY "Public can insert proposal submissions" ON proposal_submissions
    FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage portfolio items" ON portfolio_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage proposals" ON proposals
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read proposal submissions" ON proposal_submissions
    FOR SELECT USING (auth.role() = 'authenticated');
