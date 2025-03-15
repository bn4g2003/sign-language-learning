export const checkAdmin = async () => {
  const response = await fetch('/api/admin/check', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data.admin !== undefined;
  }
  return false;
};
