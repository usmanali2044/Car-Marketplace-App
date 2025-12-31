import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCarStore } from "../store/carStore";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function CarListingPage() {
  const { cars, filters, pagination, isLoading, getAllCars, setFilters } = useCarStore();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    getAllCars(1);
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Prevent body scroll when filter modal is open on mobile
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    getAllCars(1);
  };

  const clearFilters = () => {
    const cleared = {
      brand: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
      condition: '',
      location: '',
      sortBy: 'newest'
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    getAllCars(1);
  };

  const handleSortChange = (sortBy) => {
    setLocalFilters({ ...localFilters, sortBy });
    setFilters({ ...localFilters, sortBy });
    getAllCars(1);
  };

  const handlePageChange = (page) => {
    getAllCars(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-indigo-600">CarLink</Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 text-sm">Home</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm">Dashboard</Link>
          </div>
          <div className="sm:hidden">
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 text-sm">Menu</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Browse Cars</h1>
          <p className="text-sm sm:text-base text-gray-600">Find your perfect car from thousands of listings</p>
        </div>

        <div className="flex gap-4 sm:gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={localFilters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    placeholder="e.g., Toyota"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={localFilters.model}
                    onChange={(e) => handleFilterChange('model', e.target.value)}
                    placeholder="e.g., Camry"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={localFilters.minYear}
                      onChange={(e) => handleFilterChange('minYear', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={localFilters.maxYear}
                      onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={localFilters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min $"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={localFilters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max $"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={localFilters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={localFilters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={localFilters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={localFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="City or State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Modal/Overlay */}
          {showFilters && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <aside className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto lg:hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="w-full mb-4 text-sm text-indigo-600 hover:text-indigo-700 text-left"
                  >
                    Clear All
                  </button>

                  <div className="space-y-4">
                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                      <input
                        type="text"
                        value={localFilters.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        placeholder="e.g., Toyota"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                      <input
                        type="text"
                        value={localFilters.model}
                        onChange={(e) => handleFilterChange('model', e.target.value)}
                        placeholder="e.g., Camry"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    {/* Year Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={localFilters.minYear}
                          onChange={(e) => handleFilterChange('minYear', e.target.value)}
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          value={localFilters.maxYear}
                          onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={localFilters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          placeholder="Min $"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          value={localFilters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          placeholder="Max $"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                      <select
                        value={localFilters.transmission}
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">All</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                        <option value="CVT">CVT</option>
                      </select>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                      <select
                        value={localFilters.fuelType}
                        onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">All</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                      <select
                        value={localFilters.condition}
                        onChange={(e) => handleFilterChange('condition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">All</option>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                        <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={localFilters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        placeholder="City or State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={() => {
                        applyFilters();
                        setShowFilters(false);
                      }}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </aside>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Sort and View Toggle */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-3 sm:px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {pagination.totalCars} cars found
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="lowestPrice">Lowest Price</option>
                    <option value="highestPrice">Highest Price</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Car Grid */}
            {isLoading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">Loading cars...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-gray-600 mb-4">No cars found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm sm:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {cars.map((car) => (
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
                            className="w-full h-40 sm:h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium">
                          {car.year}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base sm:text-lg truncate">{car.brand} {car.model}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {car.mileage.toLocaleString()} km • {car.location}
                            </p>
                          </div>
                          <div className="text-indigo-600 font-bold text-base sm:text-lg whitespace-nowrap shrink-0">
                            ${car.price.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600 mt-2 flex-wrap">
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
