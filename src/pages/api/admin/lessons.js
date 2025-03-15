// pages/api/admin/lessons.js
import { supabase } from '@/utils/auth';
import { verifyToken } from '@/utils/jsonwebtoken';


export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    try {
      switch (req.method) {
        case 'GET':
          const { data: lessons, error: getError } = await supabase
            .from('lessons')
            .select('*');
          if (getError) {
            console.error('Error fetching lessons:', getError);
            return res.status(500).json({ message: 'Error fetching lessons' });
          }
          return res.status(200).json({ lessons });

        case 'POST':
          const { title, content, media_url, type, category_id, user_id } = req.body;
          console.log('POST body:', req.body);
          const { data: newLesson, error: postError } = await supabase
            .from('lessons')
            .insert([{ title, content, media_url, type, category_id, user_id }])
            .single();
          if (postError) {
            console.error('Error adding lesson:', postError);
            return res.status(500).json({ message: 'Error adding lesson' });
          }
          return res.status(200).json({ newLesson });

        case 'PUT':
          const { id, updatedTitle, updatedContent, updatedMediaUrl, updatedType, updatedCategoryId, updatedUserId } = req.body;
          console.log('PUT body:', req.body);
          const { data: updatedLesson, error: putError } = await supabase
            .from('lessons')
            .update({ title: updatedTitle, content: updatedContent, media_url: updatedMediaUrl, type: updatedType, category_id: updatedCategoryId, user_id: updatedUserId })
            .eq('id', id)
            .single();
          if (putError) {
            console.error('Error updating lesson:', putError);
            return res.status(500).json({ message: 'Error updating lesson' });
          }
          if (!updatedLesson) {
            console.error('No rows updated for lesson:', id);
            return res.status(404).json({ message: 'Lesson not found' });
          }
          return res.status(200).json({ updatedLesson });

        case 'DELETE':
          const { lessonId } = req.query;
          console.log('DELETE query:', req.query);
          const { error: deleteError } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);
          if (deleteError) {
            console.error('Error deleting lesson:', deleteError);
            return res.status(500).json({ message: 'Error deleting lesson' });
          }
          return res.status(200).json({ message: 'Lesson deleted successfully' });

        default:
          res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (err) {
      console.error('Server error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
}

