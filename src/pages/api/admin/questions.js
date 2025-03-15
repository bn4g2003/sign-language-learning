// pages/api/admin/questions.js
import { supabase } from '@/utils/auth';
import { verifyToken } from '@/utils/jsonwebtoken';

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    try {
      switch (req.method) {
        case 'GET':
          const { data: questions, error: getError } = await supabase
            .from('questions')
            .select('*');
          if (getError) {
            console.error('Error fetching questions:', getError);
            return res.status(500).json({ message: 'Error fetching questions' });
          }
          return res.status(200).json({ questions });

        case 'POST':
          const { quiz_id, question_text, image_url, choice_a, choice_b, choice_c, choice_d, correct_choice } = req.body;
          console.log('POST body:', req.body);
          const { data: newQuestion, error: postError } = await supabase
            .from('questions')
            .insert([{ quiz_id, question_text, image_url, choice_a, choice_b, choice_c, choice_d, correct_choice }])
            .single();
          if (postError) {
            console.error('Error adding question:', postError);
            return res.status(500).json({ message: 'Error adding question' });
          }
          return res.status(200).json({ newQuestion });

        case 'DELETE':
          const { questionId } = req.query;
          console.log('DELETE query:', req.query);
          const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);
          if (deleteError) {
            console.error('Error deleting question:', deleteError);
            return res.status(500).json({ message: 'Error deleting question' });
          }
          return res.status(200).json({ message: 'Question deleted successfully' });

        default:
          res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (err) {
      console.error('Server error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
}
