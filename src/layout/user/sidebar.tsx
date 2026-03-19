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
                    backgroundColor: "#ffffff",
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
                        backgroundColor: "#ffffff"
                    }}
                >
                    {/* Foods */}
                    <div
                        onClick={() => navigate('/foods')}
                        style={{
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "10px 0",
                            color: isActive('/foods') ? "orange" : "black",
                            borderRight: isActive('/foods')
                                ? "7px solid orange"
                                : "7px solid transparent",
                            transition: "0.2s",
                        }}
                    >
                        <MdDashboard style={{ backgroundColor: "#ffffff" }} size={28} />
                        <span style={{ fontSize: "1.1rem", background: "#ffffff" }}>
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
                        backgroundColor: "#ffffff"
                    }}
                >
                    {/* soups */}
                    <div
                        onClick={() => navigate('/soups')}
                        style={{
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            padding: "10px 0",
                            color: isActive('/soups') ? "orange" : "black",
                            borderRight: isActive('/soups')
                                ? "7px solid orange"
                                : "7px solid transparent",
                            transition: "0.2s",
                        }}
                    >
                        <TbSoupFilled style={{ backgroundColor: "#ffffff" }} size={28} />
                        <span style={{ fontSize: "1.1rem", background: "#ffffff" }}>
                            รายการน้ำซุป
                        </span>
                    </div>
                </div>


            </aside>
        </>
    );
}