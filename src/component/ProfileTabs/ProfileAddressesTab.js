// src/component/ProfileAddressesTab.js
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AddressForm from './AddressForm';

const ProfileAddressesTab = ({ addresses, setAddresses }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleAddAddress = (newAddress) => {
    const newId = addresses.length > 0 ? Math.max(...addresses.map(addr => addr.id)) + 1 : 1;
    setAddresses(prevAddresses => [...prevAddresses, { ...newAddress, id: newId, isDefault: false }]); // Yeni adres varsayılan değil
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };
  
  // TODO: Adresi düzenleme ve varsayılan yapma fonksiyonlarını buraya ekleyebilirsin
  const handleEditAddress = (editedAddress) => {
    setAddresses(prevAddresses => prevAddresses.map(addr => 
      addr.id === editedAddress.id ? editedAddress : addr
    ));
    // Eğer düzenleme formunu açıp kapamak istiyorsan, ilgili state'i burada yönetmelisin.
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(prevAddresses => prevAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId // Sadece seçilen adresi varsayılan yap
    })));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Adreslerim</h2>
        {!showAddressForm && (
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            onClick={() => setShowAddressForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Adres Ekle
          </button>
        )}
      </div>

      {showAddressForm && (
        <AddressForm onSave={handleAddAddress} onCancel={() => setShowAddressForm(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {addresses.map((address) => (
          <div key={address.id} className={`border-2 rounded-lg p-6 ${address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{address.title}</h3>
              {address.isDefault && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  Varsayılan
                </span>
              )}
            </div>

            <div className="text-gray-600 space-y-1 mb-4">
              <p className="font-medium">{address.name}</p>
              <p>{address.address}</p>
              <p>{address.district} / {address.city} {address.zipCode}</p>
              <p>{address.phone}</p>
            </div>

            <div className="flex space-x-3">
              <button 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                onClick={() => alert("Düzenleme fonksiyonu eklenecek")} // TODO: Düzenleme formu aç
              >
                Düzenle
              </button>
              {!address.isDefault && (
                <>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Sil
                  </button>
                  <button
                    onClick={() => handleSetDefaultAddress(address.id)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Varsayılan Yap
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileAddressesTab;