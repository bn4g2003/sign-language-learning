import React from "react";
import styles from "@/styles/Button.module.css";

export function Button({ children, onClick, color = "blue", ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[color]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
