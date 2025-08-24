'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '../../lib/auth-store';
import AuthMiddleware from '../../components/AuthMiddleware.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { 
  Settings, 
  User, 
  Shield, 
  Bell,
  Palette,
  Save,
  Eye,
  EyeOff,
  Camera,
  Key,
  Globe,
  Mail
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Manila'
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 min-w-0">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="h-20 w-20 bg-gradient-primary rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                          </div>
                          <button className="absolute -bottom-1 -right-1 p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user?.firstname} {user?.lastname}
                          </h3>
                          <p className="text-gray-600">{user?.email}</p>
                          <p className="text-sm text-gray-500">Admin User</p>
                        </div>
                      </div>

                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={profileForm.firstname}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, firstname: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={profileForm.lastname}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, lastname: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                            className="input-field"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex items-center space-x-2"
                          >
                            <Save className="h-4 w-4" />
                            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="input-field pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="input-field pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="input-field pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="btn-primary flex items-center space-x-2"
                            >
                              <Key className="h-4 w-4" />
                              <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <button className="btn-secondary">Enable</button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Session Management</p>
                              <p className="text-sm text-gray-500">View and manage active sessions</p>
                            </div>
                            <button className="btn-secondary">Manage</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                              <p className="text-sm text-gray-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={() => handleNotificationToggle('emailNotifications')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Booking Alerts</p>
                              <p className="text-sm text-gray-500">Get notified about new bookings</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.bookingAlerts}
                              onChange={() => handleNotificationToggle('bookingAlerts')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">System Updates</p>
                              <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.systemUpdates}
                              onChange={() => handleNotificationToggle('systemUpdates')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={appearanceSettings.theme}
                            onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                            className="input-field max-w-xs"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={appearanceSettings.language}
                            onChange={(e) => handleAppearanceChange('language', e.target.value)}
                            className="input-field max-w-xs"
                          >
                            <option value="en">English</option>
                            <option value="tl">Tagalog</option>
                            <option value="es">Spanish</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={appearanceSettings.timezone}
                            onChange={(e) => handleAppearanceChange('timezone', e.target.value)}
                            className="input-field max-w-xs"
                          >
                            <option value="Asia/Manila">Philippines (GMT+8)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="Europe/London">London</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button className="btn-primary flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save Preferences</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}

