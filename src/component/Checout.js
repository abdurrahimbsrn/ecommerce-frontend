// src/pages/CheckoutPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartHook'; // Sepet hook'unu import et
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import KeycloakService from '../KeycloakService'; // Kullanıcı bilgileri için
import { fetchAddress } from '../APIs/UserApi'; // Kullanıcı adreslerini çekmek için
import { fetchAddOrder, fetchAddPayment } from '../APIs/OrderApi';
import { Truck, Shield } from 'lucide-react';

const CheckoutPage = ({ }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [activeStep, setActiveStep] = useState(1); // 1: Adres, 2: Ödeme, 3: Onay
  const [shippingAddress, setShippingAddress] = useState(null); // Seçilen gönderim adresi
  const [paymentMethod, setPaymentMethod] = useState('KREDI_KARTI'); // Seçilen ödeme yöntemi
  const [address, setUserAddresses] = useState([]); // Kullanıcının kayıtlı adresleri
  const [newAddressForm, setNewAddressForm] = useState({ // Yeni adres ekleme formu
    title: '', name: '', address: '', district: '', city: '', zipCode: '', phone: ''
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressesError, setAddressesError] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(false); // Sipariş işleniyor mu?

  const subtotal = cartTotal;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const totalAmount = subtotal + shippingCost;

  // --- Kullanıcının Kayıtlı Adreslerini Çekme ---
  useEffect(() => {
    const loadUserAddresses = async () => {
      setLoadingAddresses(true);
      setAddressesError(null);
      try {
        const tokenHeader = KeycloakService.getAuthorizationHeader();
        if (!tokenHeader) {
          // Token yoksa login sayfasına yönlendir veya hata göster
          navigate('/profile'); // Profil sayfasına yönlendir, oradan login olabilir
          return;
        }
        // Kullanıcının profil bilgilerini çekerek adreslerini al
        const result = await fetchAddress(tokenHeader);
        if (result.error) {
          setAddressesError(result.message || "Adresler yüklenirken bir hata oluştu.");
        } else {
          setUserAddresses(result.data);
          if (result.data != null) {
            setActiveStep(2); // Adres varsa direkt ödeme adımına geç
            setShippingAddress(result.data);
          }
        }
      } catch (err) {
        setAddressesError("Adresler yüklenirken bir sorun oluştu: " + err.message);
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (KeycloakService.isAuthenticated()) { // Kullanıcı giriş yaptıysa adresleri çek
      loadUserAddresses();
    } else {
      navigate('/profile'); // Giriş yapmadıysa profile sayfasına yönlendir
    }
  }, [navigate]);

  // --- Siparişi Tamamlama ---
  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      alert('Lütfen bir gönderim adresi seçin.');
      return;
    }
    if (!paymentMethod) {
      alert('Lütfen bir ödeme yöntemi seçin.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }

    setProcessingOrder(true);
    try {
      const tokenHeader = KeycloakService.getAuthorizationHeader();
      if (!tokenHeader) {

        alert("Giriş yapmanız gerekiyor.");
        navigate('/profile');
        return;
      }
      const orderData = {
        siparisKalemleri: cartItems.map(item => ({
          urunId: item.id,
          miktar: item.miktar
        }))
      };


      console.log("Sipariş verisi backend'e gönderiliyor:", orderData);
      const orderResult = await fetchAddOrder(orderData, tokenHeader);
      if (orderResult.error) {
        alert('Sipariş oluşturulamadı: ' + orderResult.message);
        return;
      }
      console.log("Sipariş oluşturuldu:", orderResult.data.siparisId);
      const paymentData = {
        siparisId: orderResult.data.siparisId,
        odemeYontemi: paymentMethod
      };
      console.log("Ödeme verisi backend'e gönderiliyor:", paymentData);
      const paymentResult = await fetchAddPayment(paymentData, tokenHeader);
      if (paymentResult.error) {
        alert('Ödeme işlemi başarısız: ' + paymentResult.message);
        return;
      }
      // Başarılı olursa sepeti temizle ve sipariş onay sayfasına yönlendir
      clearCart();
      alert('Siparişiniz başarıyla alındı!');
      navigate('/'); // Sipariş onay sayfasına yönlendir

    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      alert('Siparişinizi oluştururken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setProcessingOrder(false);
    }
  };

  // --- Sepet Boşsa ---
  if (cartItems.length === 0 && !processingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
          <p className="text-gray-600 mb-6">Ödeme işlemine devam etmek için sepetinizde ürün olmalı.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    );
  }

  // --- Yükleme Durumu ---
  if (loadingAddresses || processingOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {processingOrder ? 'Siparişiniz işleniyor...' : 'Adresler yükleniyor...'}
          </p>
        </div>
      </div>
    );
  }

  // --- Hata Durumu ---
  if (addressesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Hata: {addressesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Sepete Geri Dön
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ödeme Sayfası</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Adımlar ve İçerik */}
          <div className="lg:col-span-2 space-y-8">
            {/* Adım 1: Gönderim Adresi */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${activeStep === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>1</span>
                <h2 className="text-xl font-semibold text-gray-900">Gönderim Adresi</h2>
              </div>

              <div>
                {address ? (
                  <div className="max-w-md">
                    <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="font-semibold text-gray-900 text-lg">{address.adresAdi}</h3>
                      </div>

                      <div className="text-gray-700 space-y-2">
                        <p className="flex items-start">
                          <span className="font-medium text-gray-900 w-16 inline-block">Ülke:</span>
                          <span>{address.ulke}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium text-gray-900 w-16 inline-block">Şehir:</span>
                          <span>{address.sehir}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium text-gray-900 w-16 inline-block">İlçe:</span>
                          <span>{address.ilce}</span>
                        </p>
                        <p className="flex items-start">
                          <span className="font-medium text-gray-900 w-16 inline-block">Detay:</span>
                          <span>{address.detay}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Kayıtlı bir adres bulunamadı. Lütfen profil sayfanızdan bir adres ekleyin.</p>
                )}
              </div>
            </div>

            {/* Adım 2: Ödeme Yöntemi */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 ${activeStep < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center mb-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${activeStep === 2 ? 'bg-blue-600' : 'bg-gray-400'}`}>2</span>
                <h2 className="text-xl font-semibold text-gray-900">Ödeme Yöntemi</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="KREDI_KART"
                    checked={paymentMethod === 'KREDI_KARTI'}
                    onChange={() => setPaymentMethod('KREDI_KARTI')}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  <span>Kredi Kartı</span>
                </label>
                <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="HAVALE"
                    checked={paymentMethod === 'HAVALE'}
                    onChange={() => setPaymentMethod('HAVALE')}
                    className="mr-3"
                  />
                  <i className="fas fa-university w-5 h-5 mr-2 text-gray-600"></i> {/* Font Awesome ikonu */}
                  <span>Banka Havalesi / EFT</span>
                </label>
                {/* Diğer ödeme yöntemleri */}
              </div>
            </div>

            {/* Adım 3: Sipariş Özeti ve Onay */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 ${activeStep < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center mb-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${activeStep === 2 ? 'bg-blue-600' : 'bg-gray-400'}`}>3</span>
                <h2 className="text-xl font-semibold text-gray-900">Sipariş Özeti ve Onay</h2>
              </div>


              {/* Seçilen Ödeme Yöntemi */}
              {paymentMethod && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-800 mb-2">Ödeme Yöntemi:</h3>
                  <p className="text-sm text-gray-700">
                    {paymentMethod === 'KREDI_KARTI' ? 'Kredi Kartı' : 'Banka Havalesi / EFT'}
                  </p>
                </div>
              )}

              {/* Ürün Listesi Özeti */}
              <div className="border-b border-gray-200 pb-4 mb-4 space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.ad} (x{item.miktar})</span>
                    <span className="font-medium text-gray-900">{(item.fiyat * item.miktar).toLocaleString('tr-TR')}₺</span>
                  </div>
                ))}
              </div>

              {/* Sipariş Toplamları */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam:</span>
                  <span>{subtotal.toLocaleString('tr-TR')}₺</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Kargo:</span>
                  <span>{shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')}₺`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                  <span>Toplam:</span>
                  <span>{totalAmount.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Geri Dön
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processingOrder}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{processingOrder ? 'Ödeme Alınıyor...' : 'Ödemeyi Tamamla'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Tarafta Sipariş Özeti (Sabit) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 border-b pb-4 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.ad} (x{item.miktar})</span>
                    <span className="font-medium text-gray-900">{(item.fiyat * item.miktar).toLocaleString('tr-TR')}₺</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString('tr-TR')}₺</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Kargo
                  </span>
                  <span>{shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')}₺`}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>{totalAmount.toLocaleString('tr-TR')}₺</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>Güvenli SSL ile korumalı ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;