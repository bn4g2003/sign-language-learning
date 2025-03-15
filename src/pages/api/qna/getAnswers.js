// pages/api/qna/getAnswers.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { askId } = req.query;

    const { data: answers, error } = await supabase
      .from('answers')
      .select('*')
      .eq('ask_id', askId);

    if (error) {
      console.error('Error fetching answers:', error);
      return res.status(500).json({ error: 'Error fetching answers', details: error.message });
    }

    res.status(200).json(answers);
  }
}
