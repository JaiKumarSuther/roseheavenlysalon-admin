'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../../lib/auth-store';
import { usersAPI } from '../../../lib/api';
import AuthMiddleware from '../../../components/AuthMiddleware.jsx';
import Sidebar from '../../../components/Sidebar.jsx';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, MapPin, CheckCircle, Trash2 } from 'lucide-react';

export default function UserDetailPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: currentUser, logout } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getUserById(userId);
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user details');
      router.push('/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    try {
      const response = await usersAPI.verifyUser(userId);
      if (response.status === 200) {
        toast.success('User verified successfully');
        loadUser();
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await usersAPI.deleteUser(userId);
      if (response.status === 200) {
        toast.success('User deleted successfully');
        router.push('/users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (user) => {
    if (user.user_type === 'admin') {
      return { text: 'Admin', color: 'bg-purple-100 text-purple-800' };
    }
    if (user.code === 0) {
      return { text: 'Verified', color: 'bg-green-100 text-green-800' };
    }
    return { text: 'Unverified', color: 'bg-yellow-100 text-yellow-800' };
  };

  if (isLoading) {
    return (
      <AuthMiddleware>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar user={currentUser} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </AuthMiddleware>
    );
  }

  if (!user) {
    return (
      <AuthMiddleware>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar user={currentUser} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">User not found.</p>
              <button onClick={() => router.push('/users')} className="mt-4 btn-secondary">
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </AuthMiddleware>
    );
  }

  const statusBadge = getStatusBadge(user);

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={currentUser} onLogout={handleLogout} />
        <div className="flex-1 min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={() => router.push('/users')} className="btn-secondary flex items-center space-x-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Users</span>
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Details</h1>
                    <p className="text-sm sm:text-base text-gray-600">View user information and manage account</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="card p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{user.firstname} {user.lastname}</h2>
                      <p className="text-gray-600">@{user.username}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    {user.user_type !== 'admin' && user.code !== 0 && (
                      <button onClick={handleVerifyUser} className="btn-secondary flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verify User</span>
                      </button>
                    )}
                    {user.user_type !== 'admin' && (
                      <button onClick={handleDeleteUser} disabled={isDeleting} className="btn-danger flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete User'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{user.firstname} {user.lastname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900">@{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">User Type</label>
                      <p className="text-gray-900 capitalize">{user.user_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <p className="text-gray-900">{user.code === 0 ? 'Verified' : 'Unverified'}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <div className="flex items-center text-gray-900">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <div className="flex items-center text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {user.phone || 'Not provided'}
                      </div>
                    </div>
                    {user.address1 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div className="flex items-start text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                          {user.address1}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Created</label>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(user.updatedAt)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">User ID</label>
                      <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
