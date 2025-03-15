// pages/api/updateProgress.js
import { supabase } from '@/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, lessonId, quizId, lessonCompleted, quizCompleted, quizScore } = req.body;

    console.log('Updating progress:', { userId, lessonId, quizId, lessonCompleted, quizCompleted, quizScore });

    const { data, error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        quiz_id: quizId,
        lesson_completed: lessonCompleted,
        quiz_completed: quizCompleted,
        quiz_score: quizScore
      });

    if (error) {
      console.error('Error updating progress:', error);
      return res.status(500).json({ error: 'Error updating progress', details: error.message });
    }

    res.status(200).json(data);
  }
}
