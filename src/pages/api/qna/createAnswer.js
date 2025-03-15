// pages/api/qna/createAnswer.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, askId, content } = req.body;

    const { data, error } = await supabase
      .from('answers')
      .insert({
        user_id: userId,
        ask_id: askId,
        content: content
      });

    if (error) {
      console.error('Error creating answer:', error);
      return res.status(500).json({ error: 'Error creating answer', details: error.message });
    }

    res.status(200).json(data);
  }
}
