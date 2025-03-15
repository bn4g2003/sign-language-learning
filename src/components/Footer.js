import React from 'react';
import styles from "@/styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Liên Hệ</h3>
          <p>Email: nhatbangnguyenhet@gmail.comcom</p>
          <p>Điện thoại: +84 857 164 166</p>
        </div>
        <div className={styles.footerSection}>
          <h3>Liên Kết</h3>
          <ul>
            <li><a href="/about">Về Chúng Tôi</a></li>
            <li><a href="/features">Tính Năng</a></li>
            <li><a href="/contact">Liên Hệ</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Mạng Xã Hội</h3>
          <ul>
            <li><a href="https://www.facebook.com/vay.ai.1000469/">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2025 Sign Language. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;