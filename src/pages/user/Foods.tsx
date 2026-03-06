
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../layout/user/header'
import Sidebar from '../../layout/user/sidebar'
import { FaShoppingCart } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import { FaBackspace } from "react-icons/fa";

interface Food {
    id: number
    foodName: string
    foodImage?: string
    foodType: string
    foodAmount: number
    foodPrice: number
}

interface CartItem extends Food {
    quantity: number
}

interface User {
    username: string
}

export default function Foods() {

    const [foods, setFoods] = useState<Food[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const [cart, setCart] = useState<CartItem[]>([])
    const [cartOpen, setCartOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token) {
            navigate('/login')
            return
        }

        if (userData) {
            setUser(JSON.parse(userData))
        }

        fetch('http://localhost:3000/foods')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFoods(data)
                }
            })
            .finally(() => setLoading(false))

    }, [navigate])


    /* เพิ่มสินค้าเข่้าตระกร่้า */
    const addToCart = (food: Food) => {

        if (food.foodAmount <= 0) return

        setCart(prev => {

            const exist = prev.find(i => i.id === food.id)

            if (exist) {
                return prev.map(i =>
                    i.id === food.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }

            return [...prev, { ...food, quantity: 1 }]
        })

        setFoods(prev =>
            prev.map(f =>
                f.id === food.id
                    ? { ...f, foodAmount: f.foodAmount - 1 }
                    : f
            )
        )
    }

    //ลบสินต้าออกจากตระกร้า
    const removeItem = (id: number) => {

        const item = cart.find(i => i.id === id)

        if (!item) return

        // คืน stock กลับ
        setFoods(prev =>
            prev.map(f =>
                f.id === id
                    ? { ...f, foodAmount: f.foodAmount + item.quantity }
                    : f
            )
        )

        // ลบออกจาก cart
        setCart(prev => prev.filter(i => i.id !== id))

    }

    const isInCart = (id: number) => {
        return cart.some(item => item.id === id)
    }

    /* เพิ่มจำนวนสินค้า CART */

    const increaseCart = (id: number) => {

        const food = foods.find(f => f.id === id)

        if (!food || food.foodAmount <= 0) return

        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )

        setFoods(prev =>
            prev.map(f =>
                f.id === id
                    ? { ...f, foodAmount: f.foodAmount - 1 }
                    : f
            )
        )
    }

    /* ลดจำนวนสินค้า CART */

    const decreaseCart = (id: number) => {

        setCart(prev => {

            const item = prev.find(i => i.id === id)
            if (!item) return prev

            if (item.quantity === 1) {
                return prev.filter(i => i.id !== id)
            }

            return prev.map(i =>
                i.id === id
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
            )
        })

        setFoods(prev =>
            prev.map(f =>
                f.id === id
                    ? { ...f, foodAmount: f.foodAmount + 1 }
                    : f
            )
        )
    }

    const total = cart.reduce(
        (sum, item) => sum + item.foodPrice * item.quantity,
        0
    )

    if (loading) {
        return <div style={{ padding: 30 }}>กำลังโหลด...</div>
    }

    return (

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Header user={user} />

            <div style={{ display: 'flex', flex: 1, marginTop: 60 }}>

                <Sidebar />

                <main style={{
                    flex: 1,
                    padding: 30,
                    background: '#f5f5f5'
                }}>

                    <h2>เมนูอาหาร</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                        gap: 20
                    }}>

                        {foods.map(food => (

                            <div key={food.id} style={{
                                background: '#fff',
                                borderRadius: 14,
                                overflow: 'hidden',
                                boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                            }}>

                                <div style={{ height: 150 }}>

                                    {food.foodImage ? (
                                        <img
                                            src={food.foodImage}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            height: '150px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            🍲
                                        </div>
                                    )}

                                </div>

                                <div style={{ padding: 14 }}>

                                    <h3 style={{ margin: 0 }}>
                                        {food.foodName}
                                    </h3>

                                    <p style={{
                                        fontSize: 13,
                                        color: '#666'
                                    }}>
                                        เหลือ {food.foodAmount}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>

                                        <span style={{
                                            color: '#ff6600',
                                            fontWeight: 600
                                        }}>
                                            {food.foodPrice} ฿
                                        </span>

                                        <button
                                            disabled={food.foodAmount === 0 || isInCart(food.id)}
                                            onClick={() => addToCart(food)}
                                            style={{
                                                background: (food.foodAmount === 0 || isInCart(food.id)) ? '#ccc' : '#ff6600',
                                                border: 'none',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: 8,
                                                cursor: (food.foodAmount === 0 || isInCart(food.id)) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {food.foodAmount === 0
                                                ? 'หมด'
                                                : isInCart(food.id)
                                                    ? 'อยู่ในตะกร้า'
                                                    : 'Add'}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </main>

            </div>

            {/* CART BUTTON */}

            <button
                onClick={() => setCartOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    width: 55,
                    height: 55,
                    borderRadius: '50%',
                    background: '#f5f5f5',
                    color: '#ff6600',
                    border: 'none',
                    fontSize: 24,
                    cursor: 'pointer',
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <FaShoppingCart fontSize="35px" style={{ backgroundColor: "#f5f5f5" }} />
            </button>

            {/* CART PANEL */}

            <div style={{
                position: 'fixed',
                top: 64,
                right: cartOpen ? 0 : '-360px',
                width: 360,
                height: 'calc(100% - 64px)',
                background: '#f7f7f7',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
                transition: 'right 0.3s',
                display: 'flex',
                flexDirection: 'column'
            }}>

                <div style={{
                    padding: 20,
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>

                    <button
                        onClick={() => setCartOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 23,
                            cursor: 'pointer',
                            marginTop:'8px',
                        }}
                    >
                        <FaBackspace style={{color:"red"}}/>
                    </button>

                    <b>ตะกร้าสินค้า</b>

                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 15
                }}>

                    {cart.map(item => (

                        <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            background: '#fff',
                            padding: 10,
                            borderRadius: 12,
                            marginBottom: 10
                        }}>

                            <img
                                src={item.foodImage}
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: 8
                                }}
                            />

                            <div style={{ flex: 1 }}>

                                <div style={{ fontWeight: 600 }}>
                                    {item.foodName}
                                </div>

                                <div style={{ fontSize: 12, color: '#888' }}>
                                    {item.foodPrice} ฿
                                </div>

                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10
                            }}>

                                <button
                                    onClick={() => decreaseCart(item.id)}
                                    style={{
                                        width: 26,
                                        height: 26,
                                        border: 'none',
                                        background: '#eee',
                                        borderRadius: 6
                                    }}
                                >
                                    <IoMdRemove fontSize='18px' style={{ backgroundColor: '#eee' }} />
                                </button>

                                <span style={{ fontSize: '22px' }}>{item.quantity}</span>

                                <button
                                    onClick={() => increaseCart(item.id)}
                                    style={{
                                        width: 26,
                                        height: 26,
                                        border: 'none',
                                        background: '#eee',
                                        borderRadius: 6
                                    }}
                                >
                                    <IoMdAdd fontSize='18px' style={{ backgroundColor: '#eee' }} />
                                </button>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        marginLeft: '6px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <IoTrashBin fontSize='20px' style={{ backgroundColor: 'red' }} />
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                <div style={{
                    padding: 20,
                    borderTop: '1px solid #ddd',
                    background: '#fff'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <span>ราคารวม</span>
                        <b style={{ color: '#ff6600' }}>
                            {total} ฿
                        </b>
                    </div>

                </div>

            </div>

        </div>

    )
}
