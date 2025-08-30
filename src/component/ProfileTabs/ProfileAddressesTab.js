// src/component/ProfileAddressesTab.js
import React, { useState, useEffect } from 'react';
import { Edit3, MapPin, Save, X } from 'lucide-react';
import { fetchAddress, fetchSaveAddress } from '../../APIs/UserApi';
import KeycloakService from '../../KeycloakService';


const ProfileAddressesTab = ({}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [address, setAddresses] = useState([]);

  useEffect(() => {
  fetchAddress(KeycloakService.getAuthorizationHeader()).then(response => {
      if (!response.error) {
        setAddresses(response.data);
      }
    });
  }, []
  );

  // Düzenleme modunu başlat
  const handleStartEdit = () => {
    setEditingAddress(address ? { ...address } : {
      adresAdi: '',
      ulke: '',
      sehir: '',
      ilce: '',
      detay: ''
    });
    setIsEditing(true);
  };

  // Değişiklikleri kaydet
  const handleSave = () => {
    if (!editingAddress.adresAdi.trim()) {
      alert('Adres adı zorunludur!');
      return;
    }
    if (!editingAddress.ulke.trim()) {
      alert('Ülke zorunludur!');
      return;
    }
    if (!editingAddress.sehir.trim()) {
      alert('Şehir zorunludur!');
      return;
    }
    if (!editingAddress.ilce.trim()) {
      alert('İlçe zorunludur!');
      return;
    }
    if (!editingAddress.detay.trim()) {
      alert('Adres detayı zorunludur!');
      return;
    }

    setAddresses(editingAddress);
    const token=KeycloakService.getAuthorizationHeader();
    console.log(token);
    const response=fetchSaveAddress(token, editingAddress);
    if(!response.error){
      alert('Adres başarıyla kaydedildi!');
    } else {
      alert('Adres kaydedilirken bir hata oluştu: ' + response.message);
    }
    setIsEditing(false);
    setEditingAddress(null);
  };

  // Düzenlemeyi iptal et
  const handleCancel = () => {
    setIsEditing(false);
    setEditingAddress(null);
  };

  // Input değişikliklerini handle et
  const handleInputChange = (field, value) => {
    setEditingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-blue-600" />
          Adresim
        </h2>
        {!isEditing && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            onClick={handleStartEdit}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {address ? 'Adresi Düzenle' : 'Adres Ekle'}
          </button>
        )}
      </div>

      {isEditing ? (
        /* Düzenleme Formu */
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adres Adı */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres Adı *
              </label>
              <input
                type="text"
                value={editingAddress?.adresAdi || ''}
                onChange={(e) => handleInputChange('adresAdi', e.target.value)}
                placeholder="Ev, İş, vb."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ülke */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ülke *
              </label>
              <input
                type="text"
                value={editingAddress?.ulke || ''}
                onChange={(e) => handleInputChange('ulke', e.target.value)}
                placeholder="Türkiye"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Şehir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir *
              </label>
              <input
                type="text"
                value={editingAddress?.sehir || ''}
                onChange={(e) => handleInputChange('sehir', e.target.value)}
                placeholder="İstanbul"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* İlçe */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlçe *
              </label>
              <input
                type="text"
                value={editingAddress?.ilce || ''}
                onChange={(e) => handleInputChange('ilce', e.target.value)}
                placeholder="Kadıköy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Detay */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres Detayı *
              </label>
              <textarea
                value={editingAddress?.detay || ''}
                onChange={(e) => handleInputChange('detay', e.target.value)}
                placeholder="Mahalle, sokak, apartman, daire no vb. detayları giriniz"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Butonları */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </button>
          </div>
        </div>
      ) : (
        /* Adres Görüntüleme */
        <div>
          {address ? (
            <div className="max-w-md">
              <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900 text-lg">{address.adresAdi}</h3>
                </div>
                
                <div className="text-gray-700 space-y-2">
                  <p className="flex items-start">
                    <span className="font-medium text-gray-900 w-16 inline-block">Ülke:</span>
                    <span>{address.ulke}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-900 w-16 inline-block">Şehir:</span>
                    <span>{address.sehir}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-900 w-16 inline-block">İlçe:</span>
                    <span>{address.ilce}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium text-gray-900 w-16 inline-block">Detay:</span>
                    <span>{address.detay}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Adres Yoksa */
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz adres eklenmemiş</h3>
              <p className="text-gray-600 mb-6">Sipariş verebilmek için bir adres eklemeniz gerekiyor.</p>
              <button
                onClick={handleStartEdit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <MapPin className="w-5 h-5 mr-2" />
                İlk Adresini Ekle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileAddressesTab;