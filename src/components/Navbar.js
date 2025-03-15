import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, getUser, signOut } from '@/utils/auth';
import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null); // Cập nhật trạng thái người dùng sau khi đăng xuất
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/logo-Photoroom.png" alt="Website Logo" width={70} height={60} />
          </Link>
        </div>

        {/* Menu */}
        <ul className={styles.menu}>
          <li><Link className={styles.navLink} href="/">Home</Link></li>
          <li><Link className={styles.navLink} href="/lessons">Lessons</Link></li>
          <li><Link className={styles.navLink} href="/quiz">Quiz</Link></li>
          <li><Link className={styles.navLink} href="/profile">Profile</Link></li>
        </ul>

        {/* User Section */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userInfo}>
              <button className={styles.signOut} onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link className={styles.authLink} href="/signup">Sign Up</Link>
              <Link className={styles.authLink} href="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
