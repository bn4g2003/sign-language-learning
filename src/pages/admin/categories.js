// pages/admin/categories.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { checkAdmin } from '@/utils/checkAdmin';
import styles from '@/styles/admin/Categories.module.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        router.push('/'); 
      } else {
        setIsAdmin(true);
        fetchCategories();
      }
    };

    verifyAdmin();
  }, [router]);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    setCategories(data.categories);
  };

  const addCategory = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCategory),
      });
      const data = await res.json();
      if (res.ok) {
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      } else {
        console.error('Error adding category:', data.message);
      }
    } catch (error) {
      console.error('Add category error:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`/api/admin/categories?categoryId=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        fetchCategories();
      } else {
        console.error('Error deleting category:', data.message);
      }
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  return (
    <div className={styles.categoriesContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Quản lý Loại Bài Học</h1>
        {isAdmin ? (
          <>
            <div className={styles.categoriesTableContainer}>
              <table className={styles.categoriesTable}>
                <thead>
                  <tr>
                    <th>Tên Loại</th>
                    <th>Mô Tả</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className={styles.deleteButton}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.addCategoryForm}>
              <h2 className={styles.sectionTitle}>Thêm Loại Bài Học Mới</h2>
              <input
                type="text"
                placeholder="Tên loại bài học"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className={styles.inputField}
              />
              <textarea
                placeholder="Mô tả"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className={styles.textareaField}
              />
              <button onClick={addCategory} className={styles.addButton}>
                Thêm
              </button>
            </div>
          </>
        ) : (
          <p className={styles.loadingText}>Đang kiểm tra quyền truy cập...</p>
        )}
      </div>
    </div>
  );
};

export default Categories;