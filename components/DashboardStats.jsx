'use client';

import { Calendar, Users, Clock, CheckCircle, XCircle, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardStats({ stats, isLoading = false }) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Today\'s Bookings',
      value: stats?.todayBookings || 0,
      icon: Clock,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completed',
      value: stats?.completedBookings || 0,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Cancelled',
      value: stats?.cancelledBookings || 0,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Rescheduled',
      value: stats?.rescheduledBookings || 0,
      icon: RefreshCw,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ? `₱${stats.totalRevenue.toLocaleString()}` : '₱0',
      icon: DollarSign,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Avg Rating',
      value: stats?.averageRating ? `${stats.averageRating}/5.0` : 'N/A',
      icon: TrendingUp,
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      bgColor: 'bg-pink-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card p-3 sm:p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full ml-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="card p-3 sm:p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mb-1">{stat.title}</p>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 truncate">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${stat.color} flex-shrink-0 ml-2`}>
                <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

