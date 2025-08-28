import KeycloakService from '../KeycloakService';



const BASE_URL = 'http://localhost:8081'; // API Gateway URL'iniz

// KeycloakService'i import edin (eğer tokenHeader'ı doğrudan KeycloakService'ten alıyorsanız)

export const fetchKullanici = async (tokenHeader) => {
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }

        const headers = {
            'Authorization': tokenHeader
        };

        const response = await fetch(`${BASE_URL}/kullanici`, { headers });

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Sunucu hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu kaynağa erişim yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "İstenen kaynak bulunamadı.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("fetchKullanici API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Sunucuya bağlanırken bir hata oluştu." };
    }
};

// updateKullanici fonksiyonu şimdi bir 'id' parametresi alıyor
export const updateKullanici = async (id, userData, tokenHeader) => {
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }
        if (!id) {
            return { error: true, status: 400, message: "Kullanıcı ID'si eksik. Güncelleme yapılamaz." };
        }

        const headers = {
            'Authorization': tokenHeader,
            'Content-Type': 'application/json'
        };

        // URL'ye '{id}' parametresini ekliyoruz
        const response = await fetch(`${BASE_URL}/kullanici/${id}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Profil güncelleme hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu işlemi yapmaya yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "Kullanıcı bilgileri bulunamadı.";
            } else if (errorStatus === 400) {
                const errorData = await response.json();
                errorMessage = errorData.message || "Geçersiz veri.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("updateKullanici API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Profil güncellenirken bir bağlantı hatası oluştu." };
    }
};


export const fetchAllKullanici = async (tokenHeader) => {
    try {
         //const tokenHeader = KeycloakService.getAuthorizationHeader();
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }

        const headers = {
            'Authorization': tokenHeader
        };

        const response = await fetch(`${BASE_URL}/kullanici/all`, { headers });

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Sunucu hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu kaynağa erişim yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "İstenen kaynak bulunamadı.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("fetchKullanici API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Sunucuya bağlanırken bir hata oluştu." };
    }
};
// updateKullanici fonksiyonu şimdi bir 'id' parametresi alıyor
export const fetchAddCategory = async (yeniKategori) => {
    try {
        const tokenHeader = KeycloakService.getAuthorizationHeader();
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }
        const headers = {
            'Authorization': tokenHeader,
            'Content-Type': 'application/json'
        };

        // URL'ye '{id}' parametresini ekliyoruz
        const response = await fetch(`${BASE_URL}/kategori/add`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(yeniKategori)
        });

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Kategori ekleme hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu işlemi yapmaya yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "Kullanıcı bilgileri bulunamadı.";
            } else if (errorStatus === 400) {
                const errorData = await response.json();
                errorMessage = errorData.message || "Geçersiz veri.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("updateKullanici API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Profil güncellenirken bir bağlantı hatası oluştu." };
    }
};


export const fetchAllCategories = async () => {
    try {
        
        const response = await fetch(`${BASE_URL}/kategori/all`);

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Sunucu hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu kaynağa erişim yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "İstenen kaynak bulunamadı.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("fetchKategori API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Sunucuya bağlanırken bir hata oluştu." };
    }
};
export const fetchDeleteCategory = async (id, tokenHeader) => {
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }
        if (!id) {
            return { error: true, status: 400, message: "Kategori ID'si eksik. Silme işlemi yapılamaz." };
        }
        const headers = {
            'Authorization': tokenHeader
        };
        const response = await fetch(`${BASE_URL}/kategori/${id}`, {
            method: 'DELETE',
            headers: headers
        });
        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Kategori silme hatası: ${errorStatus}`;
            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu işlemi yapmaya yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "Kategori bulunamadı.";
            } else if (errorStatus === 400) {
                const errorData = await response.json();
                errorMessage = errorData.message || "Geçersiz istek.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }
        return { error: false, message: "Kategori başarıyla silindi." };
    } catch (error) {
        console.error("fetchDeleteCategory API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Kategori silinirken bir bağlantı hatası oluştu." };
    }
};

export const fetchAllUrun = async (tokenHeader) => {
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }

        const headers = {
            'Authorization': tokenHeader
        };

        const response = await fetch(`${BASE_URL}/urun/all`, { headers });

        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Sunucu hatası: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu kaynağa erişim yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "İstenen kaynak bulunamadı.";
            }
            return { error: true, status: errorStatus, message: errorMessage };
        }

        const data = await response.json();
        return { error: false, data: data };

    } catch (error) {
        console.error("fetchKullanici API çağrısı sırasında bir hata oluştu:", error.message);
        return { error: true, status: 500, message: "Sunucuya bağlanırken bir hata oluştu." };
    }
};