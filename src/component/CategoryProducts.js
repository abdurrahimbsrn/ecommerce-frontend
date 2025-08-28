import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartHook';

import {
  ShoppingCart,
  ArrowLeft,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  Heart
} from 'lucide-react';
import { fetchProductsByCategory } from '../APIs/ProductApi';
//import { fetchCategoryById } from '../APIs/CategoriApi';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price-asc', 'price-desc', 'stock'
  const [filterByStock, setFilterByStock] = useState(false);

  useEffect(() => {
    if (categoryId) {
      loadCategoryProducts();
      //loadCategoryInfo();
    }
  }, [categoryId]);

  const loadCategoryProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchProductsByCategory(categoryId);
      if (result.error) {
        alert('Ürünler yüklenemedi: ' + result.message);
        return;
      }
      setProducts(result.data || []);
    } catch (error) {
      alert('Ürünler yüklenemedi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = (product) => {
    // addToCart fonksiyonunu çağırarak ürünü sepete ekle
    addToCart(product, quantity);
    alert(`${product.ad} sepete eklendi!`);
  };

  // const loadCategoryInfo = async () => {
  //   try {
  //     const result = await fetchCategoryById(categoryId);
  //     if (!result.error) {
  //       setCategory(result.data);
  //     }
  //   } catch (error) {
  //     console.error('Kategori bilgisi yüklenemedi:', error);
  //   }
  // };

  // Ürünleri sıralama ve filtreleme
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = [...products];

    // Stok durumuna göre filtreleme
    if (filterByStock) {
      filteredProducts = filteredProducts.filter(product => product.mevcutStok > 0);
    }

    // Sıralama
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.ad.localeCompare(b.ad, 'tr-TR');
        case 'price-asc':
          return a.fiyat - b.fiyat;
        case 'price-desc':
          return b.fiyat - a.fiyat;
        case 'stock':
          return b.mevcutStok - a.mevcutStok;
        default:
          return 0;
      }
    });

    return filteredProducts;
  };

  const displayedProducts = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {category ? category.name : 'Kategori Ürünleri'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {displayedProducts.length} ürün bulundu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtreler
              </h3>

              {/* Stok Durumu */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Stok Durumu</h4>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterByStock}
                    onChange={(e) => setFilterByStock(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-600">Sadece stokta olanlar</span>
                </label>
              </div>

              {/* Sıralama */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Sıralama</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">İsme göre (A-Z)</option>
                  <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
                  <option value="stock">Stok Miktarı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {displayedProducts.length} ürün gösteriliyor
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewType === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-lg transition-colors ${viewType === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ürün bulunamadı
                </h3>
                <p className="text-gray-600">
                  {filterByStock
                    ? 'Stokta olan ürün bulunmuyor. Filtreleri değiştirmeyi deneyin.'
                    : 'Bu kategoride henüz ürün bulunmuyor.'
                  }
                </p>
              </div>
            ) : (
              <div className={
                viewType === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group ${viewType === 'list' ? 'flex' : ''
                      }`}
                  >
                    {/* Ürün Resmi */}
                    <div className={`relative bg-gray-50 flex justify-center items-center ${viewType === 'grid' ? 'p-8 text-6xl' : 'w-32 h-32 flex-shrink-0 text-4xl'
                      }`}>
                      🏷️
                      {product.mevcutStok === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Tükendi</span>
                        </div>
                      )}
                    </div>

                    {/* Ürün Bilgileri */}
                    <div className="p-6 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.ad}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.aciklama}
                      </p>

                      <div className={`flex items-center justify-between mb-4 ${viewType === 'list' ? 'flex-col items-start space-y-2' : ''
                        }`}>
                        <span className="text-2xl font-bold text-gray-900">
                          {product.fiyat.toLocaleString('tr-TR')}₺
                        </span>
                        <span className={`text-sm font-medium ${product.mevcutStok > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {product.mevcutStok > 0
                            ? `${product.mevcutStok} adet stokta`
                            : 'Stokta yok'
                          }
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Ürün kartına tıklanmasını engeller
                            handleAddToCart(product);
                            console.log('Sepete eklendi:', product.id);
                          }}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={product.mevcutStok === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Sepete Ekle
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;