// pages/api/admin/categories.js
import { supabase } from '@/utils/auth';
import { verifyToken } from '@/utils/jsonwebtoken';

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    try {
      switch (req.method) {
        case 'GET':
          const { data: categories, error: getError } = await supabase
            .from('categories')
            .select('*');
          if (getError) {
            console.error('Error fetching categories:', getError);
            return res.status(500).json({ message: 'Error fetching categories' });
          }
          return res.status(200).json({ categories });

        case 'POST':
          const { name, description } = req.body;
          console.log('POST body:', req.body);
          const { data: newCategory, error: postError } = await supabase
            .from('categories')
            .insert([{ name, description, total_lessons: 0 }])
            .single();
          if (postError) {
            console.error('Error adding category:', postError);
            return res.status(500).json({ message: 'Error adding category' });
          }
          return res.status(200).json({ newCategory });

        case 'PUT':
          const { id, updatedName, updatedDescription } = req.body;
          console.log('PUT body:', req.body);
          const { data: updatedCategory, error: putError } = await supabase
            .from('categories')
            .update({ name: updatedName, description: updatedDescription })
            .eq('id', id)
            .single();
          if (putError) {
            console.error('Error updating category:', putError);
            return res.status(500).json({ message: 'Error updating category' });
          }
          if (!updatedCategory) {
            console.error('No rows updated for category:', id);
            return res.status(404).json({ message: 'Category not found' });
          }
          return res.status(200).json({ updatedCategory });

        case 'DELETE':
          const { categoryId } = req.query;
          console.log('DELETE query:', req.query);
          const { error: deleteError } = await supabase
            .from('categories')
            .delete()
            .eq('id', categoryId);
          if (deleteError) {
            console.error('Error deleting category:', deleteError);
            return res.status(500).json({ message: 'Error deleting category' });
          }
          return res.status(200).json({ message: 'Category deleted successfully' });

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




