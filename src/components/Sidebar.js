// components/Sidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/admin/Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Menu Quản Trị</h2>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link href="/admin/dashboard" className={`${styles.menuLink} ${router.pathname === '/admin/dashboard' ? styles.active : ''}`}>
            Bảng Điều Khiển
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/admin/categories" className={`${styles.menuLink} ${router.pathname === '/admin/categories' ? styles.active : ''}`}>
            Quản Lý Loại Bài Học
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/admin/lessons" className={`${styles.menuLink} ${router.pathname === '/admin/lessons' ? styles.active : ''}`}>
            Quản Lý Bài Học
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/admin/questions" className={`${styles.menuLink} ${router.pathname === '/admin/questions' ? styles.active : ''}`}>
            Quản Lý Câu Hỏi
          </Link>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Đăng Xuất
      </button>
    </div>
  );
}