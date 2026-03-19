import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside
        style={{
          position: "fixed",
          top: "63px",
          left: 0,
          bottom: 0,
          height: "calc(100vh - 63px)",
          backgroundColor: "#ffffff",
          color: "white",
          width: "25vh",
          boxShadow: "rgba(60, 64, 67, 0.1) 1px 0px 1px 0px",
          zIndex: 999,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "1.25rem",
            gap: "10px",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Foods */}
          <div
            onClick={() => navigate("/adminFoods")}
            style={{
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "10px 0",
              color: isActive("/adminFoods") ? "orange" : "black",
              borderRight: isActive("/adminFoods")
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
            backgroundColor: "#ffffff",
          }}
        >
          {/* soups */}
          <div
            onClick={() => navigate("/setting")}
            style={{
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "10px 0",
              color: isActive("/setting") ? "orange" : "black",
              borderRight: isActive("/setting")
                ? "7px solid orange"
                : "7px solid transparent",
              transition: "0.2s",
            }}
          >
            <IoSettingsSharp style={{ backgroundColor: "#ffffff" }} size={28} />
            <span style={{ fontSize: "1.1rem", background: "#ffffff" }}>
              ตั้งค่า
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
