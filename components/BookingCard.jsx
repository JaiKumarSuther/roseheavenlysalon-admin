'use client';

import { format } from 'date-fns';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon,
  CheckCircle, 
  XCircle, 
  User,
  MessageSquare
} from 'lucide-react';

export default function BookingCard({ booking, onStatusUpdate }) {
  const formatTime = (timeString) => {
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      return format(time, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (booking) => {
    // Check status field first, then fall back to remarks
    if (booking.status === 0) return 'border-l-4 border-red-500';
    if (booking.status === 2) return 'border-l-4 border-green-500';
    
    // Fall back to remarks parsing
    if (!booking.remarks) return 'border-l-4 border-yellow-500';
    if (booking.remarks.toLowerCase().includes('done')) return 'border-l-4 border-green-500';
    if (booking.remarks.toLowerCase().includes('cancelled')) return 'border-l-4 border-red-500';
    return 'border-l-4 border-yellow-500';
  };

  const getStatusBadge = (booking) => {
    // Check status field first, then fall back to remarks
    if (booking.status === 0) return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
    if (booking.status === 2) return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    
    // Fall back to remarks parsing
    if (!booking.remarks) return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (booking.remarks.toLowerCase().includes('done')) return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    if (booking.remarks.toLowerCase().includes('cancelled')) return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
    return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
  };

  const statusBadge = getStatusBadge(booking);

  return (
    <div className={`card p-3 sm:p-4 lg:p-6 ${getStatusColor(booking)} hover:shadow-lg transition-all duration-200`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{booking.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 mb-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-medium">{formatTime(booking.time)}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{formatDate(booking.date)}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700">
          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{booking.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700">
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
          <span>{booking.phone}</span>
        </div>
      </div>

      {/* Services */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 mb-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium">Services:</span>
        </div>
        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-800 font-medium truncate">{booking.service1}</p>
          {booking.service2 && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">+ {booking.service2}</p>
          )}
        </div>
      </div>

      {/* Remarks */}
      {booking.remarks && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 mb-2">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium">Notes:</span>
          </div>
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-200">
            <p className="text-xs sm:text-sm text-gray-800 break-words">{booking.remarks}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onStatusUpdate(booking.id, 'done')}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
        >
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>Done</span>
        </button>
        <button
          onClick={() => onStatusUpdate(booking.id, 'cancelled')}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
        >
          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>Cancel</span>
        </button>

      </div>
    </div>
  );
}

