// pages/quiz.js
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase, getUser } from '@/utils/auth';
import styles from '@/styles/QuizList.module.css';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const res = await fetch('/api/quizzes');
    const quizzesData = await res.json();
    setQuizzes(quizzesData);
    await fetchCompletedQuizzes();
  };

  const fetchCompletedQuizzes = async () => {
    const currentUser = await getUser();
    if (currentUser) {
      const { data, error } = await supabase
        .from('progress')
        .select('quiz_id')
        .eq('user_id', currentUser.id)
        .eq('quiz_completed', true);
      if (error) {
        console.error('Error fetching completed quizzes:', error);
      } else {
        setCompletedQuizzes(data.map(d => d.quiz_id));
      }
    }
  };

  const handleQuizClick = (quizId) => {
    setCompletedQuizzes((prev) => [...prev, quizId]);
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div className={styles.quizContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Quiz List</h1>
      <div className={styles.quizList}>
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => handleQuizClick(quiz.id)}
            className={`${styles.quizItem} ${completedQuizzes.includes(quiz.id) ? styles.completed : ''}`}
          >
            <h2 className={styles.quizTitle}>{quiz.title}</h2>
            <p className={styles.quizDescription}>{quiz.description}</p>
            {completedQuizzes.includes(quiz.id) && (
              <p className={styles.completedText}>(Completed)</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}