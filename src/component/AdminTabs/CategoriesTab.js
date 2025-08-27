import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import KeycloakService from '../../KeycloakService';
import { fetchAllCategories, fetchAddCategory, fetchDeleteCategory } from '../../APIs/CategoriApi';

const CategoriesTab = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);


    // Kategorileri yükle
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            // API çağrısı burada olacak
             const tokenHeader = KeycloakService.getAuthorizationHeader();
            const result = await fetchAllCategories(tokenHeader);
            
            
            setCategories(result.error ? [] : result.data);
        } catch (error) {
            alert('Kategoriler yüklenemedi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (categoryData) => {
        try {
            // API çağrısı burada olacak
            const tokenHeader = KeycloakService.getAuthorizationHeader();
            const response = await fetchAddCategory(categoryData, tokenHeader);
            
            if (response.error) {
                throw new Error(response.message || 'Kategori eklenemedi');
            }  
            // Başarılı ekleme/düzenleme sonrası kategorileri güncelle


            if (editingCategory) {
                // Düzenleme
                setCategories(categories.map(cat => 
                    cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
                ));
            } else {
                // Yeni ekleme
                const newCategory = {
                    ...categoryData,
                    id: Math.max(...categories.map(c => c.id), 0) + 1
                };
                setCategories([...categories, newCategory]);
            }
            
            setShowModal(false);
            setEditingCategory(null);
        } catch (error) {
            alert('Kategori kaydedilemedi: ' + error.message);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Kategoriyi silmek istediğinizden emin misiniz?')) {
            // API çağrısı ile silme işlemi burada olacak
            const tokenHeader = KeycloakService.getAuthorizationHeader();
            const response= fetchDeleteCategory(id, tokenHeader);
            if (response.error) {
                alert('Kategori silinemedi: ' + response.message);
                return;
            }
            // Başarılı silme sonrası kategorileri güncelle
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    if (loading) {
        return <div className="flex justify-center p-8">Yükleniyor...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kategoriler</h1>
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Kategori
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Açıklama</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <span className="text-xl mr-3">{category.simge}</span>
                                        <div>
                                            <div className="font-medium">{category.kategoriAd}</div>
                                            <div className="text-sm text-gray-500">#{category.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{category.aciklama}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
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
                <CategoryModal
                    category={editingCategory}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

const CategoryModal = ({ category, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        kategoriAd: category?.kategoriAd || '',
        aciklama: category?.aciklama || '',
        simge: category?.simge || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.kategoriAd.trim()) {
            alert('Kategori adı gereklidir');
            return;
        }

        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Kategori Adı *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.kategoriAd}
                            onChange={(e) => setFormData({...formData, kategoriAd: e.target.value})}
                            placeholder="Kategori adını giriniz"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Açıklama</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                            value={formData.aciklama}
                            onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                            placeholder="Kategori açıklaması"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-1">Simge</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.simge}
                            onChange={(e) => setFormData({...formData, simge: e.target.value})}
                            placeholder="📱"
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

export default CategoriesTab;