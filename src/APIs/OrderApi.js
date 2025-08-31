const BASE_URL = 'http://localhost:8081'; // API Gateway URL'iniz

export const fetchAddOrder = async (orderData,tokenHeader) => {
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
        const response = await fetch(`${BASE_URL}/siparis`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(orderData)
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

export const fetchAddPayment = async (paymentData,tokenHeader) => {
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
        const response = await fetch(`${BASE_URL}/odeme`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(paymentData)
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
export const fetchOrdersByUserId=async(tokenHeader)=>{
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }

        const headers = {
            'Authorization': tokenHeader,
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(`${BASE_URL}/siparis/kullanici`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Siparişler yüklenemedi: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu işlemi yapmaya yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "Siparişler bulunamadı.";
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
export const fetchAllOrders=async(tokenHeader)=>{
    try {
        if (!tokenHeader) {
            return { error: true, status: 401, message: "Yetkilendirme başlığı bulunamadı." };
        }

        const headers = {
            'Authorization': tokenHeader,
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(`${BASE_URL}/siparis`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            const errorStatus = response.status;
            let errorMessage = `Siparişler yüklenemedi: ${errorStatus}`;

            if (errorStatus === 401) {
                errorMessage = "Giriş yapmanız gerekiyor. Token süresi dolmuş veya geçersiz.";
            } else if (errorStatus === 403) {
                errorMessage = "Bu işlemi yapmaya yetkiniz yok.";
            } else if (errorStatus === 404) {
                errorMessage = "Siparişler bulunamadı.";
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