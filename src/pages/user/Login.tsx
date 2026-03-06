import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/mian.css';
import { GoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';



export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const clientId = "252649899378-e14ag845u9jq1ljeo2ggjj1mg038lj43.apps.googleusercontent.com"
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        }
        gapi.load("client:auth2", initClient)
    }, [])

    const onSuccess = async (credentialResponse: any) => {

        const res = await fetch("http://localhost:3000/google-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: credentialResponse.credential
            })
        })

        const data = await res.json()

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        navigate("/foods")
    }

    const onFailure = (res: any) => {
        console.log('failed', res)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // บันทึก token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect ตามประเภท user
            console.log('User role:', data.user.role);
            if (data.user.role === 'admin') {
                navigate('/adminFoods');
            } else if (data.user.role === 'user') {
                navigate('/foods');
            } else {
                setError('Invalid user role');
            }
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
            background: "linear-gradient(75deg, #000000 0%, #dd0000 100%)",
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
                }}>เข้าสู่ระบบ</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        backgroundColor: "#1a1a1a"
                    }}>
                    <label htmlFor="username"
                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                        }}>
                        ชื่อผู้ใช้</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="กรอกชื่อผู้ใช้"

                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                            border: "1px solid #ffffff",
                            borderRadius: "10px",
                            height: "4vh",
                            paddingLeft: "10px"
                        }}
                    />


                    <label htmlFor="password"
                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                        }}>รหัสผ่าน</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="กรอกรหัสผ่าน"

                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "#fff",
                            border: "1px solid #ffffff",
                            borderRadius: "10px",
                            height: "4vh",
                            paddingLeft: "10px"
                        }}
                    />


                    <button type="submit" disabled={loading}
                        style={{
                            marginTop: "15px",
                            backgroundColor: "#1a1a1a",
                            borderRadius: "10px",
                            border: "1px solid #ffffff",
                            height: "4vh",
                            color: "#fff"
                        }}>
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <p className="auth-link"
                    style={{
                        backgroundColor: "#1a1a1a",
                        color: "#ffffff",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        gap: "5px"
                    }}>
                    ยังไม่มีบัญชี?
                    <a href="/register"
                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "blue",
                        }}
                    >สมัครสมาชิก</a>
                </p>


                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={() => onFailure}
                />;

            </div>
        </div>
    );
}
