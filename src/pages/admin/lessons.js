// pages/admin/lessons.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { checkAdmin } from '@/utils/checkAdmin';
import styles from '@/styles/admin/Lessons.module.css';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', media_url: '', type: 'text', category_id: '', user_id: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        router.push('/'); // Redirect to home page if not admin
      } else {
        setIsAdmin(true);
        fetchLessons();
      }
    };

    verifyAdmin();
  }, [router]);

  const fetchLessons = async () => {
    const res = await fetch('/api/admin/lessons', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    setLessons(data.lessons);
  };

  const addLesson = async () => {
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newLesson),
      });
      const data = await res.json();
      if (res.ok) {
        setNewLesson({ title: '', content: '', media_url: '', type: 'text', category_id: '', user_id: '' });
        fetchLessons();
      } else {
        console.error('Error adding lesson:', data.message);
      }
    } catch (error) {
      console.error('Add lesson error:', error);
    }
  };

  const deleteLesson = async (id) => {
    try {
      const res = await fetch(`/api/admin/lessons?lessonId=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        fetchLessons();
      } else {
        console.error('Error deleting lesson:', data.message);
      }
    } catch (error) {
      console.error('Delete lesson error:', error);
    }
  };

  return (
    <div className={styles.lessonsContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Quản lý Bài Học</h1>
        {isAdmin ? (
          <>
            <div className={styles.lessonsTableContainer}>
              <table className={styles.lessonsTable}>
                <thead>
                  <tr>
                    <th>Tên Bài Học</th>
                    <th>Nội Dung</th>
                    <th>URL Phương Tiện</th>
                    <th>Loại</th>
                    <th>Mã Loại</th>
                    <th>Mã Người Dùng</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map(lesson => (
                    <tr key={lesson.id}>
                      <td>{lesson.title}</td>
                      <td>{lesson.content}</td>
                      <td>{lesson.media_url}</td>
                      <td>{lesson.type}</td>
                      <td>{lesson.category_id}</td>
                      <td>{lesson.user_id}</td>
                      <td>
                        <button
                          onClick={() => deleteLesson(lesson.id)}
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
            <div className={styles.addLessonForm}>
              <h2 className={styles.sectionTitle}>Thêm Bài Học Mới</h2>
              <input
                type="text"
                placeholder="Tên bài học"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                className={styles.inputField}
              />
              <textarea
                placeholder="Nội dung"
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                className={styles.textareaField}
              />
              <input
                type="text"
                placeholder="URL phương tiện"
                value={newLesson.media_url}
                onChange={(e) => setNewLesson({ ...newLesson, media_url: e.target.value })}
                className={styles.inputField}
              />
              <select
                value={newLesson.type}
                onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                className={styles.selectField}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <input
                type="text"
                placeholder="Mã loại bài học"
                value={newLesson.category_id}
                onChange={(e) => setNewLesson({ ...newLesson, category_id: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Mã người dùng"
                value={newLesson.user_id}
                onChange={(e) => setNewLesson({ ...newLesson, user_id: e.target.value })}
                className={styles.inputField}
              />
              <button onClick={addLesson} className={styles.addButton}>
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

export default Lessons;