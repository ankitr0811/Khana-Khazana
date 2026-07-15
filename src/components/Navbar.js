import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './ContextReducer';
export default function Navbar() {
  const cartData = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
  <div className="container-fluid">
    <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">My Cart {cartData.length > 0 && `(${cartData.length})`}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/myorder">My Orders</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}
