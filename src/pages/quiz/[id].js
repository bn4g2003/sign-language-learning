// pages/quiz/[id].js
import Navbar from '@/components/Navbar';
import { getUser, supabase } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@/styles/QuizDetail.module.css';

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [answered, setAnswered] = useState({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        setUser(currentUser);
      }
      if (id) {
        fetchQuestions();
      }
    };
    fetchData();
  }, [id]);

  const fetchQuestions = async () => {
    const res = await fetch(`/api/questions?quizId=${id}`);
    const questionsData = await res.json();
    setQuestions(questionsData);
  };

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
    setAnswered((prev) => ({
      ...prev,
      [currentQuestionIndex]: choice
    }));
  };

  const handleNextQuestion = async () => {
    if (selectedChoice === questions[currentQuestionIndex].correct_choice) {
      setScore(score + 1);
    }

    if (currentQuestionIndex === questions.length - 1) {
      await updateProgress();
      setCompleted(true);
    } else {
      setSelectedChoice('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const updateProgress = async () => {
    if (!user) {
      console.error('User not found');
      return;
    }

    const progressData = {
      userId: user.id,
      lessonId: null,
      quizId: id,
      lessonCompleted: false,
      quizCompleted: true,
      quizScore: score
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

  return (
    <div className={styles.quizDetailContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Quiz</h1>
      {questions.length > 0 ? (
        <div className={styles.quizContent}>
          {completed ? (
            <div className={styles.completedSection}>
              <h2 className={styles.completedTitle}>Quiz Completed</h2>
              <p className={styles.scoreText}>Your score: {score} / {questions.length}</p>
            </div>
          ) : (
            <div>
              <div className={styles.questionContainer}>
                <img
                  src={questions[currentQuestionIndex].image_url}
                  alt="Question Image"
                  className={styles.questionImage}
                />
                <div className={styles.questionTextWrapper}>
                  <h2 className={styles.questionTitle}>{questions[currentQuestionIndex].question_text}</h2>
                  <div className={styles.choicesContainer}>
                    {['A', 'B', 'C', 'D'].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => handleChoiceSelect(choice)}
                        className={`${styles.choiceButton} ${
                          answered[currentQuestionIndex] === choice ? styles.selected : ''
                        }`}
                      >
                        {questions[currentQuestionIndex][`choice_${choice.toLowerCase()}`]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleNextQuestion} className={styles.nextButton}>
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className={styles.loadingText}>Loading questions...</p>
      )}
    </div>
  );
}