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