const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://syhaehnetprrmosoaorr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aGFlaG5ldHBycm1vc29hb3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTk4MDEsImV4cCI6MjA4Mjk5NTgwMX0.KWWcSnYbISikVpIh_D8bnGMgFLTdq2_8OXdvwDr0ZfE';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
