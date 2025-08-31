import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { fetchAllOrders } from '../../APIs/OrderApi.js';
import KeycloakService from '../../KeycloakService';

import { Package } from "lucide-react";


const OrdersTab = ({ Search, orders, getStatusColor }) => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const tokenHeader = KeycloakService.getAuthorizationHeader();
        if (!tokenHeader) {
            setError('Kullanıcı yetkilendirmesi bulunamadı. Lütfen giriş yapın.');
            setLoading(false);
            return;
        }

        const result = fetchAllOrders(tokenHeader);
        if (result.error) {
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
            setAllOrders(mappedOrders);
            setLoading(false);
        })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-red-500">Hata: {error}</div>;
    }
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sipariş No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün Sayısı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutar
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allOrders.map((order) => (
                                <tr key={order.id} className="border border-gray-200 rounded-lg">
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.items} ürün</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{order.total.toLocaleString('tr-TR')}₺</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-600">
                                                {order.products.map(p => p.name).join(', ')}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default OrdersTab;