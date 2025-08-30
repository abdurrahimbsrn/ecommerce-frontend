import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { fetchOrdersByUserId } from '../../APIs/OrderApi';
import KeycloakService from '../../KeycloakService';

const ProfileOrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den veri çeken fonksiyon
  useEffect(() => {
    const tokenHeader = KeycloakService.getAuthorizationHeader();
    if (!tokenHeader) {
      setError('Kullanıcı yetkilendirmesi bulunamadı. Lütfen giriş yapın.');
      setLoading(false);
      return;
    }

    const result=fetchOrdersByUserId(tokenHeader);
    if(result.error){
      setError(result.message || 'Siparişler yüklenirken bir hata oluştu.');
      setLoading(false);
      return;
    }

    result.then(apiOrders => {
         // Eğer apiOrders bir array değilse, uygun şekilde işle
         const ordersArray = Array.isArray(apiOrders) ? apiOrders : (apiOrders?.data || []);
         // API'den gelen veriyi React state'e eşleme
         const mappedOrders = ordersArray.map(order => ({
           id: `#ORD-${order.siparisId}`,
           date: new Date(order.olusturmaTarihi).toLocaleDateString('tr-TR'),
           status: order.siparisDurumu,
           statusColor: getStatusColor(order.siparisDurumu),
           total: order.toplamFiyat,
           items: order.siparisKalemleri.length,
           products: order.siparisKalemleri.map(item => ({
             name: item.urunAd,
             quantity: item.miktar,
             price: item.urunFiyat,
           }))
         }));
         setOrders(mappedOrders);
         setLoading(false);
       })
       .catch(err => {
         setError(err.message);
         setLoading(false);
       });
     
  }, []);

  // API'den gelen duruma göre renk döndüren yardımcı fonksiyon
  const getStatusColor = (status) => {
    switch (status) {
      case 'TESLIM_EDILDI':
        return 'text-green-600';
      case 'KARGODA':
        return 'text-blue-600';
      case 'HAZIRLANIYOR':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'TESLIM_EDILDI':
        return 'bg-green-100';
      case 'KARGODA':
        return 'bg-blue-100';
      case 'HAZIRLANIYOR':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Yüklenme ve hata durumlarını yönetme
  if (loading) {
    return <div className="p-6 text-center">Siparişler yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Hata: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">Henüz siparişiniz bulunmamaktadır.</div>
      ) : (
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
      )}
    </div>
  );
};

export default ProfileOrdersTab;
