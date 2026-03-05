import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Food {
    id: number;
    name: string;
    price: number;
    description: string;
    image?: string;
}

interface User {
    username: string;
}

export default function Foods() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        // ดึงรายการอาหาร
        fetch('http://localhost:3000/foods')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFoods(data);
                }
            })
            .catch(err => console.error('Error:', err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="foods-loading">กำลังโหลด...</div>;
    }

    return (
        <div className="foods-container">
            {/* Header */}
            <header className="foods-header">
                <div className="header-content">
                    <h1>🍽️ หม่าล่า Hopot</h1>
                    <div className="header-right">
                        <p className="welcome-text">ยินดีต้อนรับ, <strong>{user?.username}</strong></p>
                        <button onClick={handleLogout} className="logout-btn">ออกจากระบบ</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="foods-main">
                <div className="section-header">
                    <h2>เมนูอาหาร</h2>
                    <p>เลือกอาหารที่คุณชอบ</p>
                </div>

                {foods.length === 0 ? (
                    <div className="empty-state">
                        <p>ยังไม่มีรายการอาหารในระบบ</p>
                    </div>
                ) : (
                    <div className="foods-grid">
                        {foods.map((food) => (
                            <div key={food.id} className="food-card">
                                {food.image ? (
                                    <img src={food.image} alt={food.name} className="food-image" />
                                ) : (
                                    <div className="food-image-placeholder">🍲</div>
                                )}
                                <div className="food-info">
                                    <h3>{food.name}</h3>
                                    <p className="food-description">{food.description}</p>
                                    <div className="food-footer">
                                        <span className="food-price">฿{food.price}</span>
                                        <button className="btn-order">สั่งอาหาร</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="foods-footer">
                <p>&copy; 2026 มาลา เรสเตอรอง. สงวนสิทธิ์ทั้งหมด</p>
            </footer>
        </div>
    );
}
