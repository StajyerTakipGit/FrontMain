import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Ogrenci from "./pages/Ogrenci/Ogrenci";
import Login from "./pages/Login/Login";
import Profil from "./pages/Profil/Profil";
import StajDetay from "./pages/staj_detay/StajDetay";
import StajDefteri from "./pages/Staj-defteri/Staj-defteri";
import Kurum from "./pages/Kurum/Kurum";
import Admin from "./pages/admin/admin";
import KurumStajDetay from "./pages/KurumStajDetay/KurumStajDetay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/ogrenci" element={<Ogrenci />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/kurum" element={<Kurum />} />
        <Route path="/staj-detay/:id" element={<StajDetay />} />
        <Route path="/kurum-staj-detay/:id" element={<KurumStajDetay />} />
        {/* Admin Route'ları */}
        <Route path="/admin" element={<Admin />} />

        <Route path="/staj-defteri/:id" element={<StajDefteri />} />
      </Routes>
    </BrowserRouter>
  );
}

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
}

export default App;
