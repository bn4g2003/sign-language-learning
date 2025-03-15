// pages/api/questions.js
import { supabase } from '@/utils/auth';


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { quizId } = req.query;
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId);

    if (error) {
      return res.status(500).json({ error: 'Error fetching questions' });
    }

    res.status(200).json(questions);
  }
}
