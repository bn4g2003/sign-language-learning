// pages/admin/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { checkAdmin } from '@/utils/checkAdmin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '@/styles/admin/AdminDashboard.module.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      const isAdmin = await checkAdmin();
      if (!isAdmin) {
        router.push('/'); // Redirect to home page if not admin
      } else {
        setIsAdmin(true);
        fetchUsers();
      }
    };

    verifyAdmin();
  }, [router]);

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data.users);
    } else {
      router.push('/admin/login');
    }
  };

  // Tạo dữ liệu biểu đồ từ danh sách người dùng
  const chartData = users.map((user) => ({
    name: `${user.first_name} ${user.last_name}`,
    created_at: new Date(user.created_at).toLocaleDateString(),
  }));

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        {isAdmin ? (
          <>
            <h2 className={styles.sectionTitle}>Danh Sách Người Dùng</h2>
            <div className={styles.userTableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th>Ngày sinh</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.birthday}</td>
                      <td>{user.bio}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className={styles.sectionTitle}>Thống Kê Số Liệu</h2>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="name" stroke="#6b48ff" /> {/* Đổi màu tím cho admin */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className={styles.loadingText}>Đang kiểm tra quyền truy cập...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;