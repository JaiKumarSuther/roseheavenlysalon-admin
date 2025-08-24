'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../lib/auth-store';
import { analyticsAPI } from '../../lib/api';
import AuthMiddleware from '../../components/AuthMiddleware.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Load all analytics data in parallel
      const [
        dashboardStats,
        bookingStats,
        revenueStats,
        customerStats,
        topServices,
        monthlyData,
        customerInsights
      ] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getBookingStats(timeRange),
        analyticsAPI.getRevenueStats(timeRange),
        analyticsAPI.getCustomerStats(),
        analyticsAPI.getTopServices(),
        analyticsAPI.getMonthlyStats(new Date().getFullYear()),
        analyticsAPI.getCustomerInsights()
      ]);

      setAnalytics({
        overview: dashboardStats.data || {},
        bookings: bookingStats.data || {},
        revenue: revenueStats.data || {},
        topServices: topServices.data || [],
        monthlyData: monthlyData.data || [],
        customerInsights: customerInsights.data || {}
      });
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />;
  };

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1  min-w-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Insights</h1>
                  <p className="text-sm sm:text-base text-gray-600">Business performance and customer insights</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="input-field min-w-[120px]"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <button
                    onClick={loadAnalytics}
                    disabled={isLoading}
                    className="btn-secondary flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-4 sm:p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            ) : (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.overview?.totalBookings || 0}</p>
                      </div>
                      <div className="p-3 bg-blue-500 rounded-full">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview?.totalRevenue || 0)}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getGrowthIcon(analytics.revenue?.growth || 0)}
                          <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue?.growth || 0)}`}>
                            {analytics.revenue?.growth || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-500 rounded-full">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.overview?.totalUsers || 0}</p>
                      </div>
                      <div className="p-3 bg-purple-500 rounded-full">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.overview?.averageRating || 0}</p>
                      </div>
                      <div className="p-3 bg-yellow-500 rounded-full">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Booking Status Chart */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Completed</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.bookings?.completed || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Pending</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.bookings?.pending || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Rescheduled</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.bookings?.rescheduled || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Cancelled</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{analytics.bookings?.cancelled || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Insights */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">New Customers</span>
                        <span className="text-sm font-medium text-gray-900">{analytics.customerInsights?.newCustomers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Returning Customers</span>
                        <span className="text-sm font-medium text-gray-900">{analytics.customerInsights?.returningCustomers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Avg. Visit Frequency</span>
                        <span className="text-sm font-medium text-gray-900">{analytics.customerInsights?.averageVisitFrequency || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Customer Satisfaction</span>
                        <span className="text-sm font-medium text-gray-900">{analytics.customerInsights?.customerSatisfaction || 0}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Services */}
                <div className="card p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Services</h3>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bookings
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.topServices?.map((service, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{service.bookings}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(service.revenue)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(service.bookings / (analytics.topServices[0]?.bookings || 1)) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {Math.round((service.bookings / (analytics.topServices[0]?.bookings || 1)) * 100)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Monthly Revenue Chart */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {analytics.monthlyData?.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(data.revenue / Math.max(...(analytics.monthlyData?.map(d => d.revenue) || [1]))) * 200}px` 
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
