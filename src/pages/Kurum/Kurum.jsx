import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar"; // Varsayılan sidebar kullanılıyor
import Header from "../../components/header"; // Varsayılan header kullanılıyor
import "./kurum.css"; // Kurum sayfasına özel CSS
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IconButton,
  Box,
  Button,
  Flex,
  Table,
  Modal,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Spacer,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast, // Toast bildirimi için eklendi
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser, // Kurum için ikon
  faUserCheck, // Onaylanmış stajyerler
  faUserClock, // Bekleyen stajyerler
  faUsers, // Toplam stajyer sayısı
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// Kurum için API fonksiyonları (Bunları oluşturmanız gerekecek)
import { getKurumStajyerleri, onaylaStaj, reddetStaj } from "../../api"; // Varsayımsal API fonksiyonları

function Kurum() {
  const navigate = useNavigate();
  const toast = useToast(); // Toast hook'u
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure();
  const { isOpen: isRejectOpen, onOpen: onRejectOpen, onClose: onRejectClose } = useDisclosure();
  const [selectedStaj, setSelectedStaj] = useState(null); // Seçilen stajyeri tutmak için state

  // Kuruma ait stajyerleri getiren query
  const {
    data: stajyerler,
    isLoading,
    error: fetchError,
    refetch, // Veriyi yenilemek için
  } = useQuery({
    queryKey: ["kurumStajyerleri"],
    queryFn: getKurumStajyerleri, // API fonksiyonu
  });

  // Staj onaylama mutation'ı
  const { mutate: approveMutate, isLoading: isApproving } = useMutation({
    mutationFn: (stajId) => onaylaStaj(stajId), // API fonksiyonu
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Staj başvurusu onaylandı.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch(); // Listeyi güncelle
      onApproveClose(); // Modalı kapat
      setSelectedStaj(null); // Seçimi temizle
    },
    onError: (err) => {
      toast({
        title: "Hata",
        description: err.message || "Staj onaylanırken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onApproveClose();
    },
  });

  // Staj reddetme mutation'ı
  const { mutate: rejectMutate, isLoading: isRejecting } = useMutation({
    mutationFn: (stajId) => reddetStaj(stajId), // API fonksiyonu
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Staj başvurusu reddedildi.",
        status: "warning", // Bilgilendirme amaçlı warning
        duration: 3000,
        isClosable: true,
      });
      refetch(); // Listeyi güncelle
      onRejectClose(); // Modalı kapat
      setSelectedStaj(null); // Seçimi temizle
    },
    onError: (err) => {
      toast({
        title: "Hata",
        description: err.message || "Staj reddedilirken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onRejectClose();
    },
  });

  // Onaylama modalını açar ve ilgili stajı seçer
  const handleApproveClick = (staj) => {
    setSelectedStaj(staj);
    onApproveOpen();
  };

  // Reddetme modalını açar ve ilgili stajı seçer
  const handleRejectClick = (staj) => {
    setSelectedStaj(staj);
    onRejectOpen();
  };

  // Onaylama işlemini tetikler
  const confirmApprove = () => {
    if (selectedStaj) {
      approveMutate(selectedStaj.id);
    }
  };

  // Reddetme işlemini tetikler
  const confirmReject = () => {
    if (selectedStaj) {
      rejectMutate(selectedStaj.id);
    }
  };

  // Kurum için kart verileri (Örnek veriler, API'den gelen verilerle doldurulmalı)
  const cards = [
    {
      title: "Aktif Stajyerler",
      value: stajyerler?.filter(s => s.durum === 'Onaylandı').length || 0, // API'den gelen veriye göre hesaplanmalı
      subtitle: "Şu anda staj yapan öğrenci sayısı",
      icon: faUserCheck,
    },
    {
      title: "Bekleyen Başvurular",
      value: stajyerler?.filter(s => s.durum === 'Beklemede').length || 0, // API'den gelen veriye göre hesaplanmalı
      subtitle: "Onayınızı bekleyen staj başvuruları",
      icon: faUserClock,
    },
    {
      title: "Toplam Stajyer",
      value: stajyerler?.length || 0, // API'den gelen veriye göre hesaplanmalı
      subtitle: "Bugüne kadar staj yapan/yapacak öğrenci",
      icon: faUsers,
    },
    // İhtiyaca göre daha fazla kart eklenebilir
  ];

  // --- Kart Slider Logic (Ogrenci.jsx'ten alındı) ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
      setCurrentIndex(0); // Ekran boyutu değiştiğinde başa dön
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPrevious = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setAnimating(false), 500);
  };

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentIndex((prev) => Math.min(prev + 1, Math.max(0, cards.length - visibleCards)));
    setTimeout(() => setAnimating(false), 500);
  };
  // --- Kart Slider Logic Bitiş ---


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Kurum profil bilgisi (Opsiyonel, Header'da kullanılabilir)
  // const { data: kurumProfili } = useQuery({ queryKey: ['kurumProfili'], queryFn: getKurumProfili });

  const logOut = () => {
    localStorage.removeItem("token"); // Veya kurum token'ı
    navigate("/kurum-login"); // Kurum login sayfasına yönlendir
  };

  return (
    <>
      {isSidebarOpen && <Sidebar userType="kurum" />} {/* userType prop'u eklendi */}
      <div className="kurum-content"> {/* Ana içerik için farklı class */}
        <Header toggleSidebar={toggleSidebar} /* kurumAdi={kurumProfili?.adi} */ />

        {/* Kartlar Bölümü */}
        <div className="kurum-rows">
          <div className="kurum-rows-border">
            <Flex position="relative" width="100%" height="210px" my={4}>
              {currentIndex > 0 && (
                <IconButton
                  aria-label="Previous"
                  icon={<FontAwesomeIcon icon={faChevronLeft} />}
                  position="absolute" left="-15px" top="38%" zIndex={2}
                  rounded="full" onClick={goToPrevious} bg="white" shadow="md"
                  isDisabled={animating}
                />
              )}
              <Box width="100%" overflow="hidden" position="relative">
                <Flex
                  width={`${(cards.length / visibleCards) * 100}%`} // Dinamik genişlik
                  gap={4}
                  transition="transform 0.5s ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / cards.length)}%)` }} // Kaydırma hesabı düzeltildi
                >
                  {cards.map((card, index) => (
                    <Box
                      key={index} p={6} rounded="2xl" shadow="md"
                      className="kurum-box" // Kurum kartları için class
                      minWidth={`calc(${100 / visibleCards}% - ${4 * (visibleCards - 1)}px)`} // Dinamik minWidth
                      flexShrink={0}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="lg" color="gray.600">{card.title}</Text>
                        <FontAwesomeIcon icon={card.icon} size="lg" color="#4A5568" />
                      </Flex>
                      <Text fontWeight="bold" fontSize="2xl" mt={2}>{card.value}</Text>
                      <Text mt={2} color="gray.500" fontSize="sm">{card.subtitle}</Text>
                      {/* Kartlara özel başka bileşenler eklenebilir, örn. progress bar */}
                    </Box>
                  ))}
                </Flex>
              </Box>
              {currentIndex < cards.length - visibleCards && (
                 <IconButton
                  aria-label="Next"
                  icon={<FontAwesomeIcon icon={faChevronRight} />}
                  position="absolute" right="-15px" top="38%" zIndex={2}
                  rounded="full" onClick={goToNext} bg="white" shadow="md"
                  isDisabled={animating}
                />
              )}
            </Flex>
          </div>
        </div>

        {/* Stajyer Listesi Tablosu */}
        <Box
          bg="white" color="black" p={5} borderRadius="lg" m={6} /* Margin eklendi */
          boxShadow="md" /* Gölge eklendi */
        >
          <Flex mb={4} align="center">
            <Text fontSize="2xl" fontWeight="semi-bold">
              Staj Başvuruları
            </Text>
            <Spacer />
            {/* Kurum tarafında yeni başvuru butonu genelde olmaz, kaldırılabilir veya farklı bir işlev eklenebilir */}
            {/* <Button colorScheme="blue" onClick={onOpen}>+ Yeni Stajyer Ekle?</Button> */}
          </Flex>

          <Box maxHeight="400px" overflowY="auto" className="kurum-staj-tablosu">
            {isLoading ? (
              <Text textAlign="center" p={4}>Yükleniyor...</Text>
            ) : fetchError ? (
              <Text textAlign="center" color="red.500" p={4}>Stajyerler yüklenirken bir hata oluştu.</Text>
            ) : (
              <Table variant="simple" size="md">
                <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
                  <Tr>
                    <Th>Öğrenci Adı</Th>
                    <Th>Okulu</Th>
                    <Th>Departman/Konu</Th>
                    <Th>Başlangıç</Th>
                    <Th>Bitiş</Th>
                    <Th>Durum</Th>
                    <Th textAlign="center">İşlemler</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stajyerler && stajyerler.length > 0 ? (
                    stajyerler.map((staj, index) => (
                      <Tr key={staj.id || index} _hover={{ bg: "gray.50" }}>
                        <Td>{staj.ogrenci_adi || "N/A"}</Td>
                        <Td>{staj.okul_adi || "N/A"}</Td>
                        <Td>{staj.konu || "N/A"}</Td>
                        <Td>{staj.baslangic_tarihi || "N/A"}</Td>
                        <Td>{staj.bitis_tarihi || "N/A"}</Td>
                        <Td>
                          <Badge
                             colorScheme={
                               staj.durum === 'Onaylandı' ? 'green' :
                               staj.durum === 'Reddedildi' ? 'red' :
                               'yellow' // Beklemede için
                             }
                             variant="subtle" // Daha yumuşak görünüm
                          >
                            {staj.durum || 'Beklemede'}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          {staj.durum === 'Beklemede' ? (
                            <Flex justify="center" gap={2}>
                              <IconButton
                                aria-label="Onayla"
                                icon={<FontAwesomeIcon icon={faCheck} />}
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleApproveClick(staj)}
                                isLoading={isApproving && selectedStaj?.id === staj.id}
                              />
                              <IconButton
                                aria-label="Reddet"
                                icon={<FontAwesomeIcon icon={faTimes} />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleRejectClick(staj)}
                                isLoading={isRejecting && selectedStaj?.id === staj.id}
                              />
                            </Flex>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="blue"
                              onClick={() => navigate(`/kurum/stajyer-detay/${staj.id}`)} // Detay sayfasına yönlendirme
                            >
                              Detay Gör
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center" p={4}>
                        Henüz staj başvurusu bulunmamaktadır.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>

        {/* Onaylama Modalı */}
        <Modal isOpen={isApproveOpen} onClose={onApproveClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Staj Başvurusunu Onayla</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>{selectedStaj?.ogrenci_adi}</strong> adlı öğrencinin staj başvurusunu onaylamak istediğinize emin misiniz?
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onApproveClose} isDisabled={isApproving}>
                İptal
              </Button>
              <Button colorScheme="green" onClick={confirmApprove} isLoading={isApproving}>
                Onayla
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Reddetme Modalı */}
        <Modal isOpen={isRejectOpen} onClose={onRejectClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Staj Başvurusunu Reddet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>{selectedStaj?.ogrenci_adi}</strong> adlı öğrencinin staj başvurusunu reddetmek istediğinize emin misiniz?
              </Text>
              {/* İsteğe bağlı: Reddetme nedeni için bir input eklenebilir */}
              {/* <Textarea placeholder="Reddetme nedeni (isteğe bağlı)" mt={3} /> */}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onRejectClose} isDisabled={isRejecting}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={confirmReject} isLoading={isRejecting}>
                Reddet
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>
    </>
  );
}

export default Kurum;