'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../lib/auth-store';
import { bookingsAPI, analyticsAPI } from '../../lib/api';
import AuthMiddleware from '../../components/AuthMiddleware.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import DashboardStats from '../../components/DashboardStats.jsx';
import BookingCard from '../../components/BookingCard.jsx';
import { Search, RefreshCw, Filter, AlertCircle, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only load data if user is authenticated
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [bookingsData, statsData] = await Promise.all([
        bookingsAPI.getTodayBookings(),
        analyticsAPI.getDashboardStats()
      ]);
      
      setBookings(bookingsData.data || []);
      setStats(statsData.data || {});
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDashboardData();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingsAPI.searchBookings(searchQuery);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error searching bookings:', error);
      setError('Failed to search bookings. Please try again.');
      toast.error('Failed to search bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, action) => {
    try {
      let response;
      switch (action) {
        case 'done':
          response = await bookingsAPI.markDone(bookingId);
          break;
        case 'cancelled':
          response = await bookingsAPI.markCancelled(bookingId);
          break;
        case 'rescheduled':
          response = await bookingsAPI.markRescheduled(bookingId);
          break;
        default:
          return;
      }

      if (response.status === 200) {
        toast.success(`Booking marked as ${action}`);
        // Reload dashboard data to get updated stats
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => {
      if (filter === 'pending') return !booking.remarks || booking.remarks === '';
      return booking.remarks === filter;
    });
  };

  const filteredBookings = getFilteredBookings();

  // Don't render if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={user} onLogout={handleLogout} />
        
        {/* Main content area with proper responsive spacing */}
        <div className="flex-1 lg:ml-64 min-w-0">
          {/* Header with mobile padding */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4 lg:pl-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.firstname || user?.username || 'Admin'}!</p>
                </div>
                <button
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  className="btn-secondary flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main content with responsive padding */}
          <main className="p-4 sm:p-6 lg:pl-6">
            {/* Dashboard Stats */}
            <DashboardStats stats={stats} isLoading={isLoading} />

            {/* Search and Filter Section */}
            <div className="card p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by customer name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="input-field pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input-field min-w-[120px]"
                    >
                      <option value="all">All Bookings</option>
                      <option value="pending">Pending</option>
                      <option value="done">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="btn-primary w-full sm:w-auto"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="card p-4 mb-6 sm:mb-8 bg-red-50 border border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Today's Bookings */}
            <div className="card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today's Bookings</h2>
                <span className="text-sm text-gray-500">
                  {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No bookings found</p>
                  <p className="text-gray-400 mt-2">
                    {searchQuery ? 'Try adjusting your search criteria.' : 'No bookings scheduled for today.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
