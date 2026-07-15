import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
export default function Home() {
  const [foodCat, setFoodCat] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [search, setSearch] = useState('')
  const loadFoodItems = async () => {
    try {
      let response = await fetch("https://khana-khazana-1.onrender.com/api/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      response = await response.json()
      setFoodItems(response[0])
      setFoodCat(response[1])
    } catch (error) {
      console.error("Error loading food items:", error)
    }
  }

  useEffect(() => {
    loadFoodItems()
  }, [])

  return (
    <div >
      <div>
        <Navbar />
      </div>
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade " data-bs-ride="carousel">

          <div className="carousel-inner " id='carousel'>
            <div className="carousel-caption" style={{ zIndex: "9" }}>
              <div className=" d-flex justify-content-center">  {/* justify-content-center, copy this <form> from navbar for search box */}
                <input className="form-control me-2 w-75 bg-white text-dark" type="search" placeholder="Search in here..." aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                <button className="btn text-white bg-danger" onClick={() => { setSearch('') }}>X</button>
              </div>
            </div>
            <div key="burger" className="carousel-item active" >
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=700&fit=crop" className="d-block w-100  " style={{ filter: "brightness(30%)" }} alt="Burger" />
            </div>
            <div key="pastry" className="carousel-item">
              <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&h=700&fit=crop" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="Pastry" />
            </div>
            <div key="barbeque" className="carousel-item">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&h=700&fit=crop" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="Barbeque" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className='container'>
        {
          foodCat.length > 0
            ? foodCat.map((data) => (
                <div key={data._id || data.id || data.CategoryName} className='row mb-3'>
                  <div className='fs-3 m-3'>
                    {data.CategoryName}
                  </div>
                  <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                  {foodItems.length > 0 ? foodItems.filter(
                    (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase())))
                    .map(filterItems => (
                        <div key={filterItems._id || filterItems.id || filterItems.name} className='col-12 col-md-6 col-lg-3'>
                          <Card foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img} ></Card>
                        </div>
                      )) : <div> No Such Data </div>}
                </div>
              ))
            : ""}
      </div>
      <Footer />
    </div>









  )
}
