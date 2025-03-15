import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import styles from "@/styles/AuthForm.module.css";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/");
    };
    checkUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !fullName)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (isLogin) {
      let { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setError(error.message);
      router.push("/");
    } else {
      let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName } }
      });

      if (error) return setError(error.message);

      if (data.user) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: data.user.id, email, username: fullName, level: "Cơ bản", score: 0 }]);

        if (insertError) return setError(insertError.message);
        router.push("/");
      }
    }
  };

  return (
    <div className={styles.container}>
      <img src="/logo-Photoroom.png" alt="Logo" className={styles.logo} />
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                className={styles.input}
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </>
          )}
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <>
              <input
                className={styles.input}
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit" className={styles.button}>
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        <p
          onClick={() => setIsLogin(!isLogin)}
          className={styles.toggleText}
        >
          {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </p>
      </div>
    </div>
  );
}
