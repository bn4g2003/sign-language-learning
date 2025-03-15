import React from 'react';
import styles from "@/styles/FeaturesSection.module.css";

const FeaturesSection = () => {
  const features = [
    {
      title: "Bài Học Tương Tác",
      description: "Học ngôn ngữ ký hiệu thông qua các bài học tương tác, giúp bạn dễ dàng ghi nhớ và thực hành.",
      icon: "📚",
    },
    {
      title: "Khóa Học Đa Dạng",
      description: "Các khóa học được thiết kế phù hợp với mọi trình độ, từ cơ bản đến nâng cao.",
      icon: "🎓",
    },
    {
      title: "Hỗ Trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn trong quá trình học tập.",
      icon: "📞",
    },
    {
      title: "Cộng Đồng",
      description: "Tham gia vào cộng đồng người học để trao đổi và chia sẻ kinh nghiệm.",
      icon: "👥",
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <h2>Tính Năng Nổi Bật</h2>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;