import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatchCart, useCart } from './ContextReducer'

export default function Card(props) {
  const data = useCart()
  const navigate = useNavigate()
  const dispatch = useDispatchCart()

  const options = props.options || {}
  const priceOptions = Object.keys(options)
  const foodItem = props.item

  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(priceOptions[0] || '')

  const handleClick = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }

  const handleQty = (e) => {
    setQty(Number(e.target.value))
  }

  const handleOptions = (e) => {
    setSize(e.target.value)
  }

  const finalPrice = qty * parseInt(options[size] || 0, 10)

  const handleAddToCart = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    const existingItem = data.find((item) => item.id === foodItem._id)

    if (existingItem) {
      if (existingItem.size === size) {
        dispatch({
          type: 'UPDATE',
          id: foodItem._id,
          price: finalPrice,
          qty: qty,
        })
      } else {
        dispatch({
          type: 'ADD',
          id: foodItem._id,
          name: foodItem.name,
          price: finalPrice,
          qty: qty,
          size: size,
          img: props.ImgSrc,
        })
      }
      return
    }

    dispatch({
      type: 'ADD',
      id: foodItem._id,
      name: foodItem.name,
      price: finalPrice,
      qty: qty,
      size: size,
      img: props.ImgSrc,
    })
  }

  return (
    <div>
      <div className="card mt-3" style={{ width: '16rem', maxHeight: '360px' }}>
        <img
          src={props.ImgSrc}
          className="card-img-top"
          alt="..."
          style={{ height: '120px', objectFit: 'fill' }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.foodName}</h5>

          <div className="container w-100 p-0" style={{ height: '38px' }}>
            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              onClick={handleClick}
              onChange={handleQty}
              value={qty}
            >
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              className="m-2 h-100 w-20 bg-success text-black rounded"
              onClick={handleClick}
              onChange={handleOptions}
              value={size}
            >
              {priceOptions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            <div className="d-inline ms-2 h-100 w-20 fs-5">
              ₹{finalPrice}/-
            </div>
          </div>

          <hr />

          <button className="btn btn-success justify-center ms-2" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}