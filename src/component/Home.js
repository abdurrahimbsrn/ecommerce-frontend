import React from 'react';
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
  // Örnek veriler
  const categories = [
    { id: 1, name: 'Elektronik', image: '📱', itemCount: 1250, color: 'bg-blue-500' },
    { id: 2, name: 'Moda', image: '👕', itemCount: 890, color: 'bg-pink-500' },
    { id: 3, name: 'Ev & Yaşam', image: '🏠', itemCount: 650, color: 'bg-green-500' },
    { id: 4, name: 'Spor', image: '⚽', itemCount: 420, color: 'bg-orange-500' },
    { id: 5, name: 'Kitap', image: '📚', itemCount: 780, color: 'bg-purple-500' },
    { id: 6, name: 'Oyuncak', image: '🧸', itemCount: 340, color: 'bg-yellow-500' }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 52999,
      originalPrice: 54999,
      image: '📱',
      rating: 4.8,
      reviews: 124,
      badge: 'Yeni',
      badgeColor: 'bg-green-500'
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      price: 42999,
      originalPrice: 45999,
      image: '💻',
      rating: 4.9,
      reviews: 89,
      badge: 'İndirim',
      badgeColor: 'bg-red-500'
    }
  ];

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {category.image}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.itemCount} ürün</p>
              </div>
            ))}
          </div>
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
            <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Tümünü Gör <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative p-8 bg-gray-50">
                  <div className="text-6xl text-center mb-4">{product.image}</div>
                  <span className={`absolute top-4 left-4 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                    {product.badge}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString('tr-TR')}₺</span>
                      <span className="text-gray-500 line-through ml-2">{product.originalPrice.toLocaleString('tr-TR')}₺</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
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