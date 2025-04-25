import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiPrinter, 
  FiMail, 
  FiCheck, 
  FiX, 
  FiEdit,
  FiClock,
  FiUser,
  FiCalendar,
  FiBook,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { getStajDetay, indirStajBelgesi, stajDegerlendir } from '../../api';
import { formatDate, durumBadge } from '../../utils/helpers';
import ProgressStepper from '../../components/ProgressStepper';
import DocumentPreview from '../../components/DocumentPreview';
import CommentSection from '../../components/CommentSection';
import './StajDetay.css';

const StajDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staj, setStaj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [degerlendirmeNotu, setDegerlendirmeNotu] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('genel');
  const [expandedSections, setExpandedSections] = useState({
    temel: true,
    staj: true,
    iletisim: true,
    degerlendirme: true
  });

  useEffect(() => {
    const fetchStajDetay = async () => {
      try {
        setLoading(true);
        const data = await getStajDetay(id);
        setStaj(data);
        setDegerlendirmeNotu(data.degerlendirme_notu || '');
        setLoading(false);
      } catch (err) {
        setError('Başvuru detayları yüklenirken hata oluştu');
        setLoading(false);
      }
    };

    fetchStajDetay();
  }, [id]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBelgeIndir = async () => {
    try {
      await indirStajBelgesi(id);
      // Bildirim göster
    } catch (err) {
      console.error('Belge indirme hatası:', err);
      // Hata bildirimi göster
    }
  };

  const handleDegerlendirmeGonder = async (durum) => {
    try {
      await stajDegerlendir(id, durum, degerlendirmeNotu);
      setStaj(prev => ({ 
        ...prev, 
        durum, 
        degerlendirme_notu: degerlendirmeNotu,
        degerlendirme_tarihi: new Date().toISOString(),
        degerlendiren: "Mevcut Kullanıcı"
      }));
      setIsEditing(false);
      // Başarı bildirimi göster
    } catch (err) {
      console.error('Değerlendirme gönderilemedi:', err);
      // Hata bildirimi göster
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Başvuru detayları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Hata Oluştu</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            <FiArrowLeft /> Geri Dön
          </button>
        </div>
      </div>
    );
  }

  if (!staj) {
    return (
      <div className="no-data-container">
        <div className="no-data-message">
          <h3>Başvuru bulunamadı</h3>
          <p>Belirtilen ID ile bir staj başvurusu bulunamadı.</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            <FiArrowLeft /> Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staj-detay-container">
      <div className="staj-header">
        <div className="header-top">
          <button onClick={() => navigate(-1)} className="btn btn-back">
            <FiArrowLeft /> Geri
          </button>
          <div className="header-title">
            <h1>Staj Başvuru Detayları</h1>
            <div className="header-subtitle">
              <span>Başvuru No: #{staj.id}</span>
              <span className="status-badge">{durumBadge(staj.durum)}</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleBelgeIndir} className="btn btn-secondary">
              <FiDownload /> Belge İndir
            </button>
            <button className="btn btn-secondary">
              <FiPrinter /> Yazdır
            </button>
          </div>
        </div>

        <ProgressStepper 
          currentStatus={staj.durum}
          steps={[
            { status: 'Beklemede', label: 'Başvuru Alındı' },
            { status: 'Onaylandı', label: 'Onaylandı' },
            { status: 'Tamamlandı', label: 'Tamamlandı' }
          ]}
        />
      </div>

      <div className="staj-content">
        <div className="staj-tabs">
          <button 
            className={`tab-btn ${activeTab === 'genel' ? 'active' : ''}`}
            onClick={() => handleTabChange('genel')}
          >
            Genel Bilgiler
          </button>
          <button 
            className={`tab-btn ${activeTab === 'belgeler' ? 'active' : ''}`}
            onClick={() => handleTabChange('belgeler')}
          >
            Belgeler
          </button>
          <button 
            className={`tab-btn ${activeTab === 'yorumlar' ? 'active' : ''}`}
            onClick={() => handleTabChange('yorumlar')}
          >
            Yorumlar
          </button>
        </div>

        {activeTab === 'genel' && (
          <div className="tab-content">
            <div className="info-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('temel')}
              >
                <h3>
                  <FiUser className="section-icon" />
                  Temel Bilgiler
                </h3>
                {expandedSections.temel ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.temel && (
                <div className="section-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Öğrenci Adı:</span>
                      <span className="info-value">{staj.ogrenci_adi}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Öğrenci No:</span>
                      <span className="info-value">{staj.ogrenci_no}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Okul:</span>
                      <span className="info-value">{staj.okul_adi}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bölüm:</span>
                      <span className="info-value">{staj.bolum_adi}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Başvuru Tarihi:</span>
                      <span className="info-value">{formatDate(staj.basvuru_tarihi)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('staj')}
              >
                <h3>
                  <FiCalendar className="section-icon" />
                  Staj Bilgileri
                </h3>
                {expandedSections.staj ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.staj && (
                <div className="section-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Staj Türü:</span>
                      <span className="info-value">{staj.staj_turu}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Konu:</span>
                      <span className="info-value">{staj.konu}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Başlangıç Tarihi:</span>
                      <span className="info-value">{formatDate(staj.baslangic_tarihi)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Bitiş Tarihi:</span>
                      <span className="info-value">{formatDate(staj.bitis_tarihi)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Toplam Gün:</span>
                      <span className="info-value">{staj.toplam_gun} gün</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('iletisim')}
              >
                <h3>
                  <FiPhone className="section-icon" />
                  İletişim Bilgileri
                </h3>
                {expandedSections.iletisim ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.iletisim && (
                <div className="section-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">E-Posta:</span>
                      <span className="info-value">
                        <a href={`mailto:${staj.ogrenci_email}`}>{staj.ogrenci_email}</a>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Telefon:</span>
                      <span className="info-value">
                        <a href={`tel:${staj.ogrenci_telefon}`}>{staj.ogrenci_telefon}</a>
                      </span>
                    </div>
                    <div className="info-item full-width">
                      <span className="info-label">Adres:</span>
                      <span className="info-value">{staj.ogrenci_adres}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('degerlendirme')}
              >
                <h3>
                  <FiFileText className="section-icon" />
                  Değerlendirme
                </h3>
                {expandedSections.degerlendirme ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.degerlendirme && (
                <div className="section-body">
                  {isEditing ? (
                    <div className="evaluation-form">
                      <div className="form-group">
                        <label>Değerlendirme Notu</label>
                        <textarea
                          value={degerlendirmeNotu}
                          onChange={(e) => setDegerlendirmeNotu(e.target.value)}
                          placeholder="Değerlendirme notunuzu buraya yazın..."
                        />
                      </div>
                      <div className="form-actions">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="btn btn-cancel"
                        >
                          İptal
                        </button>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleDegerlendirmeGonder('Reddedildi')}
                            className="btn btn-danger"
                          >
                            <FiX /> Reddet
                          </button>
                          <button 
                            onClick={() => handleDegerlendirmeGonder('Onaylandı')}
                            className="btn btn-success"
                          >
                            <FiCheck /> Onayla
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="evaluation-info">
                      {staj.durum !== 'Beklemede' ? (
                        <>
                          <div className="info-grid">
                            <div className="info-item">
                              <span className="info-label">Durum:</span>
                              <span className="info-value">{durumBadge(staj.durum)}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Değerlendiren:</span>
                              <span className="info-value">{staj.degerlendiren || '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">Değerlendirme Tarihi:</span>
                              <span className="info-value">
                                {staj.degerlendirme_tarihi ? formatDate(staj.degerlendirme_tarihi) : '-'}
                              </span>
                            </div>
                          </div>
                          <div className="evaluation-note">
                            <h4>Değerlendirme Notu</h4>
                            <p>{staj.degerlendirme_notu || 'Değerlendirme notu bulunmamaktadır.'}</p>
                          </div>
                        </>
                      ) : (
                        <div className="pending-evaluation">
                          <FiClock className="pending-icon" />
                          <h4>Değerlendirme Bekliyor</h4>
                          <p>Bu başvuru henüz değerlendirilmemiş.</p>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="btn btn-primary"
                          >
                            <FiEdit /> Değerlendir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'belgeler' && (
          <div className="tab-content">
            <div className="documents-container">
              <div className="main-document">
                <h3>Staj Başvuru Formu</h3>
                <DocumentPreview 
                  documentUrl={`/api/documents/${id}/main`}
                  documentName="Staj_Basvuru_Formu.pdf"
                />
                <div className="document-actions">
                  <button onClick={handleBelgeIndir} className="btn btn-primary">
                    <FiDownload /> İndir
                  </button>
                  <button className="btn btn-secondary">
                    <FiPrinter /> Yazdır
                  </button>
                </div>
              </div>

              {staj.ek_belgeler && staj.ek_belgeler.length > 0 ? (
                <div className="additional-documents">
                  <h3>Ek Belgeler ({staj.ek_belgeler.length})</h3>
                  <div className="documents-grid">
                    {staj.ek_belgeler.map((belge, index) => (
                      <div key={index} className="document-card">
                        <DocumentPreview 
                          documentUrl={belge.url}
                          documentName={belge.belge_adi}
                          size="small"
                        />
                        <div className="document-meta">
                          <span className="document-name">{belge.belge_adi}</span>
                          <span className="document-size">{belge.belge_boyutu}</span>
                        </div>
                        <button className="btn btn-download">
                          <FiDownload /> İndir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-documents">
                  <p>Ek belge bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'yorumlar' && (
          <div className="tab-content">
            <CommentSection 
              comments={staj.yorumlar || []}
              stajId={id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StajDetay;