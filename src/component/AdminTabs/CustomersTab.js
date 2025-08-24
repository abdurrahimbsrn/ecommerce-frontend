import { useEffect, useState } from 'react';
import { fetchAllKullanici } from '../../Api'; // fetchAllKullanici'yi import et
import KeycloakService from '../../KeycloakService.js';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Ban,
    UserCheck
} from 'lucide-react';

// CustomersTab bileşeni artık App.js'ten getHeadersToken prop'unu alacak
const CustomersTab = ({ getHeadersToken, apiClient }) => {
    const [customers, setCustomers] = useState([]); // Statik listeyi boş başlattık
    const [loadingCustomers, setLoadingCustomers] = useState(true); // Yükleme durumu
    const [customersError, setCustomersError] = useState(null); // Hata durumu

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // --- Müşteri Listesini Veritabanından Çekme ---
    useEffect(() => {
        const loadCustomers = async () => {
            setLoadingCustomers(true);
            setCustomersError(null);
            try {
                const tokenHeader = KeycloakService.getAuthorizationHeader();
                if (!tokenHeader) {
                    console.error("CustomersTab: Token bulunamadı. Kullanıcı giriş yapmamış.");
                    setCustomersError("Giriş yapmanız gerekiyor. Lütfen admin girişi yapın.");
                    setLoadingCustomers(false);
                    return;
                }

                const result = await fetchAllKullanici(tokenHeader);

                if (result.error) {
                    console.error("CustomersTab: Müşteri listesi API hatası:", result.status, result.message);
                    setCustomersError(result.message || "Müşteriler yüklenirken bir hata oluştu.");
                } else {
                    // KullaniciDto listesini frontend customers formatına dönüştür
                    const formattedCustomers = result.data.map(kullanici => ({
                        id: kullanici.id,
                        name: `${kullanici.ad || ''} ${kullanici.soyad || ''}`.trim(), // Ad ve soyadı birleştir
                        email: kullanici.eposta,
                        phone: kullanici.telefon,
                        // Bu alanlar backend'den gelmiyorsa veya farklı isimdeyse güncelle
                        city: kullanici.adresBilgileri?.sehir || 'Bilinmiyor', // Varsayımsal adres bilgisi
                        totalOrders: kullanici.toplamSiparisSayisi || 0, // Varsayımsal sipariş bilgisi
                        totalSpent: kullanici.toplamHarcananTutar || 0, // Varsayımsal harcama bilgisi
                        status: kullanici.durum || 'active', // Varsayımsal durum bilgisi
                        joinDate: kullanici.uyelikTarihi || 'Yok' // Varsayımsal üyelik tarihi
                    }));
                    setCustomers(formattedCustomers);
                }
            } catch (err) {
                console.error("CustomersTab: Müşteri listesi yüklenirken beklenmeyen hata:", err);
                setCustomersError("Müşteri listesi yüklenirken bir sorun oluştu: " + err.message);
            } finally {
                setLoadingCustomers(false);
            }
        };

        loadCustomers();
    }, [getHeadersToken]); // getHeadersToken değiştiğinde yeniden çalış

    // --- Müşteri Silme Fonksiyonu ---
    const handleDeleteCustomer = (id) => {
        // !!! window.confirm() yerine bir modal UI kullanmalısın !!!
        if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
            // TODO: Backend API çağrısı ile müşteriyi sil
            console.log(`Müşteri ${id} silindi (backend çağrısı bekleniyor).`);
            setCustomers(customers.filter(u => u.id !== id)); // Frontend'den geçici olarak sil
        }
    };

    // --- Müşteri Durumunu Değiştirme Fonksiyonu ---
    const handleStatusChange = (customerId, newStatus) => {
        // TODO: Backend API çağrısı ile müşteri durumunu güncelle
        console.log(`Müşteri ${customerId} durumu '${newStatus}' olarak güncellendi (backend çağrısı bekleniyor).`);
        setCustomers(customers.map(customer =>
            customer.id === customerId
                ? { ...customer, status: newStatus }
                : customer
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'banned': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'inactive': return 'Pasif';
            case 'banned': return 'Engellenmiş';
            default: return status;
        }
    };

    if (loadingCustomers) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Müşteriler yükleniyor...</p>
            </div>
        );
    }

    if (customersError) {
        return (
            <div className="text-center py-12 text-red-600">
                <p>Hata: {customersError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">


            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Müşteri ara..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Tüm Durumlar</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Pasif</option>
                                <option value="banned">Engellenmiş</option>
                            </select>
                            <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtrele
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İletişim
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Şehir
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sipariş Sayısı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Toplam Harcama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Üyelik Tarihi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center mb-1">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                            {customer.email}
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {customer.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <ShoppingBag className="w-4 h-4 mr-2 text-gray-400" />
                                            {customer.totalOrders}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {customer.totalSpent.toLocaleString('tr-TR')}₺
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={customer.status}
                                            onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(customer.status)}`}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                            <option value="banned">Engellenmiş</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {customer.joinDate}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowCustomerModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-700"
                                                title="Düzenle"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-700"
                                                title="Detay Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={customer.status === 'banned' ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                                                title={customer.status === 'banned' ? "Engeli Kaldır" : "Engelle"}
                                                onClick={() => handleStatusChange(customer.id, customer.status === 'banned' ? 'active' : 'banned')}
                                            >
                                                {customer.status === 'banned' ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer.id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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

export default CustomersTab;