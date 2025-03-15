// pages/api/getProgress.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    console.log('Fetching progress for user:', userId);

    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('lesson_id, quiz_id, lesson_completed, quiz_score, created_at')
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return res.status(500).json({ error: 'Error fetching progress', details: progressError.message });
    }

    const { data: totalLessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, category_id, title');

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return res.status(500).json({ error: 'Error fetching lessons', details: lessonsError.message });
    }

    res.status(200).json({ progress, totalLessons });
  }
}
