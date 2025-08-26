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
  Filter,
  ChevronUp,
  ChevronDown,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [sortBy, setSortBy] = useState('bookings'); // bookings, revenue, performance
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  
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

  // Sort services based on selected criteria
  const getSortedServices = () => {
    if (!analytics.topServices) return [];
    
    return [...analytics.topServices].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'bookings':
          aValue = a.bookings || 0;
          bValue = b.bookings || 0;
          break;
        case 'revenue':
          aValue = a.revenue || 0;
          bValue = b.revenue || 0;
          break;
        case 'performance':
          aValue = (a.bookings || 0) * (a.revenue || 0);
          bValue = (b.bookings || 0) * (b.revenue || 0);
          break;
        default:
          aValue = a.bookings || 0;
          bValue = b.bookings || 0;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  };

  // Chart configurations
  const monthlyRevenueChartData = {
    labels: analytics.monthlyData?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: analytics.monthlyData?.map(item => item.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Bookings',
        data: analytics.monthlyData?.map(item => item.bookings) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const monthlyRevenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue (PHP)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Bookings',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue & Bookings Trend',
        font: {
          size: 14,
        },
      },
    },
  };

  const bookingStatusChartData = {
    labels: ['Completed', 'Confirmed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [
          analytics.bookings?.completed || 0,
          analytics.bookings?.confirmed || 0,
          analytics.bookings?.pending || 0,
          analytics.bookings?.cancelled || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const bookingStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Booking Status Distribution',
        font: {
          size: 14,
        },
      },
    },
  };

  const topServicesChartData = {
    labels: getSortedServices().slice(0, 5).map(service => service.name),
    datasets: [
      {
        label: 'Bookings',
        data: getSortedServices().slice(0, 5).map(service => service.bookings),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const topServicesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Top 5 Services by Bookings',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Bookings',
        },
      },
    },
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Insights</h1>
                  <p className="text-sm sm:text-base text-gray-600">Business performance and customer insights</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="input-field min-w-[140px] text-sm"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <button
                    onClick={loadAnalytics}
                    disabled={isLoading}
                    className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto text-sm"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {/* Monthly Revenue Trend */}
                  <div className="card p-4 sm:p-6">
                    <div className="h-64 sm:h-80">
                      <Line data={monthlyRevenueChartData} options={monthlyRevenueChartOptions} />
                    </div>
                  </div>

                  {/* Booking Status Distribution */}
                  <div className="card p-4 sm:p-6">
                    <div className="h-64 sm:h-80">
                      <Doughnut data={bookingStatusChartData} options={bookingStatusChartOptions} />
                    </div>
                  </div>
                </div>

                {/* Top Services Chart */}
                <div className="card p-4 sm:p-6 mb-8">
                  <div className="h-64 sm:h-80">
                    <Bar data={topServicesChartData} options={topServicesChartOptions} />
                  </div>
                </div>

                {/* Top Services Table with Sorting */}
                <div className="card p-6 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Services</h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => handleSort(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 min-w-[100px]"
                        >
                          <option value="bookings">Bookings</option>
                          <option value="revenue">Revenue</option>
                          <option value="performance">Performance</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                          {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                      <button className="btn-secondary flex items-center justify-center space-x-2 text-sm">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th 
                            className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('bookings')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Bookings</span>
                              {getSortIcon('bookings')}
                            </div>
                          </th>
                          <th 
                            className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('revenue')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Revenue</span>
                              {getSortIcon('revenue')}
                            </div>
                          </th>
                          <th 
                            className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('performance')}
                          >
                            <div className="flex items-center space-x-1">
                              <span>Performance</span>
                              {getSortIcon('performance')}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getSortedServices().map((service, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 sm:px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 break-words">{service.name}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-4">
                              <div className="text-sm text-gray-900">{service.bookings}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-4">
                              <div className="text-sm text-gray-900">{formatCurrency(service.revenue)}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${(service.bookings / (getSortedServices()[0]?.bookings || 1)) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {Math.round((service.bookings / (getSortedServices()[0]?.bookings || 1)) * 100)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Avg. Booking Value</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(analytics.overview?.totalRevenue / (analytics.overview?.totalBookings || 1))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Completion Rate</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(((analytics.bookings?.completed || 0) / (analytics.overview?.totalBookings || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Cancellation Rate</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(((analytics.bookings?.cancelled || 0) / (analytics.overview?.totalBookings || 1)) * 100)}%
                        </span>
                      </div>
                    </div>
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
