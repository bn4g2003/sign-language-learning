import { useEffect, useState } from "react";
import styles from "@/styles/MainLayout.module.css";

const MainLayout = ({ children }) => {
  return (
    <div className={styles.mainLayout}>
      {/* Thêm các lớp sóng vào đây */}
      <div className={styles.waveContainer}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </div>

      {/* Nội dung trang chủ */}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;