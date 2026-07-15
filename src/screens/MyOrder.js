import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const navigate = useNavigate();
    const [orderData, setorderData] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchMyOrder = async () => {
        const userEmail = localStorage.getItem('userEmail');
        console.log("Fetching orders for email:", userEmail);
        if (!userEmail) {
            console.log("No user email found");
            return;
        }
        
        await fetch("http://localhost:5000/api/myOrderData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail
            })
        }).then(async (res) => {
            let response = await res.json()
            console.log("Order data response:", response)
            console.log("Response orderData:", response.orderData)
            if (response.orderData && response.orderData.order_data) {
                console.log("Setting order data:", response.orderData.order_data)
                setorderData(response.orderData.order_data)
            } else {
                console.log("No orderData or order_data found in response")
            }
        }).catch(err => {
            console.error("Error fetching orders:", err)
        })
    }

    useEffect(() => {
        console.log("MyOrder component mounted");
        fetchMyOrder()
    }, [])

    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className='container'>
                <div className='row'>
                    <h2 className='my-4'>My Order History</h2>
                    
                    {orderData.length > 0 ? (
                        orderData.slice(0).reverse().map((order, orderIndex) => {
                            // Handle the backend data structure: [{Order_date}, item1, item2, ...]
                            let items = [];
                            let orderDate = '';
                            
                            console.log("Order structure:", order);
                            
                            if (Array.isArray(order) && order.length > 0) {
                                // First element is Order_date object, rest are items
                                const firstElement = order[0];
                                if (firstElement && firstElement.Order_date) {
                                    orderDate = firstElement.Order_date;
                                    items = order.slice(1);
                                } else {
                                    console.log("First element doesn't have Order_date:", firstElement);
                                    return null;
                                }
                            } else {
                                console.log("Order is not an array or empty:", order);
                                return null;
                            }
            
            if (!Array.isArray(items)) {
                console.log("Items is not an array:", items);
                return null;
            }
            
            return (
                <div key={orderIndex} className='mb-5'>
                    <div className='fs-4 mb-3'>
                        Order Date: {orderDate ? new Date(orderDate).toLocaleString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Unknown date'}
                    </div>
                    <hr />
                    <div className='row'>
                        {items.map((item, itemIndex) => (
                            <div key={item._id || item.id || itemIndex} className='col-12 col-md-6 col-lg-3'>
                                <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                    <img src={item.img} className="card-img-top" alt={item.name} style={{ height: "120px", objectFit: "fill" }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <div className='container w-100 p-0' style={{ height: "38px" }}>
                                            <span className='m-1'>Qty: {item.qty}</span>
                                            <span className='m-1'>Size: {item.size}</span>
                                            <div className=' d-inline ms-2 h-100 w-20 fs-5'>
                                                ₹{item.price}/-
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        })
    ) : (
        <div className='text-center fs-4 mt-5'>No orders found</div>
    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}