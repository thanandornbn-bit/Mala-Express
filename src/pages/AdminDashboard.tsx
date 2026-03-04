import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
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

export default function AdminDashboard() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
            return;
        }

        const parsedUser = userData ? JSON.parse(userData) : null;
        if (parsedUser?.role !== 'admin') {
            navigate('/foods');
            return;
        }

        setUser(parsedUser);
        fetchFoods();
    }, [navigate]);

    const fetchFoods = async () => {
        try {
            const res = await fetch('http://localhost:3000/foods');
            const data = await res.json();
            if (Array.isArray(data)) {
                setFoods(data);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId
                ? `http://localhost:3000/foods/${editingId}`
                : 'http://localhost:3000/foods';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    image: formData.image
                })
            });

            if (!res.ok) {
                alert('เกิดข้อผิดพลาด');
                return;
            }

            // Reset form
            setFormData({ name: '', price: '', description: '', image: '' });
            setEditingId(null);
            setShowForm(false);
            fetchFoods();
        } catch (err) {
            console.error('Error:', err);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleEdit = (food: Food) => {
        setFormData({
            name: food.name,
            price: food.price.toString(),
            description: food.description || '',
            image: food.image || ''
        });
        setEditingId(food.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('คุณแน่ใจหรือ?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/foods/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                alert('ลบไม่สำเร็จ');
                return;
            }

            fetchFoods();
        } catch (err) {
            console.error('Error:', err);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleCancel = () => {
        setFormData({ name: '', price: '', description: '', image: '' });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="admin-loading">กำลังโหลด...</div>;
    }

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div className="header-content">
                    <h1>⚙️ Admin Dashboard</h1>
                    <div className="header-right">
                        <p className="welcome-text">ยินดีต้อนรับ, <strong>{user?.username}</strong></p>
                        <button onClick={handleLogout} className="logout-btn">ออกจากระบบ</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-content">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="form-header">
                            <h2>{editingId ? 'แก้ไขอาหาร' : 'เพิ่มอาหารใหม่'}</h2>
                            {showForm && (
                                <button onClick={handleCancel} className="btn-close">✕</button>
                            )}
                        </div>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="food-form">
                                <div className="form-group">
                                    <label>ชื่ออาหาร:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="เช่น ข้าวมันไก่"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>ราคา:</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>คำอธิบาย:</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="รายละเอียดเกี่ยวกับอาหาร"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>ลิงก์รูปภาพ:</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="form-buttons">
                                    <button type="submit" className="btn-submit">
                                        {editingId ? 'อัปเดต' : 'เพิ่มอาหาร'}
                                    </button>
                                    <button type="button" onClick={handleCancel} className="btn-cancel">
                                        ยกเลิก
                                    </button>
                                </div>
                            </form>
                        )}

                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-add"
                            >
                                เพิ่มอาหารใหม่
                            </button>
                        )}
                    </div>

                    {/* Foods List Section */}
                    <div className="foods-list-section">
                        <h2>รายการอาหาร ({foods.length})</h2>

                        {foods.length === 0 ? (
                            <div className="empty-state">
                                <p>ยังไม่มีรายการอาหาร</p>
                            </div>
                        ) : (
                            <div className="foods-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ชื่ออาหาร</th>
                                            <th>ราคา</th>
                                            <th>คำอธิบาย</th>
                                            <th>การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foods.map((food) => (
                                            <tr key={food.id}>
                                                <td>{food.id}</td>
                                                <td>{food.name}</td>
                                                <td>฿{food.price}</td>
                                                <td>{food.description?.substring(0, 30)}...</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleEdit(food)}
                                                        className="btn-edit"
                                                    >
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(food.id)}
                                                        className="btn-delete"
                                                    >
                                                        ลบ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
