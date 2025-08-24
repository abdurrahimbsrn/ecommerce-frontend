import React, { useState, useEffect } from 'react';
import OrdersTab from './AdminTabs/OrdersTab';
import ProductsTab from './AdminTabs/ProductTabs';
import DashboardTab from './AdminTabs/DashBoardTab';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    Search,
    Image as ImageIcon,
    Save,
    X,
    FolderIcon
} from 'lucide-react';
import CustomersTab from './AdminTabs/CustomersTab';
import CategoriesTab from './AdminTabs/CategoriesTab';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'iPhone 15 Pro Max',
            category: 'Elektronik',
            price: 52999,
            stock: 25,
            status: 'active',
            image: '📱',
            description: 'En yeni iPhone modeli',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'MacBook Air M3',
            category: 'Bilgisayar',
            price: 42999,
            stock: 0,
            status: 'inactive',
            image: '💻',
            description: 'Apple M3 çipli laptop',
            createdAt: '2024-01-10'
        },
        {
            id: 3,
            name: 'AirPods Pro',
            category: 'Aksesuar',
            price: 8999,
            stock: 50,
            status: 'active',
            image: '🎧',
            description: 'Kablosuz kulaklık',
            createdAt: '2024-01-20'
        }
    ]);

    const [users] = useState([
        {
            id: 1,
            name: 'Ahmet Yılmaz',
            email: 'ahmet@example.com',
            phone: '+90 555 123 4567',
            city: 'İstanbul',
            totalOrders: 15,
            totalSpent: 45000,
            status: 'active',
            joinDate: '2023-06-15'
        },
        {
            id: 2,
            name: 'Ayşe Kaya',
            email: 'ayse@example.com',
            phone: '+90 555 987 6543',
            city: 'Ankara',
            totalOrders: 8,
            totalSpent: 22000,
            status: 'active',
            joinDate: '2023-09-20'
        }
    ]);

    const [orders] = useState([
        {
            id: '#ORD-2025-001',
            customer: 'Ahmet Yılmaz',
            date: '2025-01-20',
            status: 'delivered',
            total: 52999,
            items: 2
        },
        {
            id: '#ORD-2025-002',
            customer: 'Ayşe Kaya',
            date: '2025-01-19',
            status: 'shipping',
            total: 8999,
            items: 1
        },
        {
            id: '#ORD-2025-003',
            customer: 'Mehmet Demir',
            date: '2025-01-18',
            status: 'pending',
            total: 15500,
            items: 3
        }
    ]);

    const [stats] = useState({
        totalRevenue: 2500000,
        totalOrders: 1250,
        totalCustomers: 850,
        totalProducts: 125,
        monthlyGrowth: 15.3,
        pendingOrders: 25,
        lowStockProducts: 8
    });

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Ürünler', icon: Package },
        { id: 'categories', label: 'Kategoriler', icon: FolderIcon },
        { id: 'orders', label: 'Siparişler', icon: ShoppingCart },
        { id: 'customers', label: 'Müşteriler', icon: Users },
        { id: 'settings', label: 'Ayarlar', icon: Settings }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipping': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'inactive': return 'Pasif';
            case 'pending': return 'Bekliyor';
            case 'delivered': return 'Teslim Edildi';
            case 'shipping': return 'Kargoda';
            default: return status;
        }
    };

    const handleProductSubmit = (productData) => {
        if (selectedProduct) {
            // Güncelleme
            setProducts(products.map(p =>
                p.id === selectedProduct.id
                    ? { ...p, ...productData, id: selectedProduct.id }
                    : p
            ));
        } else {
            // Yeni ekleme
            const newProduct = {
                ...productData,
                id: Math.max(...products.map(p => p.id)) + 1,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setProducts([...products, newProduct]);
        }
        setShowProductModal(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const ProductModal = ({ isOpen, onClose, product, onSubmit }) => {
        const [formData, setFormData] = useState(
            product || {
                name: '',
                category: '',
                price: '',
                stock: '',
                status: 'active',
                image: '📦',
                description: ''
            }
        );

        useEffect(() => {
            if (product) {
                setFormData(product);
            }
        }, [product]);

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };



        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Adı *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ürün adını girin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Kategori seçin</option>
                                    <option value="Elektronik">Elektronik</option>
                                    <option value="Bilgisayar">Bilgisayar</option>
                                    <option value="Aksesuar">Aksesuar</option>
                                    <option value="Giyim">Giyim</option>
                                    <option value="Ev & Yaşam">Ev & Yaşam</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fiyat (₺) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stok Miktarı *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durum
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Emoji
                                </label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="📦"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ürün Açıklaması
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ürün hakkında detaylı bilgi..."
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {product ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };




    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === item.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {activeTab === 'dashboard' && <DashboardTab
                    stats={stats}
                    orders={orders}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                />}
                {activeTab === 'products' && <ProductsTab
                    setSelectedProduct={setSelectedProduct}
                    setShowProductModal={setShowProductModal}
                    products={products}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    handleDeleteProduct={handleDeleteProduct}

                />}
                {activeTab === 'orders' && <OrdersTab
                    Search={Search}
                    orders={orders}
                    getStatusColor={getStatusColor}
                />}
                {activeTab === "customers" && <CustomersTab/>}
                {activeTab === "categories" && <CategoriesTab/>

                }
            </main>

            {/* Ürün Modalı */}
            {showProductModal && (
                <ProductModal
                    isOpen={showProductModal}
                    onClose={() => {
                        setShowProductModal(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    onSubmit={handleProductSubmit}
                />
            )}
        </div>
    );
}
export default AdminPanel;