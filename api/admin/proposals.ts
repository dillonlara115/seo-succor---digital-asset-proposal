import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabase-admin';

async function verifyAuth(req: VercelRequest): Promise<{ user: any } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) return null;
  return { user };
}

function generateSlug(clientName: string): string {
  return clientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const auth = await verifyAuth(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const { id, slug } = req.query;
      
      if (id) {
        const { data, error } = await supabaseAdmin
          .from('proposals')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return res.status(200).json(data);
      }

      if (slug) {
        const { data, error } = await supabaseAdmin
          .from('proposals')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        return res.status(200).json(data);
      }

      // List all proposals
      const { data, error } = await supabaseAdmin
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { client_name, slug, ...rest } = req.body;
      
      // Generate slug if not provided
      let finalSlug = slug || generateSlug(client_name);
      
      // Ensure slug is unique
      let counter = 1;
      let originalSlug = finalSlug;
      while (true) {
        const { data: existing } = await supabaseAdmin
          .from('proposals')
          .select('id')
          .eq('slug', finalSlug)
          .single();
        
        if (!existing) break;
        finalSlug = `${originalSlug}-${counter}`;
        counter++;
      }

      const proposalData = {
        ...rest,
        client_name,
        slug: finalSlug,
        created_by: auth.user.id,
      };

      const { data, error } = await supabaseAdmin
        .from('proposals')
        .insert(proposalData)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID required' });
      }

      const { data, error } = await supabaseAdmin
        .from('proposals')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID required' });
      }

      const { error } = await supabaseAdmin
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
