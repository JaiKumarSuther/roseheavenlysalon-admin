'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../lib/auth-store';
import { usersAPI } from '../../lib/api';
import AuthMiddleware from '../../components/AuthMiddleware.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { Search, RefreshCw, User, Mail, Phone, Calendar, Shield, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    try {
      setIsLoading(true);
      const response = await usersAPI.searchUsers(searchQuery);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      const response = await usersAPI.verifyUser(userId);
      if (response.status === 200) {
        toast.success('User verified successfully');
        loadUsers(); // Reload users to update the list
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await usersAPI.deleteUser(userId);
      if (response.status === 200) {
        toast.success('User deleted successfully');
        loadUsers(); // Reload users to update the list
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getFilteredUsers = () => {
    let filtered = users;
    
    if (filter !== 'all') {
      filtered = users.filter(user => {
        if (filter === 'verified') return user.code === 0;
        if (filter === 'unverified') return user.code !== 0;
        if (filter === 'admin') return user.user_type === 'admin';
        return true;
      });
    }
    
    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const filteredUsers = getFilteredUsers();

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1  min-w-0">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage all registered users</p>
                </div>
                <button
                  onClick={loadUsers}
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
            {/* Search and Filter Section */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="input-field min-w-[120px]"
                    >
                      <option value="all">All Users</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                      <option value="admin">Admins</option>
                    </select>
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

            {/* Users Table */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => {
                        const statusBadge = getStatusBadge(user);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstname} {user.lastname}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @{user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-900">
                                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                  {user.email}
                                </div>
                                {user.phone && (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                    {user.phone}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                {formatDate(user.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => router.push(`/users/${user.id}`)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => router.push(`/users/${user.id}/edit`)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Edit User"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {user.user_type !== 'admin' && user.code !== 0 && (
                                  <button
                                    onClick={() => handleVerifyUser(user.id)}
                                    className="text-green-600 hover:text-green-900"
                                    title="Verify User"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                {user.user_type !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
