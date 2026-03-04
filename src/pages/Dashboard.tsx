import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // ดึงข้อมูล profile
    fetch('http://localhost:3000/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setUser(data);
        }
      })
      .catch(err => {
        console.error('Error:', err);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>กำลังโหลด...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1>ยินดีต้อนรับ!</h1>
        <h2>{user?.username}</h2>
        <p><strong>อีเมล:</strong> {user?.email}</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
