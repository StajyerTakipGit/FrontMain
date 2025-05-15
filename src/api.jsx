import axios from "axios";
import { toast } from "react-toastify";

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
//////// KURUM APİLERİ ////////
export const getStajyerler = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.get(
      `http://192.168.128.74:8000/api/kurum/stajyerler/`,
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
export const StajOnay = async (id, onaylandi) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.patch(
      `${apiUrl}/api/kurum/stajlar/${id}/`,
      {
        kurum_onaylandi: onaylandi,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Staj durumu güncellendi:", response.data);
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.response?.data || error.message);
    throw error;
  }
};
export const StajPuanla = async (id, puan, aciklama) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    const response = await axios.patch(
      `${apiUrl}/api/kurum/stajlar/${id}/`,
      {
        kurum_puani: puan,
        kurum_aciklama: aciklama, // true veya false
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Staj durumu güncellendi:", response.data);
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.response?.data || error.message);
    throw error;
  }
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // 'YYYY-MM-DD' formatı
};
export const kurumKayit = (email, isim) => {
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
      `${apiUrl}/api/hesap-talep/`,
      {
        email: email,
        isim: isim,
        rol: "KURUM",
        onaylandi: true,
        tarih: getToday(),
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
        description: "Kurum başarıyla kaydedildi",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {}, 2000);
      console.log(response);
    })
    .catch((error) => {
      if (error.response) {
        // Sunucu cevap verdiyse (örneğin 400 Bad Request), hata detayını yazdır
        console.error("Hata detayları:", error.response.data);
        console.error("Durum kodu:", error.response.status);
        toast.error(`Hata: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // İstek gönderildi ama sunucudan cevap gelmedi
        console.error("Sunucudan cevap yok:", error.request);
        toast.error("Sunucuya ulaşılamıyor.");
      } else {
        // Başka bir hata (örneğin axios ayarıyla ilgili)
        console.error("İstek oluşturulurken hata oluştu:", error.message);
        toast.error("Bir hata oluştu.");
      }
    });
};

export const kurumKayitListe = () => {
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
    .get(`${apiUrl}/api/hesap-talep-listesi/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      setTimeout(() => {}, 2000);
      console.log(response);
    })
    .catch((error) => {
      if (error.response) {
        // Sunucu cevap verdiyse (örneğin 400 Bad Request), hata detayını yazdır
        console.error("Hata detayları:", error.response.data);
        console.error("Durum kodu:", error.response.status);
        toast.error(`Hata: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // İstek gönderildi ama sunucudan cevap gelmedi
        console.error("Sunucudan cevap yok:", error.request);
        toast.error("Sunucuya ulaşılamıyor.");
      } else {
        // Başka bir hata (örneğin axios ayarıyla ilgili)
        console.error("İstek oluşturulurken hata oluştu:", error.message);
        toast.error("Bir hata oluştu.");
      }
    });
};

///////// ADMIN APİLERİ /////////
export const onayliStajlar = async () => {
  try {
    const token = localStorage.getItem("token");
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
    const response = await axios.get(`${apiUrl}/api/admin/stajlar/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.response?.data || error.message);
    throw error;
  }
};
export const adminOnay = async (id) => {
  try {
    const token = localStorage.getItem("token");
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
    const response = await axios.patch(
      `${apiUrl}/api/admin/stajlar/${id}/`,
      { admin_onaylandi: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.response?.data || error.message);
    throw error;
  }
};

export const adminRed = async (id) => {
  try {
    const token = localStorage.getItem("token");
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
    const response = await axios.patch(
      `${apiUrl}/api/admin/stajlar/${id}/`,
      { admin_onaylandi: false, kurum_onaylandi: false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.response?.data || error.message);
    throw error;
  }
};

export const getFiltreliStajlar = async (filters) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token bulunamadı. Lütfen giriş yapınız.");
    }

    // Filtre parametrelerini oluştur
    const queryParams = new URLSearchParams();
    if (filters.durum) queryParams.append("durum", filters.durum);
    if (filters.konu) queryParams.append("konu", filters.konu);
    if (filters.ogrenci_adi)
      queryParams.append("ogrenci__isim", filters.ogrenci_adi);
    if (filters.baslangic_tarihi)
      queryParams.append("baslangic_tarihi", filters.baslangic_tarihi);

    console.log(queryParams.toString());
    // Eğer hiç filtre yoksa, normal stajlar endpoint'ini kullan
    const endpoint = queryParams.toString()
      ? `${apiUrl}/api/admin/stajlar/filtreli/?${queryParams.toString()}`
      : `${apiUrl}/api/admin/stajlar/`;

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Staj listesi alınırken hata oluştu:",
      error.response?.data || error.message
    );
    throw error;
  }
};
