// pages/api/qna/createAsk.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, lessonId, content } = req.body;

    const { data, error } = await supabase
      .from('ask')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        content: content
      });

    if (error) {
      console.error('Error creating ask:', error);
      return res.status(500).json({ error: 'Error creating ask', details: error.message });
    }

    res.status(200).json(data);
  }
}
