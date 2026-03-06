import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { googleLogout } from "@react-oauth/google";

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
        googleLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="admin-header">
            <div className="header-content" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#1a1a1a",
            }}>
                {/* Left - Logo */}
                <div className="header-left" style={{
                    backgroundColor:"#1a1a1a"
                }}>
                    <h1 className="logo" style={{
                        backgroundColor:"#1a1a1a",
                        color:"orange",
                        fontSize:"1.5rem",
                        fontWeight:"bold",
                    }}>🍜 Mala Express</h1>
                </div>

                {/* Right - User Info & Logout */}
                <div className="header-right" style={{
                    display:"flex",
                    backgroundColor:"#1a1a1a",
                    alignItems:"center"
                }}>
                    <p className="welcome-text" style={{
                        backgroundColor:"#1a1a1a",
                        color:"#fff",
                        marginRight:"1rem",
                    }}>
                        ยินดีต้อนรับ, <strong style={{
                            backgroundColor:"#1a1a1a",
                            color:"#ffffff"
                        }}>{user?.username}</strong>
                    </p>
                    <button onClick={handleLogout} className="logout-btn" style={{
                        backgroundColor:"red",
                        color:"#fff",
                        width:"13vh",
                        height:"3vh",
                        borderRadius:"10px",
                        border:"1px solid #ffffff"
                        
                    }}>
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </header>
    );
}