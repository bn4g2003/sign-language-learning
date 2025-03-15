import React from 'react';
import styles from "@/styles/AboutSection.module.css";

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutImage}>
          <img src={'/logo-Photoroom.png'} alt="Avatar" width="500" height="400" />
        </div>
        <div className={styles.aboutContent}>
          <h2>Về Chúng Tôi</h2>
          <p>
            Trang web này được tạo ra với mục đích giúp đỡ những người khiếm thính có thể học ngôn ngữ ký hiệu một cách dễ dàng và hiệu quả. Chúng tôi tin rằng ngôn ngữ ký hiệu là cầu nối quan trọng giúp mọi người giao tiếp và hiểu nhau hơn.
          </p>
          <p>
            Với các bài học được thiết kế cẩn thận và dễ hiểu, chúng tôi hy vọng sẽ mang lại một trải nghiệm học tập tốt nhất cho bạn.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;