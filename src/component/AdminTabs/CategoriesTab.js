import { useState, useEffect } from 'react';
import KeycloakService from '../../KeycloakService';
import { fetchAddCategory, fetchAllCategories } from '../../Api';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Package,
    TrendingUp,
    BarChart3,
    X
} from 'lucide-react';

const CategoriesTab = () => {
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
       const [loadingCategories, setLoadingCategories] = useState(true); // Yükleme durumu
    const [customersError, setCategoriesError] = useState(null); // Hata durumu

    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Elektronik',
            description: 'Telefon, tablet, bilgisayar ve elektronik ürünler',
            icon: '📱',
            productCount: 45,
            totalSales: 2500000,
            status: 'active',
            createdAt: '2023-01-15'
        },
        {
            id: 2,
            name: 'Bilgisayar',
            description: 'Laptop, masaüstü bilgisayar ve bilgisayar aksesuarları',
            icon: '💻',
            productCount: 25,
            totalSales: 1800000,
            status: 'active',
            createdAt: '2023-02-20'
        },
        {
            id: 3,
            name: 'Aksesuar',
            description: 'Kulaklık, kılıf, şarj cihazı ve diğer aksesuarlar',
            icon: '🎧',
            productCount: 35,
            totalSales: 850000,
            status: 'active',
            createdAt: '2023-03-10'
        },
        {
            id: 4,
            name: 'Giyim',
            description: 'Erkek, kadın ve çocuk giyim ürünleri',
            icon: '👕',
            productCount: 120,
            totalSales: 650000,
            status: 'inactive',
            createdAt: '2023-04-05'
        },
        {
            id: 5,
            name: 'Ev & Yaşam',
            description: 'Ev dekorasyonu ve yaşam ürünleri',
            icon: '🏠',
            productCount: 80,
            totalSales: 420000,
            status: 'active',
            createdAt: '2023-05-12'
        }
    ]);
    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            setCategoriesError(null);
            try {
                const tokenHeader = KeycloakService.getAuthorizationHeader();
                if (!tokenHeader) {
                    setLoadingCategories(false);
                    return;
                }

                const result = await fetchAllCategories(tokenHeader);

                if (result.error) {
                    console.error("CategoriesTab: Kategorisi listesi API hatası:", result.status, result.message);
                    setCategoriesError(result.message || "Kategori yüklenirken bir hata oluştu.");
                } else {
                    // KullaniciDto listesini frontend customers formatına dönüştür
                    const formattedCategories = result.data.map(kategori => ({
                        id: kategori.id,
                        kategoriAd: kategori.kategoriAd, // Ad ve soyadı birleştir
                        aciklama: kategori.aciklama,
                        simge: kategori.emoji
                    }));
                    setCategories(formattedCategories);
                }
            } catch (err) {
                console.error("CategoriesTab: Müşteri listesi yüklenirken beklenmeyen hata:", err);
                setCategoriesError("Müşteri listesi yüklenirken bir sorun oluştu: " + err.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []); // getHeadersToken değiştiğinde yeniden çalış

    const handleDeleteCategory = (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusChange = (categoryId, newStatus) => {
        setCategories(categories.map(category =>
            category.id === categoryId
                ? { ...category, status: newStatus }
                : category
        ));
    };

    const closeModal = () => {
        setShowCategoryModal(false);
        setSelectedCategory(null);
    };

    const handleCategorySave = (categoryData) => {
        if (selectedCategory) {
            setCategories(categories.map(cat =>
                cat.id === selectedCategory.id ? { ...cat, ...categoryData } : cat
            ));
        } else {
            setCategories([
                ...categories,
                {
                    ...categoryData,
                    id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
                    createdAt: new Date().toISOString().slice(0, 10),
                    productCount: 0,
                    totalSales: 0,
                }
            ]);
        }
        closeModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h2>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kategori Ekle
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Açıklama
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün Sayısı
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Satış
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Oluşturma Tarihi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-2xl mr-4">{category.icon}</div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                <div className="text-sm text-gray-500">#{category.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 max-w-xs" title={category.description}>
                                            {category.description.length > 50
                                                ? `${category.description.substring(0, 50)}...`
                                                : category.description
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Package className="w-4 h-4 mr-2 text-gray-400" />
                                            {category.productCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {category.totalSales.toLocaleString('tr-TR')}₺
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={category.status}
                                            onChange={(e) => handleStatusChange(category.id, e.target.value)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(category.status)}`}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="inactive">Pasif</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setShowCategoryModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded transition-colors"
                                                title="Detay Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-purple-600 hover:text-purple-700 p-1 hover:bg-purple-50 rounded transition-colors"
                                                title="İstatistikler"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                                title="Sil"
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
            </div>

            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
                                onClick={closeModal}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <CategoryForm
                                initialData={selectedCategory}
                                onSave={handleCategorySave}
                                onCancel={closeModal}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function CategoryForm({ initialData, onSave, onCancel, loading, setLoading }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        icon: initialData?.icon || "",
        status: initialData?.status || "active"
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Kategori adı gereklidir";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Kategori adı en az 2 karakter olmalıdır";
        }

        if (formData.description && formData.description.length > 200) {
            newErrors.description = "Açıklama 200 karakterden fazla olamaz";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            
             const tokenHeader = KeycloakService.getAuthorizationHeader();
             const response = await fetchAddCategory(formData, tokenHeader);
             if (!response.ok) {
                 throw new Error(response.message || "Kategori eklenirken bir hata oluştu.");
             }
             const savedCategory = await response.json();
             onSave(savedCategory);

            onSave(formData);
        } catch (error) {
            alert(error.message || "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori Adı *
                </label>
                <input
                    type="text"
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Kategori adını giriniz"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                </label>
                <textarea
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    rows={3}
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Kategori açıklamasını giriniz"
                    disabled={loading}
                    maxLength={200}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/200 karakter
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Simge (Emoji)
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.icon}
                    onChange={e => handleInputChange('icon', e.target.value)}
                    placeholder="Örn: 📱"
                    disabled={loading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durum
                </label>
                <select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loading}
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50"
                    onClick={onCancel}
                    disabled={loading}
                >
                    İptal
                </button>
                <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Kaydediliyor...
                        </>
                    ) : (
                        'Kaydet'
                    )}
                </button>
            </div>
        </div>
    );
}

export default CategoriesTab;