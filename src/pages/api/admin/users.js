import { supabase } from '@/utils/auth';
import { verifyToken } from '@/utils/jsonwebtoken';

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(500).json({ message: 'Error fetching users' });
    }

    res.status(200).json({ users });
  });
}
