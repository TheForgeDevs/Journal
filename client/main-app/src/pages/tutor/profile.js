import { useState, useEffect } from 'react';
import axios from 'axios';
import TutorLayout from '@/components/tutor/TutorLayout';
import { useAuth } from '../../context/AuthContext';

export default function TutorProfile() {
  const { user, checkUserLoggedIn } = useAuth(); // checkUserLoggedIn to refresh context after update
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '', // Email is usually read-only
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // 1. Update Basic Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/updatedetails', formData, { 
        withCredentials: true 
      });
      alert("Profile updated successfully!");
      checkUserLoggedIn(); // Refresh global state
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload Avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert("Profile picture updated!");
      checkUserLoggedIn(); // Refresh image in sidebar/header
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // 3. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/password', passData, { 
        withCredentials: true 
      });
      alert("Password changed successfully");
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <TutorLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        {/* Profile Header & Avatar */}
        <div className="bg-white p-8 rounded-2xl shadow-sm flex items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100">
              <img 
                src={user?.avatar || "/images/default-user.svg"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition shadow-md">
              <img src="/icons/camera.svg" alt="Edit" className="w-4 h-4 text-white" /> 
              {/* If you don't have an icon, use text like '📷' */}
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.role?.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Edit Details Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-6">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-6">Security</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </TutorLayout>
  );
}