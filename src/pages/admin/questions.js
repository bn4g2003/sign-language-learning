// pages/admin/questions.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { checkAdmin } from '@/utils/checkAdmin';
import styles from '@/styles/admin/Questions.module.css';

const Questions = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    quiz_id: '',
    question_text: '',
    image_url: '',
    choice_a: '',
    choice_b: '',
    choice_c: '',
    choice_d: '',
    correct_choice: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        router.push('/'); // Redirect to home page if not admin
      } else {
        setIsAdmin(true);
        fetchQuizzes();
        fetchQuestions();
      }
    };

    verifyAdmin();
  }, [router]);

  const fetchQuizzes = async () => {
    const res = await fetch('/api/admin/quizzes', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    setQuizzes(data.quizzes);
  };

  const fetchQuestions = async () => {
    const res = await fetch('/api/admin/questions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    setQuestions(data.questions);
  };

  const addQuestion = async () => {
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newQuestion),
      });
      const data = await res.json();
      if (res.ok) {
        setNewQuestion({
          quiz_id: '',
          question_text: '',
          image_url: '',
          choice_a: '',
          choice_b: '',
          choice_c: '',
          choice_d: '',
          correct_choice: ''
        });
        fetchQuestions();
      } else {
        console.error('Error adding question:', data.message);
      }
    } catch (error) {
      console.error('Add question error:', error);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const res = await fetch(`/api/admin/questions?questionId=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        fetchQuestions();
      } else {
        console.error('Error deleting question:', data.message);
      }
    } catch (error) {
      console.error('Delete question error:', error);
    }
  };

  return (
    <div className={styles.questionsContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Quản lý Câu Hỏi và Quiz</h1>
        {isAdmin ? (
          <>
            <h2 className={styles.sectionTitle}>Danh Sách Quiz</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tên Quiz</th>
                    <th>Mô Tả</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map(quiz => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className={styles.sectionTitle}>Danh Sách Câu Hỏi</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID Quiz</th>
                    <th>Câu Hỏi</th>
                    <th>URL Hình Ảnh</th>
                    <th>Lựa Chọn A</th>
                    <th>Lựa Chọn B</th>
                    <th>Lựa Chọn C</th>
                    <th>Lựa Chọn D</th>
                    <th>Đáp Án Đúng</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map(question => (
                    <tr key={question.id}>
                      <td>{question.quiz_id}</td>
                      <td>{question.question_text}</td>
                      <td>{question.image_url}</td>
                      <td>{question.choice_a}</td>
                      <td>{question.choice_b}</td>
                      <td>{question.choice_c}</td>
                      <td>{question.choice_d}</td>
                      <td>{question.correct_choice}</td>
                      <td>
                        <button
                          onClick={() => deleteQuestion(question.id)}
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
            <div className={styles.addQuestionForm}>
              <h2 className={styles.sectionTitle}>Thêm Câu Hỏi Mới</h2>
              <input
                type="text"
                placeholder="ID Quiz"
                value={newQuestion.quiz_id}
                onChange={(e) => setNewQuestion({ ...newQuestion, quiz_id: e.target.value })}
                className={styles.inputField}
              />
              <textarea
                placeholder="Nội dung câu hỏi"
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                className={styles.textareaField}
              />
              <input
                type="text"
                placeholder="URL Hình ảnh"
                value={newQuestion.image_url}
                onChange={(e) => setNewQuestion({ ...newQuestion, image_url: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Lựa chọn A"
                value={newQuestion.choice_a}
                onChange={(e) => setNewQuestion({ ...newQuestion, choice_a: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Lựa chọn B"
                value={newQuestion.choice_b}
                onChange={(e) => setNewQuestion({ ...newQuestion, choice_b: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Lựa chọn C"
                value={newQuestion.choice_c}
                onChange={(e) => setNewQuestion({ ...newQuestion, choice_c: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Lựa chọn D"
                value={newQuestion.choice_d}
                onChange={(e) => setNewQuestion({ ...newQuestion, choice_d: e.target.value })}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Lựa chọn đúng (A, B, C, D)"
                value={newQuestion.correct_choice}
                onChange={(e) => setNewQuestion({ ...newQuestion, correct_choice: e.target.value })}
                className={styles.inputField}
              />
              <button onClick={addQuestion} className={styles.addButton}>
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

export default Questions;