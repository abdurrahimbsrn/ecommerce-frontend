// src/component/ProfileOrdersTab.js
import React from 'react';
import { Package } from 'lucide-react';

const ProfileOrdersTab = () => {
  const orders = [
    {
      id: '#ORD-2025-001',
      date: '2025-01-20',
      status: 'Teslim Edildi',
      statusColor: 'text-green-600',
      statusBg: 'bg-green-100',
      total: 2999,
      items: 3,
      products: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 52999 },
        { name: 'AirPods Pro', quantity: 1, price: 8999 }
      ]
    },
    {
      id: '#ORD-2025-002',
      date: '2025-01-18',
      status: 'Kargoda',
      statusColor: 'text-blue-600',
      statusBg: 'bg-blue-100',
      total: 1599,
      items: 2,
      products: [
        { name: 'Kitap Seti', quantity: 2, price: 299 }
      ]
    },
    {
      id: '#ORD-2025-003',
      date: '2025-01-15',
      status: 'Hazırlanıyor',
      statusColor: 'text-yellow-600',
      statusBg: 'bg-yellow-100',
      total: 899,
      items: 1,
      products: [
        { name: 'Bluetooth Hoparlör', quantity: 1, price: 899 }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.id}</h3>
                  <p className="text-gray-600 text-sm">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusBg} ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{order.total.toLocaleString('tr-TR')}₺</p>
                <p className="text-gray-600 text-sm">{order.items} ürün</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {order.products.map(p => p.name).join(', ')}
                </span>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Detay Görüntüle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrdersTab;