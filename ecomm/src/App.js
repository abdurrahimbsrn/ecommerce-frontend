import React, { useState, useEffect } from 'react';
import Keycloak from "keycloak-js";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, User, X } from 'lucide-react';
import './App.css'; // Tailwind CSS direktifleri bu dosyaya eklenmeli

// App bileşeni artık tek bir yerden export ediliyor
export default function App() {
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

  // Keycloak'u sadece bir kere başlatmak için useEffect kullanılıyor
  useEffect(() => {
    const keycloak = new Keycloak({
      url: "http://localhost:8080/",
      realm: "ecommerce",
      clientId: "frontend-client"
    });

    keycloak.init({ onLoad: "login-required" }).then(auth => {
      setAuthenticated(auth);
      if (auth) {
        localStorage.setItem("token", keycloak.token);
        console.log("Giriş başarılı, token:", keycloak.token);
      }
    }).catch(error => {
      console.error("Keycloak başlatılırken hata oluştu:", error);
    });
  }, []); // Bağımlılık dizisi boş olduğu için sadece ilk render'da çalışır

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form gönderildi:', formData);

    // Basit bir örnek mesaj kutusu
    const submitMessage = isLogin ? 'Giriş başarılı!' : 'Kayıt başarılı!';
    setMessage({ text: submitMessage, type: 'success' });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4 flex items-center justify-between shadow-md" role="alert">
            <p>{message.text}</p>
            <button onClick={handleCloseMessage} className="text-green-700 hover:text-green-900">
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
            >
              {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
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
  );
}
