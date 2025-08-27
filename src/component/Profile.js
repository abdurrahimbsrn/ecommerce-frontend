// src/component/Profile.js
import React, { useState, useEffect } from 'react';
import { fetchKullanici, updateKullanici } from '../APIs/CategoriApi'; // updateKullanici'yi import ettik

// Alt bileşenleri import et
import ProfileSidebar from './ProfileTabs/ProfileSidebar';
import ProfileInfoTab from './ProfileTabs/ProfileInfoTab';
import ProfileOrdersTab from './ProfileTabs/ProfileOrdersTab';
import ProfileAddressesTab from './ProfileTabs/ProfileAddressesTab';
import ProfileFavoritesTab from './ProfileTabs/ProfileOrdersTab'; // Bu bileşen hala favorites verisine ihtiyaç duyabilir
import ProfileSettingsTab from './ProfileTabs/ProfileSettingsTab';

const Profile = ({ 
  // App.js'ten gelen props'lar
  login, 
  logout,
  getHeadersToken,
  keycloakUserInfo, 
  apiClient 
}) => {

  const [kullaniciData, setKullaniciData] = useState(null); // Backend'den gelen orijinal data
  const [userInfo, setUserInfo] = useState({ // Düzenlenebilir kullanıcı bilgileri
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]); // Adres verileri
  const [loading, setLoading] = useState(true); // Genel yüklenme durumu
  const [error, setError] = useState(null); // API hata mesajı
  const [apiLoading, setApiLoading] = useState(false); // API çağrısı devam ediyor mu?
  const [editMode, setEditMode] = useState(false); // Düzenleme modu açık mı?
  const [activeTab, setActiveTab] = useState('profile'); // Aktif sekme

  // --- API'den Kullanıcı Verilerini Çekme (İlk Yükleme) ---
  useEffect(() => {
    const getKullaniciData = async () => {
      setApiLoading(true); // API yüklemesini başlat
      try {
        const tokenHeader = getHeadersToken();
        
        if (!tokenHeader) {
          console.log('Token bulunamadı, giriş yap');
          login(); // Keycloak login sayfasına yönlendir
          return;
        }

        const result = await fetchKullanici(tokenHeader); // API çağrısı

        if (result.error) {
          console.error("API Hatası:", result.status, result.message);
          if (result.status === 401) {
            console.log("Kullanıcı yetkilendirme hatası - giriş sayfasına yönlendir");
            login();
          } else if (result.status === 403) {
            setError("Bu sayfaya erişim yetkiniz bulunmuyor.");
          } else {
            setError(result.message || "Bir hata oluştu");
          }
        } else {
          console.log("API'den gelen kullanıcı verisi:", result.data);
          setKullaniciData(result.data); // Orijinal backend verisini kaydet
          // Düzenlenebilir userInfo state'ini backend verileriyle başlat
          setUserInfo({
            name: result.data.ad || '',
            surname: result.data.soyad || '',
            email: result.data.email || '',
            phone: result.data.telefon || '',
          });
          // Adresleri de burada başlatabilirsin (eğer kullaniciData içinde geliyorsa)
          // setAddresses(result.data.addresses || []); 
          setError(null); // Hata yoksa temizle
        }
      } catch (err) {
        console.error('API çağrısı hatası:', err);
        setError("Sunucuya bağlanırken bir hata oluştu: " + err.message);
      } finally {
        setApiLoading(false); // API yüklemesini bitir
        setLoading(false);    // Genel yüklemeyi bitir
      }
    };

    // keycloakUserInfo mevcutsa (kullanıcı giriş yaptıysa) API çağrısını yap
    if (keycloakUserInfo) {
      getKullaniciData();
    } else {
      setLoading(false); // Giriş yapmadıysa yüklemeyi bitir
    }
  }, [keycloakUserInfo, getHeadersToken, login]); // keycloakUserInfo değiştiğinde çalışır

  // --- Profil Bilgilerini Güncelleme Fonksiyonu ---
  
const handleSaveProfile = async () => {
    setApiLoading(true);
    try {
      const tokenHeader = getHeadersToken();
      if (!tokenHeader) {
        console.error("Token bulunamadı, profil güncellenemez.");
        setApiLoading(false);
        setError("Token bulunamadı, lütfen tekrar giriş yapın.");
        return;
      }

      // Keycloak'tan gelen kullanıcı ID'sini al (bu backend'deki keycloakId'ye denk gelir)
      const userId = keycloakUserInfo?.sub; 
      if (!userId) {
        console.error("Keycloak kullanıcı ID'si bulunamadı, profil güncellenemez.");
        setApiLoading(false);
        setError("Kullanıcı ID'si alınamadı, lütfen tekrar giriş yapın.");
        return;
      }

      const updatedUserData = {
         ad: userInfo.name,
         soyad: userInfo.surname,
         email: userInfo.email,
         telefon: userInfo.phone,
      };
      
      // updateKullanici fonksiyonunu userId parametresiyle çağır
      const result = await updateKullanici(userId, updatedUserData, tokenHeader); 

      if (result.error) {
        throw new Error(result.message || `Profil güncelleme hatası: ${result.status}`);
      }

      console.log('Profil başarıyla güncellendi:', result.data);
      setKullaniciData(result.data); 
      setUserInfo({ 
        name: result.data.ad || '',
        surname: result.data.soyad || '',
        email: result.data.email || '',
        phone: result.data.telefon || '',
      });
      setEditMode(false);
      setError(null);
      
    } catch (err) {
      console.error('Profil güncelleme API hatası:', err);
      setError("Profil güncellenirken bir hata oluştu: " + err.message);
    } finally {
      setApiLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // App.js'ten gelen logout fonksiyonunu çağır
  };

  // Loading ekranı
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Aktif sekmeye göre içeriği render et
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfoTab
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            editMode={editMode}
            setEditMode={setEditMode}
            handleSaveProfile={handleSaveProfile}
            apiLoading={apiLoading}
            error={error}
            // keycloakUserInfo'yi artık bu bileşene pass etmiyoruz
            // kullaniciData'yı da artık input'lar için değil, başka bir yerde istersen kullan
          />
        );
      case 'orders':
        return <ProfileOrdersTab />; // orders prop'u ProfileOrdersTab'in içinde tanımlandı
      case 'addresses':
        return <ProfileAddressesTab addresses={addresses} setAddresses={setAddresses} />;
      case 'favorites':
        return <ProfileFavoritesTab />; 
      case 'settings':
        return <ProfileSettingsTab />;
      default:
        return (
          <ProfileInfoTab
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            editMode={editMode}
            setEditMode={setEditMode}
            handleSaveProfile={handleSaveProfile}
            apiLoading={apiLoading}
            error={error}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar bileşeni */}
          <ProfileSidebar
            keycloakUserInfo={keycloakUserInfo} // Sidebar hala Keycloak bilgisini gösterebilir
            userInfo={userInfo} // userInfo'yu sidebar'a da pass edebiliriz
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
          />

          {/* Ana İçerik alanı */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;