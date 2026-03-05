import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // ตรวจสอบ password
        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if (password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            // สมัครสำเร็จ ไปหน้า login
            navigate('/login', { state: { message: 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ' } });
        } catch (err) {
            setError('Error connecting to server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            background: "linear-gradient(50deg, #000000 0%, #764ba2 100%)",  
        }}>
            <div className="auth-card" 
            style={{
                background: "#1a1a1a",
                padding: "40px",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                width: "100%",
                maxWidth: "400px",
            }}>
                <h2 style={{
                    textAlign: "center",
                    color: "#ffffff",
                    marginBottom: "30px",
                    fontSize: "24px",
                    backgroundColor: "#1a1a1a",
                }}>สมัครสมาชิก</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundColor: "#1a1a1a"
                }}>
                    
                        <label htmlFor="username"
                        style={{
                            backgroundColor:"#1a1a1a",
                            color: "#fff",
                        }}>
                            ชื่อผู้ใช้
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="เลือกชื่อผู้ใช้"
                            style={{
                                backgroundColor:"#1a1a1a",
                                color: "#fff",
                                border: "1px solid #ffffff",
                                borderRadius: "10px",
                                height: "4vh",
                                paddingLeft: "10px"
                            }}
                        />
                    

                    
                        <label htmlFor="email"
                        style={{
                            backgroundColor:"#1a1a1a",
                            color: "#fff",
                        }}>
                            อีเมล
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="กรอกอีเมล"
                            style={{
                                backgroundColor:"#1a1a1a",
                                color: "#fff",
                                border: "1px solid #ffffff",
                                borderRadius: "10px",
                                height: "4vh",
                                paddingLeft: "10px"
                            }}
                        />
                    

                    
                        <label htmlFor="password"
                        style={{
                            backgroundColor:"#1a1a1a",
                            color: "#fff",
                        }}>
                            รหัสผ่าน
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="สร้างรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                            style={{
                                backgroundColor:"#1a1a1a",
                                color: "#fff",
                                border: "1px solid #ffffff",
                                borderRadius: "10px",
                                height: "4vh",
                                paddingLeft: "10px"
                            }}
                        />
                    

                    
                        <label htmlFor="confirmPassword"
                        style={{
                            backgroundColor:"#1a1a1a",
                            color: "#fff",
                        }}>
                            ยืนยันรหัสผ่าน
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="ยืนยันรหัสผ่าน"
                            style={{
                                backgroundColor:"#1a1a1a",
                                color: "#fff",
                                border: "1px solid #ffffff",
                                borderRadius: "10px",
                                height: "4vh",
                                paddingLeft: "10px"
                            }}
                        />

                    <button type="submit" disabled={loading}
                    style={{
                        marginTop:"15px",
                        backgroundColor:"#1a1a1a",
                        borderRadius:"10px",
                        border:"1px solid #ffffff",
                        height:"4vh",
                        color:"#fff"
                    }}>
                        {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                    </button>
                </form>

                <p className="auth-link"
                style={{
                    backgroundColor:"#1a1a1a",
                    color:"#ffffff",
                    display:"flex",
                    justifyContent:"center",
                    marginTop:"20px",
                    gap:"5px"
                }}>
                    มีบัญชีแล้ว? 
                    <a href="/login"
                    style={{
                        backgroundColor:"#1a1a1a",
                        color:"blue",
                    }}>
                        เข้าสู่ระบบ
                    </a>
                </p>
            </div>
        </div>
    );
}