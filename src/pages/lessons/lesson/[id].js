// pages/lessons/lesson/[id].js
import Navbar from '@/components/Navbar';
import { getUser, supabase } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@/styles/LessonDetail.module.css';

export default function LessonDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [asks, setAsks] = useState([]);
  const [newAsk, setNewAsk] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
        if (id) {
          fetchLesson(id, currentUser.id);
          fetchAsks(id);
        }
      }
    };
    fetchData();
  }, [id]);

  const fetchLesson = async (lessonId, userId) => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    if (error) {
      console.error('Error fetching lesson:', error);
    } else {
      setLesson(data);
      markLessonAsCompleted(userId, lessonId);
    }
  };

  const markLessonAsCompleted = async (userId, lessonId) => {
    const progressData = {
      userId: userId,
      lessonId: lessonId,
      quizId: null,
      lessonCompleted: true,
      quizCompleted: false,
      quizScore: null
    };

    const res = await fetch('/api/updateProgress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(progressData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error updating progress:', errorData.details);
    }
  };

  const fetchAsks = async (lessonId) => {
    const res = await fetch(`/api/qna/getAsk?lessonId=${lessonId}`);
    const asksData = await res.json();
    setAsks(asksData);
  };

  const createAsk = async () => {
    if (!newAsk) return;
    const res = await fetch('/api/qna/createAsk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        lessonId: id,
        content: newAsk
      })
    });

    if (res.ok) {
      setNewAsk('');
      fetchAsks(id);
    } else {
      const errorData = await res.json();
      console.error('Error creating ask:', errorData.details);
    }
  };

  const fetchAnswers = async (askId) => {
    const res = await fetch(`/api/qna/getAnswers?askId=${askId}`);
    const answersData = await res.json();
    setAnswers((prev) => ({ ...prev, [askId]: answersData }));
  };

  const createAnswer = async (askId) => {
    if (!newAnswer) return;
    const res = await fetch('/api/qna/createAnswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        askId,
        content: newAnswer
      })
    });

    if (res.ok) {
      setNewAnswer('');
      fetchAnswers(askId);
    } else {
      const errorData = await res.json();
      console.error('Error creating answer:', errorData.details);
    }
  };

  const handleNextLesson = async () => {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .order('id', { ascending: true });
    const currentLessonIndex = lessons.findIndex((lesson) => lesson.id === parseInt(id));
    const nextLesson = lessons[currentLessonIndex + 1];
    if (nextLesson) {
      router.push(`/lessons/lesson/${nextLesson.id}`);
    } else {
      alert("This is the last lesson.");
    }
  };

  return (
    <div className={styles.lessonDetailContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Lesson Detail</h1>
      <button className={styles.lessonButton} onClick={() => router.push(`/lessons/${lesson?.category_id}`)}>
        Back to Lessons
      </button>
      {lesson ? (
        <div className={styles.lessonContent}>
          <h2 className={styles.lessonTitle}>{lesson.title}</h2>
          <p className={styles.lessonText}>{lesson.content}</p>
          <div className={styles.lessonMedia}>
            {lesson.type === 'video' && <video src={lesson.media_url} controls />}
            {lesson.type === 'image' && <img src={lesson.media_url} alt={lesson.title} />}
            {lesson.type === 'text' && <p>{lesson.media_url}</p>}
          </div>
          <button className={styles.lessonButton} onClick={handleNextLesson}>
            Next Lesson
          </button>

          <div className={styles.qnaSection}>
            <h3>Questions</h3>
            {asks.map((ask) => (
              <div key={ask.id} className={styles.askItem}>
                <p><strong>{ask.content}</strong></p>
                <button className={styles.lessonButton} onClick={() => fetchAnswers(ask.id)}>
                  Show Answers
                </button>
                <div className={styles.answerSection}>
                  {answers[ask.id]?.map((answer) => (
                    <p key={answer.id}>{answer.content}</p>
                  ))}
                  <textarea
                    placeholder="Your answer"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                  <button className={styles.lessonButton} onClick={() => createAnswer(ask.id)}>
                    Submit Answer
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.askForm}>
              <textarea
                placeholder="Your question"
                value={newAsk}
                onChange={(e) => setNewAsk(e.target.value)}
              />
              <button className={styles.lessonButton} onClick={createAsk}>
                Submit Question
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.loadingText}>Loading...</p>
      )}
    </div>
  );
}