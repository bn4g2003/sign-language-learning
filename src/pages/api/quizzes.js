// pages/api/quizzes.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*');

    if (error) {
      return res.status(500).json({ error: 'Error fetching quizzes' });
    }

    res.status(200).json(quizzes);
  }
}
