import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
//import { fetchAllProducts, fetchAddProduct } from '../../APIs/ProductApi';
import { fetchAllProducts, fetchAddProduct } from '../../APIs/ProductApi.js';
import { fetchAllCategories} from '../../APIs/CategoriApi';
import KeycloakService from '../../KeycloakService';

const ProductsTab = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            // API çağrısı burada olacak
            const tokenHeader = KeycloakService.getAuthorizationHeader();
            const result = await fetchAllCategories(tokenHeader);
            if (result.error) {
                alert('Kategoriler yüklenemedi: ' + result.message);
                return;
            }

            // Mock data
            setCategories(result.data);
        } catch (error) {
            alert('Kategoriler yüklenemedi: ' + error.message);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            // API çağrısı burada olacak
            const tokenHeader = KeycloakService.getAuthorizationHeader();
            const result = await fetchAllProducts(tokenHeader);
            if (result.error) {
                alert('Ürünler yüklenemedi: ' + result.message);
                return;
            }

            // Mock data - DTO'ya uygun
            setProducts(result.data);
        } catch (error) {
            alert('Ürünler yüklenemedi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (productData) => {
        try {
            // API çağrısı burada olacak
            const tokenHeader = KeycloakService.getAuthorizationHeader();
            const response = await fetchAddProduct(productData, tokenHeader);
            
            if (editingProduct) {
                setProducts(products.map(product => 
                    product.id === editingProduct.id ? { ...product, ...productData } : product
                ));
            } else {
                const newProduct = {
                    ...productData,
                    id: Math.max(...products.map(p => p.id), 0) + 1
                };
                setProducts([...products, newProduct]);
            }
            
            setShowModal(false);
            setEditingProduct(null);
        } catch (error) {
            alert('Ürün kaydedilemedi: ' + error.message);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Ürünü silmek istediğinizden emin misiniz?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const filteredProducts = products.filter(product =>
        product.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.aciklama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-8">Yükleniyor...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Ürünler</h1>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Ürün
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Ürün ara..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ürün</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Fiyat</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium">{product.ad}</div>
                                        <div className="text-sm text-gray-500">{product.aciklama}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {product.kategoriAd}
                                </td>
                                <td className="px-6 py-4 font-semibold">
                                    {product.fiyat.toLocaleString('tr-TR')}₺
                                </td>
                                <td className="px-6 py-4">
                                    <span className={product.mevcutStok <= 5 ? 'text-red-600 font-semibold' : ''}>
                                        {product.mevcutStok}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

const ProductModal = ({ product, categories, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        ad: product?.ad || '',
        fiyat: product?.fiyat || '',
        mevcutStok: product?.mevcutStok || '',
        aciklama: product?.aciklama || '',
        kategoriId: product?.kategoriId || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.ad.trim()) {
            alert('Ürün adı gereklidir');
            return;
        }
        if (!formData.fiyat || formData.fiyat <= 0) {
            alert('Geçerli bir fiyat giriniz');
            return;
        }
        if (!formData.mevcutStok || formData.mevcutStok < 0) {
            alert('Geçerli bir stok miktarı giriniz');
            return;
        }
        if (!formData.kategoriId) {
            alert('Kategori seçiniz');
            return;
        }

        setSaving(true);
        
        // Backend'e gönderilecek data (UrunEkleDto formatı)
        const productData = {
            ad: formData.ad,
            fiyat: parseFloat(formData.fiyat),
            mevcutStok: parseInt(formData.mevcutStok),
            aciklama: formData.aciklama,
            kategoriId: parseInt(formData.kategoriId)
        };
        
        await onSave(productData);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {product ? 'Ürünü Düzenle' : 'Yeni Ürün'}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ürün Adı *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.ad}
                            onChange={(e) => setFormData({...formData, ad: e.target.value})}
                            placeholder="Ürün adını giriniz"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Kategori *</label>
                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.kategoriId}
                            onChange={(e) => setFormData({...formData, kategoriId: e.target.value})}
                        >
                            <option value="">Kategori seçiniz</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.simge} {category.kategoriAd}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Fiyat *</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.fiyat}
                            onChange={(e) => setFormData({...formData, fiyat: e.target.value})}
                            placeholder="0.00"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Stok *</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.mevcutStok}
                            onChange={(e) => setFormData({...formData, mevcutStok: e.target.value})}
                            placeholder="0"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Açıklama</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            value={formData.aciklama}
                            onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                            placeholder="Ürün açıklaması"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        disabled={saving}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsTab;