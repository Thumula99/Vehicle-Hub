const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    console.log('⚡ Connected to Supabase Cloud Database');
  } catch (err) {
    console.warn('⚠️ Supabase client initialization failed, falling back to local JSON persistence:', err.message);
  }
} else {
  console.log('ℹ️ Supabase environment variables not set. Operating in local JSON storage mode.');
}

module.exports = {
  supabase,
  isSupabaseConfigured
};
