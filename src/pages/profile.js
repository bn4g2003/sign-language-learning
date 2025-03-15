import Navbar from '@/components/Navbar';
import { supabase, getUser } from '@/utils/auth';
import styles from '@/styles/Profile.module.css'; // Đảm bảo đường dẫn đúng
import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [progress, setProgress] = useState([]);
  const [totalLessons, setTotalLessons] = useState([]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const currentUser = await getUser();
    if (currentUser) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', currentUser.email)
        .single();
      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUser(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setBio(data.bio);
        setBirthday(data.birthday);
        setProfilePicture(data.profile_picture);
        fetchUserProgress(currentUser.id);
      }
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

  const updateProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        bio,
        birthday,
        profile_picture: profilePicture
      })
      .eq('email', user.email);
    if (error) {
      console.error('Error updating profile:', error);
    } else {
      console.log('Profile updated successfully');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <Navbar />
      <h1 className={styles.pageTitle}>Profile</h1>
      
      {user && (
        <div className={styles.profileSection}>
          {/* Profile Info */}
          <div className={styles.section + ' ' + styles.profileInfo}>
            <div className={styles.avatar}>
              <img src={profilePicture || '/logo-Photoroom.png'} alt="Avatar" width="120" height="120" />
            </div>
            <div className={styles.userDetails}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Họ:</strong> {user.first_name || 'N/A'}</p>
              <p><strong>Tên:</strong> {user.last_name || 'N/A'}</p>
              <p><strong>Ngày sinh:</strong> {user.birthday || 'N/A'}</p>
              <p><strong>Mô tả:</strong> {user.bio || 'N/A'}</p>
            </div>
          </div>

          {/* Edit Profile */}
          <div className={styles.section + ' ' + styles.editProfile}>
            <h2>Chỉnh sửa thông tin</h2>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <input
              type="text"
              placeholder="Profile Picture URL"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
            <button className={styles.updateButton} onClick={updateProfile}>Update Profile</button>
          </div>
        </div>
      )}

      {/* Learning Progress */}
      <div className={styles.section + ' ' + styles.learningProgress}>
        <h2>Tiến trình học tập</h2>
        {Array.from(new Set(totalLessons.map(lesson => lesson.category_id))).map((categoryId, index) => (
          <div key={categoryId} className={styles.categoryProgress}>
            <p>Bài học {index + 1}: Đã hoàn thành {calculateLearningPercentage(categoryId)}%</p>
          </div>
        ))}
      </div>

      {/* Quiz Progress */}
      <div className={styles.section + ' ' + styles.quizProgress}>
        <h2>Quiz Progress</h2>
        {progress.filter((p) => p.quiz_id).map((p) => (
          <div key={p.id} className={styles.quizItem}>
            <p><strong>Quiz ID:</strong> {p.quiz_id}</p>
            <p><strong>Điểm:</strong> {p.quiz_score}</p>
            <p><strong>Hoàn thành lúc:</strong> {new Date(p.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}