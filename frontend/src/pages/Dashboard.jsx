import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCarStore } from "../store/carStore";
import { useBuyRequestStore } from "../store/buyRequestStore";
import {
  Home,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Mail,
  Car,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  User
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { isAuthenticated, checkAuth, isCheckingAuth, user, logout } = useAuthStore();
  const { userCars, getUserCars, deleteCar } = useCarStore();
  const { sellerRequests, getSellerRequests, acceptBuyRequest, declineBuyRequest } = useBuyRequestStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user) {
      getUserCars();
      getSellerRequests();
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
  }, [isAuthenticated, user, getUserCars, getSellerRequests]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteCar(carId);
        await getUserCars();
        toast.success('Car listing deleted successfully');
      } catch (error) {
        toast.error('Error deleting car listing');
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptBuyRequest(requestId);
      await getSellerRequests();
      await getUserCars();
      toast.success('Buy request accepted! Car marked as sold.');
    } catch (error) {
      toast.error('Error accepting request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await declineBuyRequest(requestId);
      await getSellerRequests();
      toast.success('Buy request declined');
    } catch (error) {
      toast.error('Error declining request');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const stats = {
    totalCars: userCars.length,
    activeCars: userCars.filter(car => !car.isSold).length,
    soldCars: userCars.filter(car => car.isSold).length,
    pendingRequests: sellerRequests.filter(req => req.status === 'pending').length
  };

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-indigo-600">CarLink</Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
              <Home className="w-5 h-5" />
              <span className="sm:hidden">Home</span>
            </Link>
            <Link to="/cars" className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600">
              Browse Cars
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">Joined: {joinDate}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditingProfile && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              <button
                onClick={() => {
                  // TODO: Implement profile update API
                  toast.success('Profile updated successfully');
                  setIsEditingProfile(false);
                }}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cars</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCars}</p>
              </div>
              <Car className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCars}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sold Cars</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.soldCars}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto whitespace-nowrap -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Cars
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'requests'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Buy Requests ({stats.pendingRequests})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">My Car Listings</h3>
                  <Link
                    to="/cars/create"
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Car
                  </Link>
                </div>

                {userCars.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't listed any cars yet</p>
                    <Link
                      to="/cars/create"
                      className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      List Your First Car
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userCars.map((car) => (
                      <div
                        key={car._id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
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
                              <Car className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          {car.isSold && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Sold
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-lg text-gray-900">
                            {car.brand} {car.model}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {car.year} • {car.mileage.toLocaleString()} km
                          </p>
                          <p className="text-xl font-bold text-indigo-600 mt-2">
                            ${car.price.toLocaleString()}
                          </p>
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <Link
                              to={`/cars/${car._id}/edit`}
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteCar(car._id)}
                              className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Buy Requests</h3>
                {sellerRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No buy requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sellerRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg text-gray-900">
                                {request.car?.brand} {request.car?.model}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  request.status === 'pending'
                                    ? 'bg-orange-100 text-orange-700'
                                    : request.status === 'accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {request.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              From: <span className="font-medium">{request.buyer?.name}</span> ({request.buyer?.email})
                            </p>
                            {request.message && (
                              <p className="text-sm text-gray-600 mt-2">"{request.message}"</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Requested: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                              <button
                                onClick={() => handleAcceptRequest(request._id)}
                                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineRequest(request._id)}
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
