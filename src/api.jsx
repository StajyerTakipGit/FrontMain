import axios from "axios";
const apiUrl = "http://192.168.68.74:8000";

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
export const DefteriYukle = (staj, gunler, toast) => {
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

  gunler.forEach((g) => {
    axios.post(
      `${apiUrl}/api/ogrenci/stajlar/${staj.id}/defter/`,
      {
        gun_no: g.date,
        icerik: g.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  });
};
