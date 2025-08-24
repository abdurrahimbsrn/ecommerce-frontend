
    import {
        Package,
        Users,
        ShoppingCart,
        TrendingUp,
        AlertCircle,
        CheckCircle,
        Clock,
        DollarSign,
        Image as ImageIcon,
    } from 'lucide-react';
    
    
    const DashboardTab = ({stats, orders, getStatusColor,getStatusText}) => {

        return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Toplam Gelir</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('tr-TR')}₺</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 text-sm font-medium">+{stats.monthlyGrowth}%</span>
                        <span className="text-gray-600 text-sm ml-1">bu ay</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Toplam Sipariş</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-gray-600 text-sm">{stats.pendingOrders} beklemede</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Müşteri Sayısı</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-gray-600 text-sm">Aktif kullanıcılar</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Ürün Sayısı</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-gray-600 text-sm">{stats.lowStockProducts} düşük stok</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sipariş No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Müşteri
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tarih
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tutar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {order.total.toLocaleString('tr-TR')}₺
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default DashboardTab;