// src/component/ProfileSidebar.js
import React from 'react';
import { User, ShoppingBag, MapPin, Heart, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { id: 'profile', label: 'Profil Bilgileri', icon: User },
  { id: 'orders', label: 'Siparişlerim', icon: ShoppingBag },
  { id: 'addresses', label: 'Adreslerim', icon: MapPin },
  { id: 'favorites', label: 'Favorilerim', icon: Heart },
  { id: 'settings', label: 'Hesap Ayarları', icon: Settings }
];

const ProfileSidebar = ({ keycloakUserInfo, userInfo, activeTab, setActiveTab, handleLogout }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {keycloakUserInfo?.firstName?.charAt(0) || keycloakUserInfo?.username?.charAt(0) || userInfo.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {keycloakUserInfo?.firstName && keycloakUserInfo?.lastName 
                ? `${keycloakUserInfo.firstName} ${keycloakUserInfo.lastName}`
                : keycloakUserInfo?.username || userInfo.name
              }
            </h2>
            <p className="text-gray-600 text-sm">{keycloakUserInfo?.email || userInfo.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-6"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;