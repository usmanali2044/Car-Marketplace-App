import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCarStore } from "../store/carStore";
import { Search, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { featuredCars, popularBrands, getFeaturedCars, getPopularBrands, setFilters, getAllCars } = useCarStore();
  const [searchQuery, setSearchQuery] = useState({ brand: '', model: '', location: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- Mobile menu state
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedCars();
    getPopularBrands();
  }, [getFeaturedCars, getPopularBrands]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      brand: searchQuery.brand,
      model: searchQuery.model,
      location: searchQuery.location
    });
    navigate('/cars');
  };

  const handleBrandClick = (brand) => {
    setFilters({ brand });
    navigate('/cars');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div>
              <h1 className="font-semibold text-xl">CarLink</h1>
              <p className="text-xs text-gray-500 -mt-1">Buy & Sell premium cars</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/cars" className="text-sm hover:text-indigo-600">Browse Cars</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm hover:text-indigo-600">Dashboard</Link>
                <Link to="/cars/create" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-lg">
                  Sell Your Car
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm shadow-lg">
                  Sign Up
                </Link>
                <Link to="/login" className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 text-sm">
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              Menu
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col z-50">
                <Link
                  to="/cars"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Browse Cars
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/cars/create"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sell Your Car
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
              Featured
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
              Find your dream car — <span className="text-indigo-600">fast</span> &amp; trusted
            </h2>

            <p className="mt-4 text-gray-600 max-w-xl">
              Browse thousands of verified listings, compare prices, schedule test drives and get financing — all from a single beautiful marketplace.
            </p>

            <form onSubmit={handleSearch} className="mt-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by brand, model..."
                    value={searchQuery.brand || searchQuery.model}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery({ ...searchQuery, brand: val, model: val });
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchQuery.location}
                  onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md text-sm text-gray-600">
              <div>
                <div className="text-xs text-gray-400">Verified Sellers</div>
                <div className="font-semibold">1,240+</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Active Listings</div>
                <div className="font-semibold">8,450</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Financing Partners</div>
                <div className="font-semibold">12</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=60"
                alt="car"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Popular Brands showing here */}
        {popularBrands.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Popular Brands
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularBrands.map((brandItem, index) => (
                <button
                  key={index}
                  onClick={() => handleBrandClick(brandItem.brand)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                >
                  {brandItem.brand} ({brandItem.count})
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Featured Cars here showing */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Featured Cars</h3>
            <Link to="/cars" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>

          {featuredCars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured cars...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.slice(0, 6).map((car) => (
                <Link
                  key={car._id}
                  to={`/cars/${car._id}`}
                  className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-lg text-xs font-medium">
                      {car.year}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-lg">{car.brand} {car.model}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {car.mileage.toLocaleString()} km • {car.location}
                        </p>
                      </div>
                      <div className="text-indigo-600 font-bold text-lg">
                        ${car.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                      <span>{car.transmission}</span>
                      <span>•</span>
                      <span>{car.fuelType}</span>
                      <span>•</span>
                      <span>{car.condition}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Sell your car — reach thousands</h3>
            <p className="mt-2 text-sm opacity-90">
              List easily, get financing offers, and connect with verified buyers.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            {isAuthenticated ? (
              <Link
                to="/cars/create"
                className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow hover:bg-gray-100"
              >
                Create a listing
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow hover:bg-gray-100"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>

        {/* Footer here */}
        <footer className="mt-12 py-10 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <div className="font-semibold">CarLink</div>
              <div className="text-xs">© {new Date().getFullYear()} CarLink. All rights reserved.</div>
            </div>
            <div className="flex gap-6 items-center">
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Help</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
