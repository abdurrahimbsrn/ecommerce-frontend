import {
    User, ShoppingBag, MapPin, Heart, Settings, LogOut, Edit3, Plus, Package, Truck, CheckCircle, XCircle, Star, Calendar, CreditCard, Bell, Shield, Eye, EyeOff, Save, Trash2,
    Printer
} from 'lucide-react';

const Profile = ({setEditMode, userInfo, setAddresses, addresses, editMode, setUserInfo, showPassword, setShowPassword, activeTab, setActiveTab, }) => {

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

  // Örnek favori ürünler
  const favorites = [
    {
      id: 1,
      name: 'MacBook Air M3',
      price: 42999,
      originalPrice: 45999,
      image: '💻',
      inStock: true
    },
    {
      id: 2,
      name: 'Sony WH-1000XM5',
      price: 8999,
      originalPrice: 9999,
      image: '🎧',
      inStock: true
    },
    {
      id: 3,
      name: 'Samsung Galaxy Watch',
      price: 3999,
      originalPrice: 4599,
      image: '⌚',
      inStock: false
    }
  ];

  const menuItems = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User },
    { id: 'orders', label: 'Siparişlerim', icon: ShoppingBag },
    { id: 'addresses', label: 'Adreslerim', icon: MapPin },
    { id: 'favorites', label: 'Favorilerim', icon: Heart },
    { id: 'settings', label: 'Hesap Ayarları', icon: Settings }
  ];

  const handleSaveProfile = () => {
    setEditMode(false);
    // API çağrısı burada yapılabilir
    console.log('Profil güncellendi:', userInfo);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {editMode ? 'İptal' : 'Düzenle'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
          <input
            type="date"
            value={userInfo.birthDate}
            onChange={(e) => setUserInfo({...userInfo, birthDate: e.target.value})}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
          <select
            value={userInfo.gender}
            onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
            disabled={!editMode}
            className={`w-full px-4 py-3 border rounded-lg ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-blue-500' : 'border-gray-200 bg-gray-50'}`}
          >
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
          </select>
        </div>
      </div>

      {editMode && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </button>
        </div>
      )}
    </div>
  );

  const renderOrdersTab = () => (
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

  const renderAddressesTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Adreslerim</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Adres Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Düzenle
              </button>
              {!address.isDefault && (
                <button 
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Sil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorilerim</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz favori ürününüz yok</h3>
          <p className="text-gray-600">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 text-center bg-gray-50">
                <div className="text-4xl mb-2">{product.image}</div>
                {!product.inStock && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    Stokta Yok
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{product.price.toLocaleString('tr-TR')}₺</span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-500 line-through ml-2 text-sm">
                        {product.originalPrice.toLocaleString('tr-TR')}₺
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    disabled={!product.inStock}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                      product.inStock 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Sepete Ekle
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Şifre Değiştir */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="Mevcut şifrenizi girin"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Yeni şifrenizi girin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre Tekrar</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Yeni şifrenizi tekrar girin"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Şifreyi Güncelle
          </button>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
              <p className="text-gray-600 text-sm">Sipariş durumu ve kampanya bildirimleri</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
              <p className="text-gray-600 text-sm">Önemli güncelleler için SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Hesap Güvenliği */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Güvenliği</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-green-900">E-posta Doğrulandı</h4>
                <p className="text-green-700 text-sm">Hesabınız e-posta ile doğrulanmış</p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'orders': return renderOrdersTab();
      case 'addresses': return renderAddressesTab();
      case 'favorites': return renderFavoritesTab();
      case 'settings': return renderSettingsTab();
      default: return renderProfileTab();
    }
  };


return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                {userInfo.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">{userInfo.name}</h2>
                                <p className="text-gray-600 text-sm">{userInfo.email}</p>
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

                            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-6">
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Çıkış Yap</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    </div>
);
}
export default Profile;