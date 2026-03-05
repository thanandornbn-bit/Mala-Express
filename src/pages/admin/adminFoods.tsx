import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../layout/admin/headerAdmin';
import SidebarAdmin from '../../layout/admin/sidebarAdmin';

interface Foods {
    id: number;
    foodName: string;
    foodImage?: string;
    foodType?: string;
    foodAmount: number;
    foodPrice: number;
    
}

interface User {
    username: string;
}

export default function AdminDashboard() {
    const [foods, setFoods] = useState<Foods[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        foodName: '',
        foodImage: '',
        foodType:'',
        foodAmount:'',
        foodPrice: ''
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
                : `http://localhost:3000/foods`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    foodName: formData.foodName,
                    foodImage: formData.foodImage,
                    foodType: formData.foodType,
                    foodAmount: formData.foodAmount,
                    foodPrice: parseFloat(formData.foodPrice),
                })
            });

            if (!res.ok) {
                alert('เกิดข้อผิดพลาด');
                return;
            }

            setFormData({ foodName: '',foodImage: '',foodType:'', foodAmount:'', foodPrice: '' });
            setEditingId(null);
            setShowForm(false);
            fetchFoods();
        } catch (err) {
            console.error('Error:', err);
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleEdit = (food: Foods) => {
        setFormData({
            foodName: food.foodName,
            foodImage: food.foodImage || '',
            foodType: food.foodType || '',
            foodAmount : food.foodAmount.toString(),
            foodPrice: food.foodPrice.toString(),
            
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

    const handleCancel = () => {
        setFormData({ foodName: '', foodImage: '', foodType:'', foodAmount:'', foodPrice: '' });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                fontSize: '18px',
                color: '#fff'
            }}>
                กำลังโหลด...
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <HeaderAdmin user={user} />

            {/* Sidebar + Main Content */}
            <div style={{ display: 'flex', flex: 1, marginTop: '60px' }}>
                {/* Sidebar */}
                <SidebarAdmin />

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    marginLeft: sidebarOpen ? '50px' : '80px',
                    marginRight:"50px",
                    transition: 'margin-left 0.3s ease',
                    backgroundColor: '#ffffff',
                    overflowY: 'auto'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1.5fr',gap: '30px'
                    }}>
                        {/* Form Section */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '10px',
                            padding: '25px',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            border: '1px solid #000000',
                            height: 'fit-content',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h2 style={{ margin: 0, color: '#000000', fontSize: '20px' }}>
                                    {editingId ? 'แก้ไขอาหาร' : 'เพิ่มอาหารใหม่'}
                                </h2>
                                {showForm && (
                                    <button
                                        onClick={handleCancel}
                                        style={{
                                            background: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#ff2222';
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#ff4444';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {showForm && (
                                <form onSubmit={handleSubmit} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>
                                    <div>
                                        <label style={{ color: '#000000', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                            ชื่ออาหาร
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.foodName}
                                            onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                                            required
                                            placeholder="เช่น ข้าวมันไก่"
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #444',
                                                color: '#000000',
                                                padding: '10px 12px',
                                                borderRadius: '5px',
                                                fontSize: '14px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#000000', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                            ลิงก์รูปภาพ
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.foodImage}
                                            onChange={(e) => setFormData({ ...formData, foodImage: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #444',
                                                color: '#000000',
                                                padding: '10px 12px',
                                                borderRadius: '5px',
                                                fontSize: '14px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#000000', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                            ประเภท
                                        </label>
                                        <input
                                            type='text'
                                            value={formData.foodType}
                                            onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                            placeholder="ประเภทอาหาร"
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #444',
                                                color: '#000000',
                                                padding: '10px 12px',
                                                borderRadius: '5px',
                                                fontSize: '14px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                                transition: 'border-color 0.3s',
                                                resize: 'vertical'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#000000', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                            จำนวนอาหาร
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.foodAmount}
                                            onChange={(e) => setFormData({ ...formData, foodAmount: e.target.value })}
                                            required
                                            placeholder="50"
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #444',
                                                color: '#000000',
                                                padding: '10px 12px',
                                                borderRadius: '5px',
                                                fontSize: '14px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#000000', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                            ราคา
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.foodPrice}
                                            onChange={(e) => setFormData({ ...formData, foodPrice: e.target.value })}
                                            required
                                            placeholder="50"
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #444',
                                                color: '#000000',
                                                padding: '10px 12px',
                                                borderRadius: '5px',
                                                fontSize: '14px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                padding: '10px 16px',
                                                background: 'linear-gradient(135deg, #c0c0c0 0%, #00ac0e 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {editingId ? 'อัปเดต' : 'เพิ่มอาหาร'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            style={{
                                                flex: 1,
                                                padding: '10px 16px',
                                                background: 'linear-gradient(135deg, #b6b6b6 0%, #ff0800 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 16px',
                                        background: 'linear-gradient(186deg, #ffffff 0%, #0026ff 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        marginTop: '10px',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    เพิ่มอาหารใหม่
                                </button>
                            )}
                        </div>

                        {/* Foods List Section */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '10px',
                            padding: '25px',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            border: '1px solid #333'
                        }}>
                            <h2 style={{ margin: '0 0 20px 0', color: '#000000', fontSize: '22px' }}>
                                รายการอาหาร ({foods.length})
                            </h2>

                            {foods.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#000000',
                                    fontSize: '16px'
                                }}>
                                    <p>ยังไม่มีรายการอาหาร</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse'
                                    }}>
                                        <thead>
                                            <tr style={{ background: '#2a2a2a' }}>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>ID</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>ชื่ออาหาร</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>รูป</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>ประเภทอาหาร</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>จำนวน</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>ราคา</th>
                                                <th style={{
                                                    color: '#000000',
                                                    padding: '12px',
                                                    textAlign: 'left',
                                                    fontWeight: '600',
                                                    borderBottom: '2px solid #444',
                                                    fontSize: '14px'
                                                }}>การจัดการ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {foods.map((food) => (
                                                <tr
                                                    key={food.id}
                                                    style={{
                                                        borderBottom: '1px solid #333',
                                                        transition: 'background 0.3s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>{food.id}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>{food.foodName}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>{food.foodImage}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>{food.foodType}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>{food.foodAmount}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>฿{food.foodPrice}</td>
                                                    <td style={{ color: '#000000', padding: '12px', fontSize: '14px' }}>
                                                        <button
                                                            onClick={() => handleEdit(food)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#667eea',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                marginRight: '5px',
                                                                transition: 'all 0.3s'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#5a6dc5';
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.3)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = '#667eea';
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(food.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#ff4444',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                transition: 'all 0.3s'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#ff2222';
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 68, 68, 0.3)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = '#ff4444';
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = 'none';
                                                            }}
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
        </div>
    );
}