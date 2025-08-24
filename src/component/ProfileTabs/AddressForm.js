// src/component/AddressForm.js

import React, { useState } from 'react';

const AddressForm = ({ onSave, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    name: initialData.name || '',
    address: initialData.address || '',
    district: initialData.district || '',
    city: initialData.city || '',
    zipCode: initialData.zipCode || '',
    phone: initialData.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <form onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-4">Yeni Adres Ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Adres Başlığı (örn: Ev, İş)"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad Soyad"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Açık Adres"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            required
          />
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="İlçe"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Şehir"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Posta Kodu"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telefon Numarası"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Adresi Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;