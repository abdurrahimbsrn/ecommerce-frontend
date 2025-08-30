// src/component/Profile.js
import React, { useState, useEffect } from 'react';

// Alt bileşenleri import et
import ProfileSidebar from './ProfileTabs/ProfileSidebar';
import ProfileInfoTab from './ProfileTabs/ProfileInfoTab';
import ProfileOrdersTab from './ProfileTabs/ProfileOrdersTab';
import ProfileAddressesTab from './ProfileTabs/ProfileAddressesTab';
//import ProfileFavoritesTab from './ProfileTabs/ProfileFavoritesTab'; // Düzenlendi: Kendi dosyasından import ediliyor
import ProfileSettingsTab from './ProfileTabs/ProfileSettingsTab';
import { fetchKullanici, updateKullanici } from '../APIs/UserApi';
import KeycloakService from '../KeycloakService';

const Profile = ({
  login,
  logout
}) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Kullanıcı verilerini sadece bileşen ilk yüklendiğinde çek
  useEffect(() => {
    let isMounted = true; // Bileşenin mount durumunu takip etmek için bayrak

    const getKullaniciData = async () => {
      setApiLoading(true);
      try {
        const tokenHeader = KeycloakService.getAuthorizationHeader();

        // Eğer token yoksa, kullanıcıyı giriş sayfasına yönlendir ve fonksiyondan çık
        if (!tokenHeader) {
          console.log('Token bulunamadı. Kullanıcı giriş sayfasına yönlendiriliyor.');
          if (isMounted) {
            login(); // login() bir yönlendirme (redirect) yaptığı varsayılır
            setLoading(false); // Yükleme durumunu kapat
          }
          return; // Token yoksa API çağrısı yapma
        }

        const result = await fetchKullanici(tokenHeader);

        if (!isMounted) return;

        if (result.error) {
          console.error("API Hatası:", result.status, result.message);
          if (result.status === 401 || result.status === 403) {
            setError("Yetkilendirme hatası. Lütfen tekrar giriş yapın.");
            logout(); // Yetkilendirme hatasında çıkış yap
          } else {
            setError(result.message || "Profil verileri yüklenirken bir hata oluştu.");
          }
        } else {
          // API'den gelen alan adlarını `userInfo` state'indeki alan adlarıyla eşleştir
          setUserInfo({
            name: result.data.ad ?? '',      // `ad` alanını kullan, yoksa boş string
            surname: result.data.soyad ?? '', // `soyad` alanını kullan, yoksa boş string
            email: result.data.eposta ?? '',  // Düzeltildi: `eposta` alanını kullan
            phone: result.data.telefon ?? '', // `telefon` alanını kullan, yoksa boş string
          });
          // Eğer adresler API'den geliyorsa bu satırı aktif edin:
          // setAddresses(result.data.adresler ?? []); 
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('API çağrısı hatası:', err);
        setError("Sunucuya bağlanırken bir hata oluştu: " + err.message);
      } finally {
        if (isMounted) {
          setApiLoading(false);
          setLoading(false);
        }
      }
    };
    const setAddresses = (addresses) => {

    };

    // Effect'in sadece bileşen ilk yüklendiğinde bir kez çalışmasını sağla
    // login ve logout fonksiyonlarının stabil (useCallback ile sarılmış) olduğunu varsayarız
    // veya login'in bir yönlendirme yaptığını varsayarız.
    getKullaniciData();

    // Cleanup fonksiyonu: Bileşen unmount olduğunda isMounted bayrağını false yap
    return () => {
      isMounted = false;
    };
  }, []); // Boş bağımlılık dizisi: Sadece bir kez çalışır

  // Profil bilgilerini güncelleme fonksiyonu
  const handleSaveProfile = async () => {
    setApiLoading(true);
    try {
      const tokenHeader = KeycloakService.getAuthorizationHeader();
      const userInfoFromKeycloak = KeycloakService.getUserInfo();
      const userId = userInfoFromKeycloak?.sub;

      if (!tokenHeader || !userId) {
        console.error("Yetkilendirme bilgileri eksik. Profil güncellenemez.");
        setError("Yetkilendirme hatası. Lütfen tekrar giriş yapın.");
        setApiLoading(false);
        login(); // Eksik yetkilendirmede login sayfasına yönlendir
        return;
      }

      const updatedUserData = {
        ad: userInfo.name,
        soyad: userInfo.surname,
        telefon: userInfo.phone
      };

      const result = await updateKullanici(userId, updatedUserData, tokenHeader);

      if (result.error) {
        throw new Error(result.message || `Profil güncelleme hatası: ${result.status}`);
      }

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

  const handleLogoutClick = () => { // Logout fonksiyonunu direkt kullanmak yerine bir handler oluşturduk
    logout();
  };

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
          />
        );
      case 'orders':
        return <ProfileOrdersTab />;
      case 'addresses':
        return <ProfileAddressesTab/>;
      case 'settings':
        return <ProfileSettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProfileSidebar
            getUserInfo={KeycloakService.getUserInfo()}
            userInfo={userInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogoutClick} // Yeni handler'ı kullan
          />
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
