import axios from "axios";

const apiUrl = "http://127.0.0.1:8000";

export const fetchlogin = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/giris/`, {
      email: userData.email,
      password: userData.password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Giriş sırasında bir hata oluştu:", error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.get(`${apiUrl}/api/ogrenci/stajlar/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Staj verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

export const getDefter = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.get(
      `${apiUrl}/api/ogrenci/stajlar/${id}/defter/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "API isteği hatası:",
      error.response ? error.response : error.message
    );
    throw error;
  }
};

export const YeniStaj = async (stajData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.post(
      `${apiUrl}/api/ogrenci/stajlar/`,
      stajData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data, console.log(response.data);
  } catch (error) {
    console.error("Staj eklenirken bir hata oluştu:", error);
    throw error;
  }
};
export const DefteriYukle = (staj, gun_no, content, toast) => {
  const token = localStorage.getItem("token");
  console.log("token çekildi");
  if (!token) {
    toast({
      title: "Hata",
      description: "Giriş yapmanız gerekiyor.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  // Send a single entry (gun_no and content) to the backend
  axios
    .post(
      `${apiUrl}/api/ogrenci/stajlar/${staj.id}/defter/`,
      {
        gun_no: gun_no,
        icerik: content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      toast({
        title: "Başarıyla Kaydedildi",
        description: "Günlük başarıyla kaydedildi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      console.log(response);
    })
    .catch((error) => {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error:", error.message); // Log error details
    });
};
export const patchDefter = async ({ staj, gun_no, content, toast }) => {
  const token = localStorage.getItem("token");
  console.log("token çekildi");
  if (!token) {
    toast({
      title: "Hata",
      description: "Giriş yapmanız gerekiyor.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  // Send a single entry (gun_no and content) to the backend
  axios
    .patch(
      `${apiUrl}/api/ogrenci/stajlar/${staj.id}/defter/guncelle/`,
      {
        gun_no: gun_no,
        icerik: content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      toast({
        title: "Başarıyla Kaydedildi",
        description: "Günlük başarıyla kaydedildi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      console.log(response);
    })
    .catch((error) => {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log({ gun_no, icerik: content });
      console.error("Error:", error.message); // Log error details
    });
};
// src/mockApi.js (veya src/api.js içinde)

// Başlangıç için sahte stajyer verisi
let mockStajyerler = [
  {
    id: 1,
    ogrenci_adi: "Ayşe Yılmaz",
    okul_adi: "İstanbul Teknik Üniversitesi",
    konu: "Yazılım Geliştirme",
    baslangic_tarihi: "2024-07-15",
    bitis_tarihi: "2024-09-15",
    durum: "Beklemede", // 'Beklemede', 'Onaylandı', 'Reddedildi'
  },
  {
    id: 2,
    ogrenci_adi: "Mehmet Öztürk",
    okul_adi: "Orta Doğu Teknik Üniversitesi",
    konu: "Veri Analizi",
    baslangic_tarihi: "2024-08-01",
    bitis_tarihi: "2024-09-30",
    durum: "Onaylandı",
  },
  {
    id: 3,
    ogrenci_adi: "Fatma Demir",
    okul_adi: "Boğaziçi Üniversitesi",
    konu: "Pazarlama",
    baslangic_tarihi: "2024-07-20",
    bitis_tarihi: "2024-08-20",
    durum: "Reddedildi",
  },
  {
    id: 4,
    ogrenci_adi: "Ali Vural",
    okul_adi: "Yıldız Teknik Üniversitesi",
    konu: "Web Tasarım",
    baslangic_tarihi: "2024-09-01",
    bitis_tarihi: "2024-11-01",
    durum: "Beklemede",
  },
];

// Sahte ağ gecikmesi simülasyonu için yardımcı fonksiyon
const simulateNetworkDelay = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const getKurumStajyerleri = async () => {
  console.log("Mock API: getKurumStajyerleri çağrıldı.");
  await simulateNetworkDelay(); // Ağ gecikmesini simüle et

  return [...mockStajyerler];
};

export const onaylaStaj = async (stajId) => {
  console.log(`Mock API: onaylaStaj çağrıldı (ID: ${stajId}).`);
  await simulateNetworkDelay();
  const stajIndex = mockStajyerler.findIndex((staj) => staj.id === stajId);
  if (stajIndex !== -1) {
    mockStajyerler[stajIndex].durum = "Onaylandı";
    console.log("Mock Data Güncellendi:", mockStajyerler[stajIndex]);
    return { success: true, message: "Staj başarıyla onaylandı." };
  } else {
    // Gerçek API'de 404 Not Found gibi bir hata dönebilir.
    console.error(`Mock API Hata: Staj bulunamadı (ID: ${stajId})`);
    throw new Error("Staj bulunamadı."); // Hata fırlat
  }
};

export const reddetStaj = async (stajId) => {
  console.log(`Mock API: reddetStaj çağrıldı (ID: ${stajId}).`);
  await simulateNetworkDelay();
  const stajIndex = mockStajyerler.findIndex((staj) => staj.id === stajId);
  if (stajIndex !== -1) {
    mockStajyerler[stajIndex].durum = "Reddedildi";
    console.log("Mock Data Güncellendi:", mockStajyerler[stajIndex]);
    return { success: true, message: "Staj başarıyla reddedildi." };
  } else {
    console.error(`Mock API Hata: Staj bulunamadı (ID: ${stajId})`);
    throw new Error("Staj bulunamadı.");
  }
};

// Gerçek API fonksiyonları (mock yerine)
export const getKurumStajyerleri1 = async () => {
  const response = await axios.get(`${apiUrl}/api/admin/stajlar/`);
  return response.data;
};

export const onaylaStaj1 = async (stajId) => {
  const response = await axios.patch(`${apiUrl}/api/admin/stajlar/${stajId}/`, {
    admin_onay: true,
  });
  return response.data;
};

export const reddetStaj1 = async (stajId) => {
  const response = await axios.patch(`${apiUrl}/api/admin/stajlar/${stajId}/`, {
    admin_onay: false,
  });
  return response.data;
};

// Token'ı localStorage'dan al (eğer gerekiyorsa)
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`,
};

// 1. Başvuran Stajyerleri Listele
export const getKurumStajyerleri2 = async () => {
  const response = await axios.get("/api/kurum/stajyerler/", { headers });
  return response.data;
};

// 2. Staj Onaylama / Puan Verme (sadece onay içinse body boş kalabilir)
export const onaylaStaj2 = async (id) => {
  const response = await axios.patch(
    `/api/kurum/stajyerler/${id}/`,
    {},
    { headers }
  );
  return response.data;
};

// 3. Reddetme
export const reddetStaj2 = async (id) => {
  const response = await axios.post(
    `/api/kurum/stajyerler/${id}/reddet/`,
    {},
    { headers }
  );
  return response.data;
};
