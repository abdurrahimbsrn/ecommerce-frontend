// src/component/ProfileInfoTab.js
import React from 'react';
import { Edit3, Save } from 'lucide-react';

const ProfileInfoTab = ({
    userInfo,           // Düzenleme modunda güncellenecek kullanıcı bilgileri (Profile.js'ten geliyor)
    setUserInfo,        // userInfo state'ini güncelleme fonksiyonu (Profile.js'ten geliyor)
    editMode,           // Düzenleme modunda mı? (Profile.js'ten geliyor)
    setEditMode,        // Düzenleme modunu açıp kapatma fonksiyonu (Profile.js'ten geliyor)
    handleSaveProfile,  // Kaydet butonuna basıldığında çağrılacak fonksiyon (Profile.js'ten geliyor)
    apiLoading,         // API çağrısı devam ediyor mu? (Profile.js'ten geliyor)
    error,              // API'den gelen hata (Profile.js'ten geliyor)
}) => {

    // Input alanlarındaki değişiklikleri userInfo state'ine yansıtan fonksiyon
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
                <button
                    onClick={() => setEditMode(!editMode)}
                    disabled={apiLoading}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {editMode ? 'İptal' : 'Düzenle'}
                </button>
            </div>

            {/* API Loading durumu */}
            {apiLoading && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">API çağrısı yapılıyor...</p>
                </div>
            )}

            {/* Error durumu */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-red-600 hover:text-red-700 font-medium"
                    >
                        Tekrar Dene
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input
                        type="text"
                        name="name" // 'name' attribute'u userInfo.name'i güncelleyecek
                        value={userInfo.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                    <input
                        type="text"
                        name="surname" // 'surname' attribute'u userInfo.surname'i güncelleyecek
                        value={userInfo.surname}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <input
                        type="email"
                        name="email" // 'email' attribute'u userInfo.email'i güncelleyecek
                        value={userInfo.email}
                        onChange={handleChange}
                        disabled={editMode}
                        className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                        type="tel"
                        name="phone" // 'phone' attribute'u userInfo.phone'u güncelleyecek
                        value={userInfo.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
                    />
                </div>
            </div>

            {editMode && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        disabled={apiLoading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileInfoTab;