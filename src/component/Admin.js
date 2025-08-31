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
    const [activeTab, setActiveTab] = useState('orders');
    
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
        { id: 'orders', label: 'Siparişler', icon: ShoppingCart },
        { id: 'products', label: 'Ürünler', icon: Package },
        { id: 'categories', label: 'Kategoriler', icon: FolderIcon },
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
                {activeTab === 'products' && <ProductsTab
                    

                />}
                {activeTab === 'orders' && <OrdersTab
                    Search={Search}
                    getStatusColor={getStatusColor}
                />}
                {activeTab === "customers" && <CustomersTab/>}
                {activeTab === "categories" && <CategoriesTab/>

                }
            </main>
        </div>
    );
}
export default AdminPanel;