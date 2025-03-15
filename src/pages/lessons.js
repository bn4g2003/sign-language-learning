// pages/lessons.js
import Navbar from '@/components/Navbar';
import LessonCard from '@/components/LessonCard';
import { supabase, requireAuth } from '@/utils/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Lessons.module.css';

export default function Lessons() {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState([]);
  const [totalLessons, setTotalLessons] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await requireAuth(router);
      if (user) {
        fetchCategories();
        fetchUserProgress(user.id); // Lấy tiến trình học
      }
    };
    checkAuth();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data);
    }
  };

  const fetchUserProgress = async (userId) => {
    const res = await fetch(`/api/getProgress?userId=${userId}`);
    const { progress, totalLessons } = await res.json();
    setProgress(Array.isArray(progress) ? progress : []);
    setTotalLessons(Array.isArray(totalLessons) ? totalLessons : []);
  };

  const calculateLearningPercentage = (categoryId) => {
    const lessonsInCategory = totalLessons.filter(lesson => lesson.category_id === categoryId);
    const completedLessonIds = new Set(
      progress
        .filter(p => p.lesson_completed && lessonsInCategory.some(lesson => lesson.id === p.lesson_id))
        .map(p => p.lesson_id)
    );
    return lessonsInCategory.length
      ? ((completedLessonIds.size / lessonsInCategory.length) * 100).toFixed(2)
      : 0;
  };

  return (
    <div className={styles.lessonsContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Lessons</h1>
      <div className={styles.categoriesSection}>
        <h2>Categories</h2>
        <div className={styles.categoriesList}>
          {categories.map((category) => (
            <LessonCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Learning Progress - Sao chép từ Profile */}
      <div className={styles.section + ' ' + styles.learningProgress}>
        <h2>Tiến trình học tập</h2>
        {Array.from(new Set(totalLessons.map(lesson => lesson.category_id))).map((categoryId, index) => (
          <div key={categoryId} className={styles.categoryProgress}>
            <p>Bài học {index + 1}: Đã hoàn thành {calculateLearningPercentage(categoryId)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}