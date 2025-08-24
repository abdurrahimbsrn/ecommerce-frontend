// KeycloakService.js - Keycloak configuration ve initialization
import Keycloak from 'keycloak-js';

// Keycloak konfigürasyonu
const keycloakConfig = {
  url: 'http://localhost:8080/', // Keycloak server URL'inizi buraya yazın
  realm: 'ecommerce',      // Realm adınızı buraya yazın
  clientId: 'custom-client',    // Client ID'nizi buraya yazın
};

// Keycloak instance oluştur (Singleton olarak)
const keycloak = new Keycloak(keycloakConfig);

// Keycloak Authentication Service
class KeycloakService {
  
  // Keycloak'ı initialize et
  static async initKeycloak() {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso', // Sayfa yüklendiğinde SSO kontrolü yap
        // silentCheckSsoRedirectUri'yi window.location.origin ile aynı domain'de bir HTML dosyası olarak ayarlayın.
        // Genellikle uygulamanızın public klasörüne bu dosyayı koyarsınız.
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256', // PKCE güvenlik özelliği
        checkLoginIframe: false, // iframe kontrolünü kapat (opsiyonel, sorunlara yol açabilir)
      });
      
      console.log('Keycloak initialized. Authenticated:', authenticated);
      return authenticated;
    } catch (error) {
      // Hata objesini doğru şekilde log'la
      console.error('Keycloak initialization failed:', error);
      throw error; // Hatanın çağrıldığı yere iletilmesini sağla
    }
  }

  // Login fonksiyonu - Keycloak login sayfasına yönlendir
  static login() {
    return keycloak.login({
      redirectUri: window.location.origin, // Login sonrası dönülecek URL
    });
  }

  // Logout fonksiyonu
  static logout() {
    // Keycloak oturumunu sonlandırır ve kullanıcıyı redirectUri'ye yönlendirir.
    // Bu, tarayıcı çerezlerini de temizlemelidir.
    return keycloak.logout({
      redirectUri: window.location.origin, // Logout sonrası dönülecek URL
    });
  }

  // Access token'ı al
  static getToken() {
    return keycloak.token;
  }

  // Refresh token'ı al
  static getRefreshToken() {
    return keycloak.refreshToken;
  }

  // ID token'ı al
  static getIdToken() {
    return keycloak.idToken;
  }

  // Token'ın geçerli olup olmadığını kontrol et
  static isTokenValid() {
    return keycloak.authenticated && !keycloak.isTokenExpired();
  }

  // Kullanıcı bilgilerini al
  static getUserInfo() {
    if (keycloak.tokenParsed) {
      return {
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        firstName: keycloak.tokenParsed.given_name,
        lastName: keycloak.tokenParsed.family_name,
        roles: keycloak.tokenParsed.realm_access?.roles || [],
        sub: keycloak.tokenParsed.sub,
      };
    }
    return null;
  }

  // Kullanıcının belirli bir role sahip olup olmadığını kontrol et
  static hasRole(roleName) {
    return keycloak.hasRealmRole(roleName);
  }

  // Authentication durumunu kontrol et
  static isAuthenticated() {
    return keycloak.authenticated;
  }

  // Token'ı yenile
  static async refreshToken() {
    try {
      // Token'ı 5 saniye kala yenilemeye çalış
      const refreshed = await keycloak.updateToken(5); 
      if (refreshed) {
        console.log('Token refreshed successfully.');
        return keycloak.token;
      } else {
        console.log('Token is still valid, no refresh needed.');
        return keycloak.token;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Token yenilenemezse kullanıcıyı logout et
      this.logout();
      throw error; // Hatanın Axios interceptor'a iletilmesini sağla
    }
  }

  // Authorization header'ı al (API çağrıları için)
  static getAuthorizationHeader() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  // Axios için interceptor kur
  static setupAxiosInterceptors(axiosInstance) {
    // Request interceptor - her istekte token'ı header'a ekle
    axiosInstance.interceptors.request.use(
      async (config) => {
        // Token'ın geçerli olduğundan emin ol ve gerekiyorsa yenile
        // Keycloak'ın updateToken metodunu kullanmak daha güvenlidir.
        try {
          // Token'ı yenile (örneğin 5 saniye geçerliliği kalmışsa)
          // updateToken yalnızca token süresi bitmeye yakınsa yenileme yapar.
          const refreshed = await keycloak.updateToken(5);
          if (refreshed) {
            console.log('Token automatically refreshed before request.');
          }
        } catch (error) {
          console.error('Failed to auto-refresh token before request:', error);
          // Yenileme başarısız olursa, kullanıcıyı logout et
          KeycloakService.logout();
          return Promise.reject(new Error("Token yenileme başarısız, kullanıcı çıkış yaptı."));
        }
        
        const authHeader = KeycloakService.getAuthorizationHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - 401 durumunda logout yap
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized - redirecting to login');
          // 401 durumunda doğrudan Keycloak'ın login mekanizmasını kullan
          KeycloakService.login();
        }
        return Promise.reject(error);
      }
    );
  }

  // Event listener'lar ekle
  static addEventListeners() {
    keycloak.onTokenExpired = () => {
      console.log('Keycloak: Token expired.');
      // Token süresi dolduğunda Keycloak otomatik olarak updateToken çağrısını deneyecektir.
      // Eğer updateToken interceptor'da başarısız olursa logout'a düşecektir.
      // Burada ekstra bir refresh çağırmaya gerek yok, updateToken işini halleder.
    };

    keycloak.onAuthSuccess = () => {
      console.log('Keycloak: Authentication successful');
    };

    keycloak.onAuthError = (error) => {
      console.error('Keycloak: Authentication failed', error);
      // Hata oluştuğunda ne yapılacağına karar verin (örneğin kullanıcıya hata mesajı göster)
    };

    keycloak.onAuthRefreshSuccess = () => {
      console.log('Keycloak: Token refresh successful');
    };

    keycloak.onAuthRefreshError = () => {
      console.error('Keycloak: Token refresh failed, logging out.');
      // Token yenileme hatasında otomatik logout
      KeycloakService.logout(); 
    };

    keycloak.onAuthLogout = () => {
      console.log('Keycloak: User logged out');
      // Uygulamanızın state'ini güncellemek için bir callback mekanizması ekleyebilirsiniz.
    };
  }
}

export default KeycloakService;