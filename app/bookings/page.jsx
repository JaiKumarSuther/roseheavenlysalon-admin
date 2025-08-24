'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../lib/auth-store';
import { bookingsAPI } from '../../lib/api';
import AuthMiddleware from '../../components/AuthMiddleware.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import BookingCard from '../../components/BookingCard.jsx';
import { Search, RefreshCw, Filter, Calendar, Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('list');

  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadAllBookings();
  }, []);

  const loadAllBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getAllBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllBookings();
      return;
    }

    try {
      setIsLoading(true);
      const response = await bookingsAPI.searchBookings(searchQuery);
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error searching bookings:', error);
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
        loadAllBookings(); // Reload bookings to get updated list
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

  const getStats = () => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.remarks === 'done').length;
    const cancelled = bookings.filter(b => b.remarks === 'cancelled').length;
    const rescheduled = bookings.filter(b => b.remarks === 'rescheduled').length;
    const pending = total - completed - cancelled - rescheduled;

    return { total, completed, cancelled, rescheduled, pending };
  };

  const filteredBookings = getFilteredBookings();
  const stats = getStats();

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1  min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bookings Management</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage all customer bookings</p>
                </div>
                <button
                  onClick={loadAllBookings}
                  disabled={isLoading}
                  className="btn-secondary flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                  <div className="p-2 bg-green-500 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                  </div>
                  <div className="p-2 bg-red-500 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rescheduled</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rescheduled}</p>
                  </div>
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by customer name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {viewMode === 'list' ? 'All Bookings' : 'Calendar View'}
                </h2>
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
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found.</p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Calendar view coming soon...</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
