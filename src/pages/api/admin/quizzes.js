// pages/api/admin/quizzes.js
import { supabase } from '@/utils/auth';
import { verifyToken } from '@/utils/jsonwebtoken';

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    try {
      if (req.method === 'GET') {
        const { data: quizzes, error } = await supabase
          .from('quizzes')
          .select('*');
        if (error) {
          console.error('Error fetching quizzes:', error);
          return res.status(500).json({ message: 'Error fetching quizzes' });
        }
        return res.status(200).json({ quizzes });
      } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (err) {
      console.error('Server error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
}
