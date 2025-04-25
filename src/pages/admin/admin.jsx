import React, { useState, useEffect } from 'react';
import './Admin.css';
import {
  getKurumStajyerleri,
  onaylaStaj,
  reddetStaj
} from "../../api";
import { getUser, clearUser } from "../../utils/auth";
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiBell, FiSearch, FiCalendar, FiCheck, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [stajyerler, setStajyerler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    durum: '',
    konu: '',
    ogrenci_adi: '',
    baslangic_tarihi: ''
  });
  const [activeTab, setActiveTab] = useState('tumu');
  const [user, setUser] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
      // Simüle edilmiş bildirimler
      setNotifications([
        { id: 1, message: '3 yeni başvuru bekliyor', read: false },
        { id: 2, message: 'Sistem güncellemesi yapıldı', read: true }
      ]);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getKurumStajyerleri();
        setStajyerler(data);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const handleOnayla = async (stajId) => {
    try {
      await onaylaStaj(stajId);
      const updatedStajyerler = stajyerler.map(staj =>
        staj.id === stajId ? { ...staj, durum: 'Onaylandı' } : staj
      );
      setStajyerler(updatedStajyerler);
    } catch (error) {
      console.error('Onaylama işlemi başarısız:', error);
    }
  };

  const handleReddet = async (stajId) => {
    try {
      await reddetStaj(stajId);
      const updatedStajyerler = stajyerler.map(staj =>
        staj.id === stajId ? { ...staj, durum: 'Reddedildi' } : staj
      );
      setStajyerler(updatedStajyerler);
    } catch (error) {
      console.error('Reddetme işlemi başarısız:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredStajyerler = stajyerler.filter(staj => {
    return (
      (filters.durum === '' || staj.durum === filters.durum) &&
      (filters.konu === '' || staj.konu.toLowerCase().includes(filters.konu.toLowerCase())) &&
      (filters.ogrenci_adi === '' || staj.ogrenci_adi.toLowerCase().includes(filters.ogrenci_adi.toLowerCase())) &&
      (filters.baslangic_tarihi === '' || staj.baslangic_tarihi === filters.baslangic_tarihi)
    );
  });

  const getFilteredByTab = () => {
    switch (activeTab) {
      case 'onayli':
        return filteredStajyerler.filter(staj => staj.durum === 'Onaylandı');
      case 'bekleyen':
        return filteredStajyerler.filter(staj => staj.durum === 'Beklemede');
      case 'reddedilen':
        return filteredStajyerler.filter(staj => staj.durum === 'Reddedildi');
      default:
        return filteredStajyerler;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const durumBadge = (durum) => {
    const classes = {
      Onaylandı: 'badge-success',
      Beklemede: 'badge-warning',
      Reddedildi: 'badge-error'
    };
    return <span className={`badge ${classes[durum]}`}>{durum}</span>;
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="admin-container">
      {/* Üst Navigasyon Çubuğu */}
      <nav className="admin-navbar">
        <div className="navbar-brand">
          <h1>StajYönet</h1>
          <span className="brand-subtitle">Üniversite Admin Paneli</span>
        </div>
        
        <div className="navbar-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Ara..." />
          </div>
          
          <div className="notification-bell">
            <FiBell />
            {unreadNotifications > 0 && (
              <span className="notification-count">{unreadNotifications}</span>
            )}
            <div className="notification-dropdown">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                  {notification.message}
                </div>
              ))}
            </div>
          </div>
          
          <div className="user-profile-dropdown">
            <div className="user-avatar">
              <FiUser />
            </div>
            <span className="username">{user?.name || 'Kullanıcı'}</span>
            <div className="dropdown-menu">
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Ana İçerik */}
      <div className="admin-main">
        {/* Dashboard Başlık ve İstatistikler */}
        <header className="dashboard-header">
          <div className="header-content">
            <h2>Staj Başvuru Yönetim Paneli</h2>
            <p>Toplam {stajyerler.length} başvuru bulunmaktadır</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <h3>Toplam Başvuru</h3>
                <p>{stajyerler.length}</p>
              </div>
              <div className="stat-icon total">
                <FiCalendar />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <h3>Onaylı</h3>
                <p>{stajyerler.filter(s => s.durum === 'Onaylandı').length}</p>
              </div>
              <div className="stat-icon approved">
                <FiCheck />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <h3>Bekleyen</h3>
                <p>{stajyerler.filter(s => s.durum === 'Beklemede').length}</p>
              </div>
              <div className="stat-icon pending">
                <FiCalendar />
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <h3>Reddedilen</h3>
                <p>{stajyerler.filter(s => s.durum === 'Reddedildi').length}</p>
              </div>
              <div className="stat-icon rejected">
                <FiX />
              </div>
            </div>
          </div>
        </header>

        {/* Filtreleme ve Tablar */}
        <div className="content-section">
          <div className="filters-tabs-container">
            <div className="mobile-filter-toggle" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
              <FiSearch /> Filtrele
            </div>
            
            <div className={`filters-section ${mobileFiltersOpen ? 'open' : ''}`}>
              <div className="filter-group">
                <label htmlFor="durum">Durum:</label>
                <select
                  id="durum"
                  name="durum"
                  value={filters.durum}
                  onChange={handleFilterChange}
                >
                  <option value="">Tümü</option>
                  <option value="Onaylandı">Onaylı</option>
                  <option value="Beklemede">Bekleyen</option>
                  <option value="Reddedildi">Reddedilen</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="konu">Konu:</label>
                <input
                  type="text"
                  id="konu"
                  name="konu"
                  value={filters.konu}
                  onChange={handleFilterChange}
                  placeholder="Staj konusu ara..."
                />
              </div>

              <div className="filter-group">
                <label htmlFor="ogrenci_adi">Öğrenci Adı:</label>
                <input
                  type="text"
                  id="ogrenci_adi"
                  name="ogrenci_adi"
                  value={filters.ogrenci_adi}
                  onChange={handleFilterChange}
                  placeholder="Öğrenci adı ara..."
                />
              </div>

              <div className="filter-group">
                <label htmlFor="baslangic_tarihi">Başlangıç Tarihi:</label>
                <input
                  type="date"
                  id="baslangic_tarihi"
                  name="baslangic_tarihi"
                  value={filters.baslangic_tarihi}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="tabs">
              <button
                className={activeTab === 'tumu' ? 'active' : ''}
                onClick={() => setActiveTab('tumu')}
              >
                Tüm Başvurular
              </button>
              <button
                className={activeTab === 'onayli' ? 'active' : ''}
                onClick={() => setActiveTab('onayli')}
              >
                Onaylılar
              </button>
              <button
                className={activeTab === 'bekleyen' ? 'active' : ''}
                onClick={() => setActiveTab('bekleyen')}
              >
                Bekleyenler
              </button>
              <button
                className={activeTab === 'reddedilen' ? 'active' : ''}
                onClick={() => setActiveTab('reddedilen')}
              >
                Reddedilenler
              </button>
            </div>
          </div>

          {/* Başvuru Listesi */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <div className="staj-listesi-container">
              {getFilteredByTab().length === 0 ? (
                <div className="no-results">
                  <img src="/no-data.svg" alt="Sonuç yok" />
                  <h3>Sonuç bulunamadı</h3>
                  <p>Filtrelerinizi değiştirmeyi deneyin</p>
                </div>
              ) : (
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Öğrenci Adı</th>
                        <th>Okul</th>
                        <th>Konu</th>
                        <th>Başlangıç Tarihi</th>
                        <th>Bitiş Tarihi</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredByTab().map((staj) => (
                        <tr key={staj.id}>
                          <td data-label="Öğrenci Adı">{staj.ogrenci_adi}</td>
                          <td data-label="Okul">{staj.okul_adi}</td>
                          <td data-label="Konu">{staj.konu}</td>
                          <td data-label="Başlangıç">{formatDate(staj.baslangic_tarihi)}</td>
                          <td data-label="Bitiş">{formatDate(staj.bitis_tarihi)}</td>
                          <td data-label="Durum">{durumBadge(staj.durum)}</td>
                          <td data-label="İşlemler" className="actions">
                            {staj.durum === 'Beklemede' && (
                              <div className="action-buttons">
                                <button
                                  className="btn-approve"
                                  onClick={() => handleOnayla(staj.id)}
                                >
                                  <FiCheck /> Onayla
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() => handleReddet(staj.id)}
                                >
                                  <FiX /> Reddet
                                </button>
                              </div>
                            )}
                            <Link to={`/admin/staj/${staj.id}`} className="btn-details">Detaylar</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;