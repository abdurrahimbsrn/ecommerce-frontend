import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, User, X, Loader } from 'lucide-react';

// Sepet sayfası bileşeni
const CartPage = () => {
  // Sahte sepet verisi
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'T-shirt', price: 25.00, quantity: 2 },
    { id: 2, name: 'Jeans', price: 50.00, quantity: 1 },
    { id: 3, name: 'Sneakers', price: 80.00, quantity: 1 },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // %18 KDV
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Sepetim</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-gray-600 text-sm">{item.quantity} adet</p>
                </div>
                <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Sepetinizde ürün bulunmamaktadır.</p>
          )}
        </div>
        <div className="mt-6 border-t pt-6 space-y-2">
          <div className="flex justify-between font-medium text-gray-700">
            <span>Ara Toplam:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-gray-700">
            <span>KDV:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Toplam:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Ödeme Yap
        </button>
      </div>
    </div>
  );
};


// App bileşeni artık tek bir yerden export ediliyor
export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Sayfa yönlendirmesi için yeni state
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(null); // Mesaj kutusu için durum
  const [authenticated, setAuthenticated] = useState(false); // Keycloak doğrulama durumu
  const [loading, setLoading] = useState(false); // Yüklenme durumu için yeni state

  // Kategori verileri için yeni state'ler
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // Kategorilere atanacak renk paleti
  const categoryColors = [
    'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 'bg-purple-200 text-purple-800', 
    'bg-orange-200 text-orange-800', 'bg-red-200 text-red-800', 'bg-teal-200 text-teal-800'
  ];

  // Keycloak'u sadece bir kere başlatmak için useEffect kullanılıyor
  useEffect(() => {
    // Sahte Keycloak başlatma işlemi
    setTimeout(() => {
      setAuthenticated(true);
    }, 1000);

    // Kategori verilerini çekmek için API isteği
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        // Bu URL'i kendi arka uç kategoriler API'nizin adresiyle değiştirin
        const response = await fetch('http://localhost:8080/api/kategoriler');
        if (!response.ok) {
          throw new Error('Kategori verileri çekilirken bir hata oluştu.');
        }
        const data = await response.json();
        // Backendden gelen KategoriDto'daki alanları kullanıyoruz
        const formattedData = data.map(cat => ({
          id: cat.id,
          name: cat.kategoriAd,
          description: cat.aciklama,
          emoji: cat.emoji
        }));
        setCategories(formattedData);
      } catch (error) {
        setCategoriesError(error.message);
        console.error('Kategori verilerini çekerken hata:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();

  }, []); // Bağımlılık dizisi boş olduğu için sadece ilk render'da çalışır

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Yüklenme durumunu başlat
    setMessage(null); // Önceki mesajı temizle

    // Burası API'nizin gerçek adresi olmalı.
    const endpoint = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const successMessage = isLogin ? 'Giriş başarılı!' : 'Kayıt başarılı!';
        setMessage({ text: successMessage, type: 'success' });
        console.log('API yanıtı:', result);
      } else {
        const errorData = await response.json();
        const errorMessage = isLogin ? 'Giriş başarısız oldu.' : 'Kayıt başarısız oldu.';
        setMessage({ text: errorMessage + ' ' + (errorData.message || ''), type: 'error' });
        console.error('API hatası:', errorData);
      }
    } catch (error) {
      console.error('İstek sırasında bir hata oluştu:', error);
      setMessage({ text: 'Sunucuya bağlanırken bir hata oluştu.', type: 'error' });
    } finally {
      setLoading(false); // Yüklenme durumunu bitir
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };
  
  // Mesaj kutusunu kapatmak için fonksiyon
  const handleCloseMessage = () => {
    setMessage(null);
  };

  // Eğer Keycloak doğrulaması bekleniyorsa yükleme ekranı göster
  if (!authenticated && authenticated !== false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Basit yönlendirme için navigasyon */}
      <nav className="flex justify-center p-4">
        <button onClick={() => setCurrentPage('home')} className="px-4 py-2 mx-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Anasayfa
        </button>
        <button onClick={() => setCurrentPage('cart')} className="px-4 py-2 mx-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Sepetim
        </button>
      </nav>

      {/* Sayfa içeriği */}
      {currentPage === 'home' ? (
        <>
          {/* Diğer bileşenler buraya gelebilir */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">ShopZone</h1>
                <p className="text-gray-600">
                  {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
                </p>
              </div>

              {/* Mesaj Kutusu */}
              {message && (
                <div className={`bg-${message.type === 'success' ? 'green' : 'red'}-100 border-l-4 border-${message.type === 'success' ? 'green' : 'red'}-500 text-${message.type === 'success' ? 'green' : 'red'}-700 p-4 rounded-lg mb-4 flex items-center justify-between shadow-md`} role="alert">
                  <p>{message.text}</p>
                  <button onClick={handleCloseMessage} className={`text-${message.type === 'success' ? 'green' : 'red'}-700 hover:text-${message.type === 'success' ? 'green' : 'red'}-900`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">İsim Soyisim</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Adınızı girin"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Şifre</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Şifrenizi girin"
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

                  {!isLogin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">Şifre Tekrar</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Şifrenizi tekrar girin"
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
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                    disabled={loading} // Yüklenirken butonu devre dışı bırak
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader className="animate-spin w-5 h-5" />
                        <span>Yükleniyor...</span>
                      </div>
                    ) : (
                      isLogin ? 'Giriş Yap' : 'Hesap Oluştur'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                    <button
                      onClick={toggleMode}
                      className="ml-2 text-blue-600 font-medium hover:text-blue-800"
                    >
                      {isLogin ? 'Kayıt ol' : 'Giriş yap'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dinamik Kategori Bölümü */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
                <p className="text-gray-600 text-lg">Aradığınız ürünü kolayca bulun</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categoriesLoading ? (
                  <div className="col-span-full text-center py-8">
                    <Loader className="animate-spin mx-auto w-12 h-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">Kategoriler yükleniyor...</p>
                  </div>
                ) : categoriesError ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-red-500">Hata: Kategoriler yüklenemedi. Lütfen API'nizin çalıştığından emin olun.</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Henüz kategori bulunmuyor.</p>
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    >
                      <div className={`w-16 h-16 ${categoryColors[index % categoryColors.length]} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                        {category.emoji}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-500 text-sm">{category.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <CartPage />
      )}
    </div>
  );
}
