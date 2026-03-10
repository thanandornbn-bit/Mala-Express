import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { TbSoupFilled } from "react-icons/tb";

export default function SidebarAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <aside
                style={{
                    marginTop: "-6.3vh",
                    height: "auto",
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    width: "25vh",
                    position: "relative",
                    boxShadow: "rgba(60, 64, 67, 0.1) 1px 0px 1px 0px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "1.25rem",
                        gap: "10px",
                        backgroundColor: "#1a1a1a"
                    }}
                >
                    {/* Foods */}
                    <div
                        onClick={() => navigate('/foods')}
                        style={{
                            background: "#1a1a1a",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "10px 0",
                            color: isActive('/foods') ? "orange" : "white",
                            borderRight: isActive('/foods')
                                ? "7px solid orange"
                                : "7px solid transparent",
                            transition: "0.2s",
                        }}
                    >
                        <MdDashboard style={{ backgroundColor: "#1a1a1a" }} size={28} />
                        <span style={{ fontSize: "1.1rem", background: "#1a1a1a" }}>
                            รายการอาหาร
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "1.25rem",
                        gap: "10px",
                        backgroundColor: "#1a1a1a"
                    }}
                >
                    {/* soups */}
                    <div
                        onClick={() => navigate('/soups')}
                        style={{
                            background: "#1a1a1a",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "10px 0",
                            color: isActive('/soups') ? "orange" : "white",
                            borderRight: isActive('/soups')
                                ? "7px solid orange"
                                : "7px solid transparent",
                            transition: "0.2s",
                        }}
                    >
                        <TbSoupFilled style={{ backgroundColor: "#1a1a1a" }} size={28} />
                        <span style={{ fontSize: "1.1rem", background: "#1a1a1a" }}>
                            รายการน้ำซุป
                        </span>
                    </div>
                </div>


            </aside>
        </>
    );
}