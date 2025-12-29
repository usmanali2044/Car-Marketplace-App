import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCarStore } from "../store/carStore";
import { useBuyRequestStore } from "../store/buyRequestStore";
import { useAuthStore } from "../store/authStore";
import {
  ArrowLeft,
  Calendar,
  Gauge,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCar, isLoading, getCarById } = useCarStore();
  const { createBuyRequest, isLoading: isRequestLoading } = useBuyRequestStore();
  const { isAuthenticated, user } = useAuthStore();
  const [showBuyRequestModal, setShowBuyRequestModal] = useState(false);
  const [buyRequestMessage, setBuyRequestMessage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getCarById(id);
    }
  }, [id, getCarById]);

  const handleBuyRequest = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to send a buy request');
      navigate('/login');
      return;
    }

    if (currentCar?.seller._id === user?._id) {
      toast.error('You cannot buy your own car');
      return;
    }

    if (currentCar?.isSold) {
      toast.error('This car has already been sold');
      return;
    }

    try {
      await createBuyRequest(id, buyRequestMessage);
      toast.success('Buy request sent successfully!');
      setShowBuyRequestModal(false);
      setBuyRequestMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending buy request');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!currentCar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Car not found</p>
          <Link to="/cars" className="text-indigo-600 hover:text-indigo-700">
            Browse all cars
          </Link>
        </div>
      </div>
    );
  }

  const images = currentCar.images && currentCar.images.length > 0 
    ? currentCar.images 
    : ['https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=60'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/cars" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600">
            <ArrowLeft className="w-5 h-5" />
            Back to Listings
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sold Badge */}
        {currentCar.isSold && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">This car has been sold</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={`${currentCar.brand} ${currentCar.model}`}
                  className="w-full h-96 object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-indigo-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${currentCar.brand} ${currentCar.model} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCar.brand} {currentCar.model}
              </h1>
              <p className="text-2xl font-bold text-indigo-600 mb-6">
                ${currentCar.price.toLocaleString()}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Year</div>
                    <div className="font-semibold">{currentCar.year}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Mileage</div>
                    <div className="font-semibold">{currentCar.mileage.toLocaleString()} km</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Condition</div>
                    <div className="font-semibold">{currentCar.condition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="font-semibold">{currentCar.location}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Transmission</span>
                    <p className="font-medium">{currentCar.transmission}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Fuel Type</span>
                    <p className="font-medium">{currentCar.fuelType}</p>
                  </div>
                </div>
              </div>

              {currentCar.description && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{currentCar.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold">{currentCar.seller?.name || 'Seller'}</p>
                  <p className="text-sm text-gray-500">{currentCar.seller?.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Member since {new Date(currentCar.seller?.createdAt).toLocaleDateString()}
              </p>

              {!currentCar.isSold && currentCar.seller._id !== user?._id && (
                <button
                  onClick={() => setShowBuyRequestModal(true)}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Buy This Car
                </button>
              )}

              {currentCar.seller._id === user?._id && (
                <div className="space-y-2">
                  <Link
                    to={`/cars/${id}/edit`}
                    className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-center"
                  >
                    Edit Listing
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Listed</span>
                  <span className="font-medium">
                    {new Date(currentCar.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Condition</span>
                  <span className="font-medium">{currentCar.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transmission</span>
                  <span className="font-medium">{currentCar.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fuel Type</span>
                  <span className="font-medium">{currentCar.fuelType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Request Modal */}
      {showBuyRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Send Buy Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send a message to the seller expressing your interest in this car.
            </p>
            <textarea
              value={buyRequestMessage}
              onChange={(e) => setBuyRequestMessage(e.target.value)}
              placeholder="Optional message to seller..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBuyRequestModal(false);
                  setBuyRequestMessage('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyRequest}
                disabled={isRequestLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isRequestLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

