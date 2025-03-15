import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);


export const getUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data?.session?.user || null;
};

export async function getAdmin() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  if (session) {
    // Sử dụng email để kiểm tra vai trò từ bảng `users`
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();
    if (fetchError) {
      console.error('Error getting user:', fetchError);
      return null;
    }
    if (user && user.role === 'admin') {
      return user;
    }
  }
  return null;
}



export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { user: null, error };
  }
  const user = data.user;
  if (user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email: user.email, username: user.email.split('@')[0] }]);
    if (insertError) {
      console.error('Error inserting user into users table:', insertError);
    }
  }
  return { user, error: null };
};

export const requireAuth = async (router) => {
  const user = await getUser();
  if (!user) {
    router.push('/login');
  }
  return user;
};

// lesson
export default async function handler(req, res) {
  const user = await getUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return res.status(500).json({ error: 'Error fetching lessons' });
  }

  return res.status(200).json(lessons);
}