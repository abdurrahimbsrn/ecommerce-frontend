import { ShoppingBag, Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import Keycloak from "keycloak-js";

const Header = ({ searchQuery, setSearchQuery, setIsMobileMenuOpen, isMobileMenuOpen, Profile, setEditMode, userInfo, setAddresses, address, editMode, setUserInfo, showPassword, setShowPassword, activeTab, setActiveTab, }) => {

    const keycloak = new Keycloak({
        url: "http://localhost:8080",
        realm: "ecommerce",
        clientId: "custom-client"
    });

    keycloak.init({ onLoad: "login-required" }).then(authenticated => {
        if (authenticated) {
            console.log("Logged in", keycloak.token);
            localStorage.setItem("access_token", keycloak.token);
        } else {
            keycloak.login();
        }
    });
    const isLoggedIn = () => {
        const token = localStorage.getItem("access_token");
        return token != null;
    };


    const login = () => {
        window.location.href =
            "http://localhost:8080/realms/ecommerce/protocol/openid-connect/auth" +
            "?client_id=custom-client" +
            "&response_type=code" +
            "&scope=openid" +
            "&redirect_uri=http://localhost:3000";
    };
    return (
        < header className="bg-white shadow-sm sticky top-0 z-50" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">ShopZone</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Ürün, marka veya kategori ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors hidden md:block">
                            <Heart className="w-6 h-6" />
                        </button>
                        {isLoggedIn() ? (
                            <Profile
                                setEditMode={setEditMode}
                                userInfo={userInfo}
                                setAddresses={setAddresses}
                                editMode={editMode}
                                address={address}
                            />
                        ) : (
                            <button
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                onClick={login}
                            >
                                Giriş Yap
                            </button>
                        )}
                        <User className="w-6 h-6" />

                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors md:hidden"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="pb-4 md:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Ürün ara..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </header >
    );
};
export default Header;