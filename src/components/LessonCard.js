// components/LessonCard.js
import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/LessonCard.module.css';

export default function LessonCard({ category, progress }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/lessons/${category.id}`);
  };

  return (
    <div onClick={handleCardClick} className={styles.card}>
      <img src={category.image_url} alt={category.name} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{category.name}</h2>
        <p className={styles.cardDescription}>{category.description}</p>
      </div>
    </div>
  );
}