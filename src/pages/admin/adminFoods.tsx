import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAdmin from "../../layout/admin/headerAdmin";
import SidebarAdmin from "../../layout/admin/sidebarAdmin";
import { FaPlus, FaEdit, FaTrash, FaUtensils, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

interface Foods {
  id: number;
  foodName: string;
  foodImage?: string;
  foodType?: string;
  foodAmount: number;
  foodPrice: number;
}

interface User {
  username: string;
}

export default function AdminDashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    foodName: "",
    foodImage: "",
    foodType: "",
    foodAmount: "",
    foodPrice: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    const parsedUser = userData ? JSON.parse(userData) : null;
    if (parsedUser?.role !== "admin") {
      navigate("/foods");
      return;
    }

    setUser(parsedUser);
    fetchFoods();
  }, [navigate]);

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:3000/foods");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFoods(data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // ใช้ base64 จาก preview ถ้ามีการเลือกรูปใหม่ หรือใช้รูปเดิม
      const foodImage = imagePreview || formData.foodImage;

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3000/foods/${editingId}`
        : `http://localhost:3000/foods`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodName: formData.foodName,
          foodImage: foodImage,
          foodType: formData.foodType,
          foodAmount: Number(formData.foodAmount),
          foodPrice: parseFloat(formData.foodPrice),
        }),
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาด");
        return;
      }

      resetForm();
      setIsModalOpen(false);
      fetchFoods();
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (food: Foods) => {
    setFormData({
      foodName: food.foodName,
      foodImage: food.foodImage || "",
      foodType: food.foodType || "",
      foodAmount: food.foodAmount.toString(),
      foodPrice: food.foodPrice.toString(),
    });
    setImagePreview(food.foodImage || "");
    setEditingId(food.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/foods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("ลบไม่สำเร็จ");
        return;
      }

      setConfirmDeleteId(null);
      fetchFoods();
    } catch (err) {
      console.error("Error:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const resetForm = () => {
    setFormData({
      foodName: "",
      foodImage: "",
      foodType: "",
      foodAmount: "",
      foodPrice: "",
    });
    setEditingId(null);
    setImagePreview("");
  };

  const showModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // จัดกลุ่มอาหารตามประเภท
  const groupedFoods = foods.reduce(
    (acc, food) => {
      const type = food.foodType || "อื่นๆ";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(food);
      return acc;
    },
    {} as Record<string, Foods[]>,
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          background: "#f0f2f5",
        }}
      >
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <HeaderAdmin user={user} />

      <div style={{ display: "flex", flex: 1, marginTop: "63px" }}>
        <SidebarAdmin />

        <main
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: 0,
              }}
            >
              <FaUtensils style={{ color: "#4f46e5" }} />
              จัดการเมนูอาหาร
            </h1>
            <button
              onClick={showModal}
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                fontSize: "15px",
                padding: "12px 24px",
                borderRadius: "10px",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(79, 70, 229, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(79, 70, 229, 0.4)";
              }}
            >
              <FaPlus
                style={{
                  backgroundColor: "#fff",
                  color: "#4f46e5",
                  borderRadius: "50%",
                  padding: "5px",
                  fontSize: "20px",
                }}
              />
              เพิ่มอาหารใหม่
            </button>
          </div>

          {/* Divider */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              marginBottom: "24px",
            }}
          />

          {/* Content */}
          {foods.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: "12px",
                color: "#9ca3af",
                fontSize: "16px",
              }}
            >
              ยังไม่มีรายการอาหาร
            </div>
          ) : (
            Object.entries(groupedFoods).map(([category, categoryFoods]) => (
              <div key={category} style={{ marginBottom: "32px" }}>
                {/* Category Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      background: "#4f46e5",
                      color: "#fff",
                      padding: "4px 14px",
                      borderRadius: "20px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {category}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: "14px" }}>
                    ({categoryFoods.length} รายการ)
                  </span>
                </div>

                {/* Food Cards Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {categoryFoods.map((food) => (
                    <div
                      key={food.id}
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.08)";
                      }}
                    >
                      {/* Image */}
                      {food.foodImage ? (
                        <img
                          src={food.foodImage}
                          alt={food.foodName}
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "180px",
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "14px",
                          }}
                        >
                          ไม่มีรูปภาพ
                        </div>
                      )}

                      {/* Info */}
                      <div style={{ padding: "14px" }}>
                        <h3
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#1a1a1a",
                          }}
                        >
                          {food.foodName}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#ef4444",
                              fontWeight: "700",
                              fontSize: "18px",
                            }}
                          >
                            ฿{food.foodPrice}
                          </span>
                          <span
                            style={{
                              background:
                                food.foodAmount > 10 ? "#dcfce7" : "#fef3c7",
                              color:
                                food.foodAmount > 10 ? "#16a34a" : "#d97706",
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            คงเหลือ: {food.foodAmount}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: "flex",
                          borderTop: "1px solid #f3f4f6",
                        }}
                      >
                        <button
                          onClick={() => handleEdit(food)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            background: "transparent",
                            color: "#4f46e5",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f5f3ff")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <FaEdit /> แก้ไข
                        </button>
                        <div style={{ width: "1px", background: "#f3f4f6" }} />
                        <button
                          onClick={() => setConfirmDeleteId(food.id)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            background: "transparent",
                            color: "#ef4444",
                            fontSize: "14px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#fef2f2")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <FaTrash /> ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {/* ===== Modal เพิ่ม/แก้ไขอาหาร ===== */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "7vh",
            left: "25vh",
            right: "0",
            bottom: "5vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => {
              resetForm();
              setIsModalOpen(false);
            }}
            style={{
              position: "absolute",
              top: "7vh",
              left: "25vh",
              right: "0",
              bottom: "5vh",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* Modal Content */}
          <div
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "fadeIn 0.25s ease",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                }}
              >
                {editingId ? "แก้ไขอาหาร" : "เพิ่มอาหารใหม่"}
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>
                  ชื่ออาหาร <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.foodName}
                  onChange={(e) =>
                    setFormData({ ...formData, foodName: e.target.value })
                  }
                  required
                  placeholder="เช่น ข้าวมันไก่"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#4f46e5")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>รูปภาพ</label>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: imagePreview ? "0" : "24px 14px",
                    borderRadius: "8px",
                    border: "2px dashed #d1d5db",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    overflow: "hidden",
                    background: "#fafafa",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f46e5";
                    e.currentTarget.style.background = "#f5f3ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.background = "#fafafa";
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    <>
                      <FaCloudUploadAlt
                        style={{ fontSize: "32px", color: "#9ca3af" }}
                      />
                      <span style={{ color: "#6b7280", fontSize: "14px" }}>
                        คลิกเพื่อเลือกรูปภาพ
                      </span>
                      <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                        รองรับ JPG, PNG, GIF, WEBP (สูงสุด 5MB)
                      </span>
                    </>
                  )}
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, foodImage: "" });
                    }}
                    style={{
                      marginTop: "8px",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#fef2f2",
                      color: "#ef4444",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    ลบรูปภาพ
                  </button>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  ประเภทอาหาร <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.foodType}
                  onChange={(e) =>
                    setFormData({ ...formData, foodType: e.target.value })
                  }
                  required
                  placeholder="เช่น อาหารจานหลัก, เครื่องดื่ม, ของหวาน"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#4f46e5")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>
                  จำนวนคงเหลือ <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.foodAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, foodAmount: e.target.value })
                  }
                  required
                  placeholder="50"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#4f46e5")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>
                  ราคา (บาท) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.foodPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, foodPrice: e.target.value })
                  }
                  required
                  placeholder="50.00"
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#4f46e5")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                />
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    fontWeight: "600",
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(79, 70, 229, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(79, 70, 229, 0.3)";
                  }}
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มอาหาร"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Modal ยืนยันการลบ ===== */}
      {confirmDeleteId !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => setConfirmDeleteId(null)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "#fef2f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FaTrash style={{ color: "#ef4444", fontSize: "22px" }} />
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#1a1a1a",
              }}
            >
              ยืนยันการลบ
            </h3>
            <p
              style={{ color: "#6b7280", margin: "0 0 24px", fontSize: "15px" }}
            >
              คุณแน่ใจหรือว่าต้องการลบรายการนี้?
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#dc2626")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#ef4444")
                }
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared styles
const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  fontSize: "15px",
  color: "#1a1a1a",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};
