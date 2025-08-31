import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation için eklendi
import KeycloakService from '../KeycloakService';
import { fetchAllCategories } from '../APIs/CategoriApi';
import { fetchAllProducts } from '../APIs/ProductApi';
import { useCart } from '../CartHook'; // Hook'u import edin

import {
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  Headphones,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate(); // Navigation hook'u eklendi
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await fetchAllCategories();
      setCategories(result.error ? [] : result.data);
    } catch (error) {
      alert('Kategoriler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchAllProducts();
      if (result.error) {
        alert('Ürünler yüklenemedi: ' + result.message);
        return;
      }
      setProducts(result.data);
    } catch (error) {
      alert('Ürünler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Rastgele renk döndüren yardımcı fonksiyon
  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Kategoriye tıklandığında çalışacak fonksiyon
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Ürüne tıklandığında çalışacak fonksiyon (opsiyonel)
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Tüm ürünleri görüntüleme fonksiyonu
  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleAddToCart = (product) => {
    // addToCart fonksiyonunu çağırarak ürünü sepete ekle
    addToCart(product, quantity);
    alert(`${product.ad} sepete eklendi!`);
  };

  const features = [
    {
      icon: Truck,
      title: 'Ücretsiz Kargo',
      description: '500₺ üzeri siparişlerde',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      title: 'Güvenli Ödeme',
      description: 'SSL sertifikası ile korumalı',
      color: 'text-green-600'
    },
    {
      icon: Headphones,
      title: '7/24 Destek',
      description: 'Müşteri hizmetleri',
      color: 'text-purple-600'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                En İyi Ürünler
                <span className="block text-yellow-400">En İyi Fiyatlar</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Teknolojiden modaya, ev dekorasyonundan spora kadar aradığınız her şey burada!
              </p>

            </div>
            <div className="text-8xl text-center lg:text-right opacity-20 lg:opacity-100">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-3 rounded-full bg-gray-100 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
            <p className="text-gray-600 text-lg">Aradığınız ürünü kolayca bulun</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 group border-2 border-transparent border-blue-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(category.id);
                    }
                  }}
                >
                  <div className={`w-16 h-16 ${getRandomColor()} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                    🛍️
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.kategoriAd}</h3>
                  <p className="text-gray-500 text-sm">{category.aciklama}</p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-blue-600 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
              <p className="text-gray-600">En popüler ve en çok satılan ürünler</p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Resim yerine emoji */}
                <div className="relative p-8 bg-gray-50 flex justify-center items-center text-6xl">
                  {"🏷️"}
                  {product.mevcutStok === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Tükendi</span>
                    </div>
                  )}
                </div>

                {/* Ürün Bilgileri */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.ad}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.aciklama}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {product.fiyat.toLocaleString("tr-TR")}₺
                    </span>
                    <span
                      className={`text-sm font-medium ${product.mevcutStok > 0 ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {product.mevcutStok > 0
                        ? `${product.mevcutStok} adet stokta`
                        : "Stokta yok"}
                    </span>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.mevcutStok === 0}
                    onClick={(e) => {
                      e.stopPropagation(); // Ürün kartına tıklanmasını engeller
                      handleAddToCart(product);
                      console.log('Sepete eklendi:', product.id);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Sepete Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">ShopZone</span>
              </div>
              <p className="text-gray-400">
                En kaliteli ürünleri en uygun fiyatlarla sizlere sunuyoruz.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShopZone. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
