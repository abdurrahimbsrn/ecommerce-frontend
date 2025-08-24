import { ShoppingBag, Search, User, Heart, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const HeaderCustomer = ({ 
  searchQuery, 
  setSearchQuery, 
  setIsMobileMenuOpen, 
  isMobileMenuOpen,
  handlerLogin,
  handlerLogout,
  authenticated,
  keycloakUserInfo
}) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Kullanıcı menüsü dışında tıklanınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    handlerLogout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
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
                onKeyPress={handleSearch}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors hidden md:block"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="w-6 h-6" />
            </button>

            {authenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {keycloakUserInfo?.firstName?.charAt(0) || keycloakUserInfo?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:block font-medium text-gray-900">
                    {keycloakUserInfo?.firstName || keycloakUserInfo?.username || 'Kullanıcı'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {keycloakUserInfo?.firstName?.charAt(0) || keycloakUserInfo?.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {keycloakUserInfo?.firstName && keycloakUserInfo?.lastName 
                              ? `${keycloakUserInfo.firstName} ${keycloakUserInfo.lastName}`
                              : keycloakUserInfo?.username || 'Kullanıcı'
                            }
                          </p>
                          <p className="text-sm text-gray-600">{keycloakUserInfo?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profilim
                    </button>
                    
                    <button
                      onClick={() => {setShowUserMenu(false); navigate('/favorites');}}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Favoriler
                    </button>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                onClick={handlerLogin}
              >
                Giriş Yap
              </button>
            )}

            <button 
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {authenticated ? (
                <>
                  <button 
                    onClick={() => {navigate('/profile'); setIsMobileMenuOpen(false);}}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Profil
                  </button>
                  <button 
                    onClick={() => {navigate('/favorites'); setIsMobileMenuOpen(false);}}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favoriler
                  </button>
                  <button 
                    onClick={() => {navigate('/cart'); setIsMobileMenuOpen(false);}}
                    className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Sepetim
                  </button>
                  <button 
                    onClick={() => {handlerLogout(); setIsMobileMenuOpen(false);}}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {handlerLogin(); setIsMobileMenuOpen(false);}}
                  className="flex items-center w-full px-3 py-2 text-blue-600 hover:text-blue-700"
                >
                  <User className="w-5 h-5 mr-2" />
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderCustomer;