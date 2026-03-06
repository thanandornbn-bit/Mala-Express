import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MdDashboard } from "react-icons/md";

export default function SidebarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside
            style={{
                marginTop:"-6.3vh",
                height: "auto",
                backgroundColor: "#1a1a1a",
                color: "white",
                width:"25vh",
                position: "relative",
                borderRight: "20px solid #333",
                boxShadow: "rgba(60, 64, 67, 0.1) 1px 0px 1px 0px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "1.25rem",
                    gap: "10px",
                    backgroundColor:"#1a1a1a"
                }}
            >
                {/* Dashboard */}
                <div
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background:"#1a1a1a",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        padding: "10px 0",
                        color: isActive('/dashboard') ? "red" : "white",
                        borderRight: isActive('/dashboard')
                            ? "5px solid red"
                            : "5px solid transparent",
                        transition: "0.2s",
                    }}
                >
                    <MdDashboard style={{backgroundColor:"#1a1a1a"}} size={28}  />
                    <span style={{ fontSize: "1.1rem" ,background:"#1a1a1a"}}>
                        Dashboard
                    </span>
                </div>
            </div>
        </aside>
    );
}