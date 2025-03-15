import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/HeroSection.module.css";

const images = [
  "/hero-image1.jpg",
  "/hero-image2.jpg",
  "/hero-image3.jpg"
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000); // Đổi ảnh mỗi 7 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.content}>
        <h1 className={styles.title}>Học Ngôn Ngữ Ký Hiệu Dễ Dàng</h1>
        <p className={styles.description}>
          Nền tảng học ngôn ngữ ký hiệu trực tuyến với các bài học phong phú,
          dễ hiểu và bài tập thực hành trực quan.
        </p>
        <Link href="/lessons" className={styles.ctaButton}>Bắt đầu ngay</Link>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={images[currentImage]}
          alt="Hero Image"
          width={800}
          height={500}
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
