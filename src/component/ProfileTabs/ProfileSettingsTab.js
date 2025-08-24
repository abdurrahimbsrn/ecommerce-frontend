// src/component/ProfileSettingsTab.js
import React from 'react';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

const ProfileSettingsTab = () => {
  const [showPassword, setShowPassword] = React.useState(false); // Bu state sadece bu sekmede geçerli

  return (
    <div className="space-y-6">

      {/* Bildirim Ayarları */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Ayarları</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
              <p className="text-gray-600 text-sm">Sipariş durumu ve kampanya bildirimleri</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
              <p className="text-gray-600 text-sm">Önemli güncelleler için SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Hesap Güvenliği */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Güvenliği</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-green-900">Keycloak ile Korunuyor</h4>
                <p className="text-green-700 text-sm">Hesabınız Keycloak ile güvenli bir şekilde yönetiliyor</p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Keycloak Hesap Yönetimi</h4>
            <p className="text-blue-700 text-sm mb-3">
              Hesap ayarlarınızı, şifrenizi ve güvenlik ayarlarınızı yönetmek için Keycloak hesap panelini kullanabilirsiniz.
            </p>
            <button 
              onClick={() => window.open('http://localhost:8080/realms/ecommerce/account', '_blank')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Keycloak Hesap Paneli
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;