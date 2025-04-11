import axios from "axios";

export const fetchlogin = async (userData) => {
  const response = await axios.post("http://192.168.228.188:8000/api/giris/", {
    email: userData.email,
    password: userData.password,
  });
  return response.data;
};

/*export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get("http://localhost:8000/api/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};*/
