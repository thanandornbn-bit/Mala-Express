import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface User {
    username: string;
}

interface HeaderAdminProps {
    user: User | null;
}

export default function HeaderAdmin({ user }: HeaderAdminProps) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const handleLogout = async () => {
        try{
            const response = await fetch('http://localhost:3000/login', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Logout failed');
                return;
            }
        }catch(err){
            console.error('Logout error:', err);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="admin-header" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        }}>
            <div className="header-content" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "rgba(60, 64, 67, 0.1) 0px 0px 5px 0px",
            }}>
                {/* Left - Logo */}
                <div className="header-left" style={{
                    backgroundColor:"#ffffff"
                }}>
                    <h1 className="logo" style={{
                        backgroundColor:"#ffffff",
                        color:"orange",
                        fontSize:"1.5rem",
                        fontWeight:"bold",
                    }}>Mala Express</h1>
                </div>

                {/* Right - User Info & Logout */}
                <div className="header-right" style={{
                    display:"flex",
                    backgroundColor:"#ffffff",
                    alignItems:"center"
                }}>
                    <p className="welcome-text" style={{
                        backgroundColor:"#ffffff",
                        color:"#000000",
                        marginRight:"1rem",
                    }}>
                        ยินดีต้อนรับ, <strong style={{
                            backgroundColor:"#ffffff",
                            color:"#000000"
                        }}>{user?.username}</strong>
                    </p>
                    <button onClick={handleLogout} className="logout-btn" style={{
                        backgroundColor:"red",
                        color:"#fff",
                        width:"13vh",
                        height:"3vh",
                        borderRadius:"10px",
                        border:"1px solid #1a1a1a"  
                    }}>
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </header>
    );
}