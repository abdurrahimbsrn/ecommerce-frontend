import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.js';
import AdminLayout from './layouts/AdminLayout.js';
import Profile from "./component/Profile.js";
import Home from "./component/Home.js";
import Cart from "./component/Cart.js";
import CategoryProducts from './component/CategoryProducts';
import Favorites from "./component/Home.js"; // Muhtemelen ayrı bir Favorites bileşeni olmalı
import Search from "./component/Home.js";     // Muhtemelen ayrı bir Search bileşeni olmalı
import KeycloakService from './KeycloakService.js';
//import AdminPanel from "./component/Admin.js"
import axios from 'axios';
import AdminPanel from './component/Admin.js';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: 'http://localhost:8081', // Backend API Gateway URL'inizi buraya yazın
});

export default function App() {
  // Keycloak state'leri
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keycloakUserInfo, setKeycloakUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // KeycloakService.initKeycloak() metodunun sadece bir kez çağrıldığından emin olmak için useRef kullanıyoruz.
  const initialized = useRef(false);

  useEffect(() => {
    // Sadece bir kez başlatılmasını garanti ediyoruz (StrictMode nedeniyle çift render'ı engeller)
    if (!initialized.current) {
      initialized.current = true; // İlk çağrı yapıldı olarak işaretle
      initializeKeycloak();
    }
  }, []); // Boş bağımlılık dizisi, sadece bileşen monte edildiğinde çalışır

  const initializeKeycloak = async () => {
    try {
      const authenticated = await KeycloakService.initKeycloak();

      // Keycloak event listener'ları ekle
      // Bu listener'lar Keycloak init olduktan sonra eklenmeli
      KeycloakService.addEventListeners();

      if (authenticated) {
        setIsAuthenticated(true);
        setKeycloakUserInfo(KeycloakService.getUserInfo());
        KeycloakService.setupAxiosInterceptors(apiClient);
        console.log('Keycloak: Kullanıcı girişi yapıldı:', KeycloakService.getUserInfo());
      } else {
        console.log('Keycloak: Kullanıcı giriş yapmamış veya oturum süresi dolmuş.');
        // Eğer check-sso başarısız olursa ve kullanıcı giriş yapmamışsa,
        // burada kullanıcıyı giriş yapmaya teşvik edebilirsiniz veya login sayfasına yönlendirebilirsiniz.
        // Mevcut logic'te profile için bir login butonu zaten var.
      }

    } catch (error) {
      console.error('Keycloak initialization error:', error);
      // Keycloak başlatma hatası durumunda kullanıcıya hata mesajı gösterilebilir.
      // Örneğin: setGlobalError("Kimlik doğrulama servisine bağlanılamıyor.");
    } finally {
      setLoading(false); // Yükleme durumu bitti
    }
  };

  const handleLogin = () => {
    KeycloakService.login();
  };

  const handleLogout = () => {
    // Keycloak'ın kendi logout metodunu kullan
    // Bu, Keycloak oturumunu sonlandırır ve kullanıcıyı redirectUri'ye yönlendirir.
    // Uygulamanın state'leri Keycloak'ın logout event'i tetiklendiğinde veya
    // yönlendirme sonrası App yeniden yüklendiğinde güncellenecektir.
    KeycloakService.logout();
  };

  const handleGetAuthHeader = () => {
    return KeycloakService.getAuthorizationHeader();
  };
  const handlerGetRole = (role) => {
    return KeycloakService.hasRole(role);
  }

  // --- Diğer Global State'ler ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Kullanıcı verileri (bu veriler profile sayfasında backend'den güncellenebilir)
  const [userInfo2, setUserInfo2] = useState(() => ({
    name: keycloakUserInfo ? `${keycloakUserInfo.firstName || ''} ${keycloakUserInfo.lastName || ''}`.trim() : 'Kullanıcı',
    email: keycloakUserInfo?.email || '',
    phone: '+90 555 123 45 67',
    birthDate: '1990-01-15',
    gender: 'Erkek'
  }));

  // Keycloak user info değiştiğinde local user info'yu güncelle
  useEffect(() => {
    if (keycloakUserInfo) {
      setUserInfo2(prev => ({
        ...prev,
        name: `${keycloakUserInfo.firstName || ''} ${keycloakUserInfo.lastName || ''}`.trim() || prev.name,
        email: keycloakUserInfo.email || prev.email
      }));
    }
  }, [keycloakUserInfo]);

  // Adres verileri
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Ev Adresim',
      name: userInfo2.name,
      address: 'Cumhuriyet Mahallesi, Atatürk Caddesi No: 123',
      district: 'Gebze',
      city: 'Kocaeli',
      zipCode: '41400',
      phone: '+90 555 123 45 67',
      isDefault: true
    }
  ]);


  // userInfo2'nin ilk değeri Keycloak'tan gelmediği için burada da bir useEffect gerekebilir
  useEffect(() => {
    if (userInfo2.name !== 'Kullanıcı' && addresses[0].name === 'Kullanıcı') {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        name: userInfo2.name
      })));
    }
  }, [userInfo2.name, addresses]);

  // Loading ekranı
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Keycloak yükleniyor...</p>
        </div>
      </div>
    );
  }


  return (
    <AppRouter
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isAuthenticated={isAuthenticated}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      keycloakUserInfo={keycloakUserInfo}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      handlerGetRole={(role) => role === "admin"} // test için basitçe
    />
  );
}
function AppRouter(props) {
  return (
    <Router>
      <Routes>
        {/* Normal sayfalar */}
        <Route element={<MainLayout {...props} />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
            <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search searchQuery={props.searchQuery} />} />
          <Route path="/profile" element={
            props.isAuthenticated ? (
              <Profile
                userInfo={props.userInfo2}
                setUserInfo={props.setUserInfo2}
                addresses={props.addresses}
                setAddresses={props.setAddresses}
                editMode={props.editMode}
                setEditMode={props.setEditMode}
                activeTab={props.activeTab}
                setActiveTab={props.setActiveTab}
                showPassword={props.showPassword}
                setShowPassword={props.setShowPassword}
                getHeadersToken={props.handleGetAuthHeader}
                login={props.handleLogin}
                logout={props.handleLogout}
                keycloakUserInfo={props.keycloakUserInfo}
                apiClient={props.apiClient}
              />
            ) : (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h2>
                  <p className="text-gray-600 mb-6">Profile sayfasına erişmek için lütfen giriş yapın.</p>
                  <button
                    onClick={props.handleLogin}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Keycloak ile Giriş Yap
                  </button>
                </div>
              </div>
            )
          } />
        </Route>

        {/* Admin sayfaları */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={props.handlerGetRole("admin") ? <AdminPanel /> : <Home />} />
        </Route>
      </Routes>
    </Router>
  );
}