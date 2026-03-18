import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { googleLogout } from "@react-oauth/google";


interface User {
    username: string;
}


export default function HeaderAdmin() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        googleLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const [user, setUser] = useState<User | null>(null)
    useEffect (() => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            try {
                setUser(JSON.parse(storedUser))
            }catch{
                localStorage.removeItem("user")
            }
        }
    })


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