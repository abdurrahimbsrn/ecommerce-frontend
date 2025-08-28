import KeycloakService from '../KeycloakService';
const BASE_URL = 'http://localhost:8081'; // API Gateway URL'iniz


export const fetchAllProducts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/urun/all`);

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
export const fetchAddProduct = async (yeniKategori,tokenHeader) => {
    try {
         //const tokenHeader = KeycloakService.getAuthorizationHeader();
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }


        const headers = {
            'Authorization': tokenHeader,
            'Content-Type': 'application/json'
        };

        // URL'ye '{id}' parametresini ekliyoruz
        const response = await fetch(`${BASE_URL}/urun/add`, {
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
export const fetchProductsByCategory=async(kategoriId)=>{
    try {
        const response = await fetch(`${BASE_URL}/urun/kategori/`+kategoriId);

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
}
