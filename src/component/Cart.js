// src/pages/Cart.js (Güncellenmiş)

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartHook'; // useCart hook'unu import et

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Tag
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart(); // cartTotal'ı hook'tan al

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToCheckout = () => {
    console.log('Navigating to checkout page');
    navigate('/checkout');
  };
 
  // Sepet toplamlarını hesapla
  // Bu hesaplamalar artık useCart hook'u içinde yapıldığı için daha basit
  const subtotal = cartTotal; // useCart'tan gelen cartTotal'ı kullan
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping; // Toplamı doğru hesapla

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Sepetiniz boş!');
      
      return;
    }
    else{
      navigateToCheckout();
    }
    navigateToCheckout();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* ... Boş sepet görünümü ... */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto pt-20 px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">Harika ürünlerimizi keşfetmek için alışverişe başlayın!</p>
            <button
              onClick={navigateToHome}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Alışverişe Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={navigateToHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Alışverişe Devam Et
            </button>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
            >
              Sepeti Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sepetinizdeki Ürünler</h2>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                      {"🏷️"}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.ad}</h3>
                      <p className="text-gray-600 text-sm">{item.aciklama}</p>
                      <div className="flex items-center mt-2">
                        <Tag className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{item.kategori}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Number(item.miktar) - 1)} // Miktarı sayıya dönüştür
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.miktar}</span> {/* miktar olarak güncellendi */}
                      <button
                        onClick={() => updateQuantity(item.id, Number(item.miktar) + 1)} // Miktarı sayıya dönüştür
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {(Number(item.fiyat) * Number(item.miktar)).toLocaleString('tr-TR')}₺
                      </div>
                      <div className="text-sm text-gray-500">
                        {Number(item.fiyat).toLocaleString('tr-TR')}₺ / adet
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>

              {/* Price Breakdown */}
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
                  <span>{shipping === 0 ? 'Ücretsiz' : `${shipping}₺`}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>{total.toLocaleString('tr-TR')}₺</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>Güvenli SSL ile korumalı ödeme</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mt-6 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Ödemeye Geç</span>
              </button>

              {/* Continue Shopping */}
              <button
                onClick={navigateToHome}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors mt-3 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Alışverişe Devam Et</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;