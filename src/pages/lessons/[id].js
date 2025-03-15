// pages/lessons/[id].js
import Navbar from '@/components/Navbar';
import { supabase, getUser } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@/styles/CategoryDetail.module.css';

export default function CategoryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        await fetchLessons(id);
        await fetchCompletedLessons(currentUser.id);
      }
    };
    checkAuth();
  }, [id]);

  const fetchLessons = async (categoryId) => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('category_id', categoryId);
    if (error) {
      console.error('Error fetching lessons:', error);
    } else {
      setLessons(data);
    }
  };

  const fetchCompletedLessons = async (userId) => {
    const { data, error } = await supabase
      .from('progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('lesson_completed', true);
    if (error) {
      console.error('Error fetching completed lessons:', error);
    } else {
      setCompletedLessons(data.map(d => d.lesson_id));
    }
  };

  const handleLessonClick = (lessonId) => {
    setCompletedLessons((prev) => [...prev, lessonId]);
    router.push(`/lessons/lesson/${lessonId}`);
  };

  return (
    <div className={styles.categoryContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Category Detail</h1>
      <button className={styles.backButton} onClick={() => router.push('/lessons')}>
        Back to Categories
      </button>
      {lessons.length === 0 ? (
        <p className={styles.noLessons}>No lessons found for this category.</p>
      ) : (
        <div className={styles.lessonList}>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id)}
              className={`${styles.lessonItem} ${completedLessons.includes(lesson.id) ? styles.completed : ''}`}
            >
              <h3 className={styles.lessonTitle}>{lesson.title}</h3>
              <p className={styles.lessonContent}>{lesson.content}</p>
              {completedLessons.includes(lesson.id) && (
                <p className={styles.completedText}>(Completed)</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}