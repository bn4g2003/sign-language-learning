// pages/api/qna/getAsk.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { lessonId } = req.query;

    const { data: asks, error } = await supabase
      .from('ask')
      .select('*')
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('Error fetching asks:', error);
      return res.status(500).json({ error: 'Error fetching asks', details: error.message });
    }

    res.status(200).json(asks);
  }
}
