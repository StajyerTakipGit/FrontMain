import { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import "./kurum.css";
import { useQuery } from "@tanstack/react-query";
import { getStajyerler, StajOnay, StajPuanla } from "../../api";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Badge,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUserClock,
  faUsers,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function Kurum() {
  const navigate = useNavigate();
  const [selectedStaj, setSelectedStaj] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approvedCount, setApprovedCount] = useState("Veri yok");
  const {
    isOpen: isPuanModalOpen,
    onOpen: onPuanModalOpen,
    onClose: onPuanModalClose,
  } = useDisclosure();
  const [puan, setPuan] = useState("");
  const [aciklama, setAciklama] = useState("");

  const handleSavePuan = () => {
    StajPuanla(selectedStaj.id, puan, aciklama);
    onPuanModalClose();
  };

  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();

  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();

  const handleApproveClick = (stajyer) => {
    setSelectedStaj(stajyer);
    onApproveOpen();
  };

  const handleRejectClick = (stajyer) => {
    setSelectedStaj(stajyer);
    onRejectOpen();
  };

  const confirmApprove = async () => {
    try {
      setIsApproving(true);
      await StajOnay(selectedStaj.id, true);
      await refetch();
      onApproveClose();
    } catch (err) {
      console.error("Onaylama hatası:", err);
    } finally {
      setIsApproving(false);
    }
  };

  const confirmReject = async () => {
    try {
      setIsRejecting(true);
      await StajOnay(selectedStaj.id, false);
      await refetch();
      onRejectClose();
    } catch (err) {
      console.error("Reddetme hatası:", err);
    } finally {
      setIsRejecting(false);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  const [silinenStajyerler, setSilinenStajyerler] = useState([]);
  const handleGizle = (id) => {
    const updated = [...silinenStajyerler, id];
    setSilinenStajyerler(updated);
    localStorage.setItem("silinenStajyerler", JSON.stringify(updated));
  };

  const {
    data: stajyerler,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ["stajyerler"],
    queryFn: getStajyerler,
  });
  useEffect(() => {
    const stored = localStorage.getItem("silinenStajyerler");
    if (stored) {
      setSilinenStajyerler(JSON.parse(stored));
    }
  }, []);
  const handleResetSilinenler = () => {
    setSilinenStajyerler([]);
    localStorage.removeItem("silinenStajyerler");
  };
  useEffect(() => {
    if (stajyerler && Array.isArray(stajyerler)) {
      const count = stajyerler.filter(
        (stajyer) => stajyer.durum === "Aktif"
      ).length;
      setApprovedCount(count);
    }
  }, [stajyerler]);

  const cards = [
    {
      title: "Aktif Stajyerler",
      value: approvedCount,
      subtitle: "Şu anda staj yapan öğrenci sayısı",
      icon: faUserCheck,
    },
    {
      title: "Bekleyen Başvurular",
      value:
        stajyerler?.filter((stajyer) => stajyer.durum === "Beklemede")
          ?.length ?? 0,
      subtitle: "Onayınızı bekleyen staj başvuruları",
      icon: faUserClock,
    },
    {
      title: "Toplam Stajyer",
      value:
        stajyerler?.filter((stajyer) => !(stajyer.durum === "Reddedildi"))
          ?.length ?? 0,
      subtitle: "Bugüne kadar staj yapan/yapacak öğrenci",
      icon: faUsers,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
      setCurrentIndex(0);
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
    setCurrentIndex((prev) =>
      Math.min(prev + 1, Math.max(0, cards.length - visibleCards))
    );
    setTimeout(() => setAnimating(false), 500);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getBgColor = (durum) => {
    switch (durum) {
      case "Aktif":
        return "#B0E0E6";
      case "Beklemede":
        return "#E6E0B0";
      case "Reddedildi":
        return "#E6B0B0";
      default:
        return "transparent";
    }
  };

  return (
    <>
      {isSidebarOpen && <Sidebar userType="kurum" />}
      <div className="kurum-content">
        <Header toggleSidebar={toggleSidebar} />
        <div className="kurum-rows">
          <div className="kurum-rows-border">
            <Flex position="relative" width="100%" height="210px" my={4}>
              {currentIndex > 0 && (
                <IconButton
                  aria-label="Previous"
                  icon={<FontAwesomeIcon icon={faChevronLeft} />}
                  position="absolute"
                  left="-15px"
                  top="38%"
                  zIndex={2}
                  rounded="full"
                  onClick={goToPrevious}
                  bg="white"
                  shadow="md"
                  isDisabled={animating}
                />
              )}
              <Box width="100%" overflow="hidden" position="relative">
                <Flex
                  width={`${(cards.length / visibleCards) * 100}%`}
                  gap={4}
                  transition="transform 0.5s ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentIndex * (100 / cards.length)
                    }%)`,
                  }}
                >
                  {cards.map((card, index) => (
                    <Box
                      key={index}
                      p={6}
                      rounded="2xl"
                      shadow="md"
                      minWidth={`calc(${100 / visibleCards}% - ${
                        4 * (visibleCards - 1)
                      }px)`}
                      flexShrink={0}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="lg" color="gray.600">
                          {card.title}
                        </Text>
                        <FontAwesomeIcon
                          icon={card.icon}
                          size="lg"
                          color="#4A5568"
                        />
                      </Flex>
                      <Text fontWeight="bold" fontSize="2xl" mt={2}>
                        {card.value}
                      </Text>
                      <Text mt={2} color="gray.500" fontSize="sm">
                        {card.subtitle}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Box>
              {currentIndex < cards.length - visibleCards && (
                <IconButton
                  aria-label="Next"
                  icon={<FontAwesomeIcon icon={faChevronRight} />}
                  position="absolute"
                  right="-15px"
                  top="38%"
                  zIndex={2}
                  rounded="full"
                  onClick={goToNext}
                  bg="white"
                  shadow="md"
                  isDisabled={animating}
                />
              )}
            </Flex>
            <Button
              bg={"green"}
              color={"white"}
              onClick={handleResetSilinenler}
            >
              Gizlenenleri Göster
            </Button>
          </div>

          <div className="kurum-stajyer">
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th>Stajyer Adı</Th>
                  <Th>
                    {stajyerler?.some((s) => s.durum === "Aktif")
                      ? "Başlangıç Tarihi"
                      : "Başvuru Tarihi"}
                  </Th>
                  <Th>
                    {stajyerler?.some((s) => s.durum === "Aktif")
                      ? "Bitiş Tarihi"
                      : "Başvuru Durumu"}
                  </Th>
                  <Th>Konu</Th>
                  {stajyerler?.some((s) => s.durum === "Aktif") && (
                    <Th>Kurum Puanı</Th>
                  )}
                  <Th>İşlemler</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan="6" textAlign="center">
                      Yükleniyor...
                    </Td>
                  </Tr>
                ) : fetchError ? (
                  <Tr>
                    <Td colSpan="6" textAlign="center">
                      Hata oluştu. Lütfen tekrar deneyin.
                    </Td>
                  </Tr>
                ) : (
                  stajyerler
                    ?.filter((s) => !silinenStajyerler.includes(s.id))
                    .map((stajyer) => (
                      <Tr key={stajyer.id} bg={getBgColor(stajyer.durum)}>
                        <Td>{`${stajyer.ogrenci.isim} ${stajyer.ogrenci.soyisim}`}</Td>
                        <Td>
                          {stajyer.durum === "Aktif"
                            ? stajyer.baslangic_tarihi
                            : getTodayDate()}
                        </Td>
                        <Td>
                          {stajyer.durum === "Aktif" ? (
                            stajyer.bitis_tarihi
                          ) : (
                            <Badge
                              colorScheme={
                                stajyer.durum === "Kurum Onayladı"
                                  ? "blue"
                                  : stajyer.durum === "Reddedildi"
                                  ? "red"
                                  : stajyer.durum === "Aktif"
                                  ? "green"
                                  : "yellow"
                              }
                            >
                              {stajyer.durum}
                            </Badge>
                          )}
                        </Td>
                        <Td>{stajyer.konu || "—"}</Td>
                        {stajyer.durum === "Aktif" && (
                          <Td>{stajyer.kurum_puani ?? "Henüz verilmedi"}</Td>
                        )}
                        <Td>
                          {stajyer.kurum_puani !== null ? (
                            <Button
                              width={"100px"}
                              colorScheme="green"
                              onClick={() => handleGizle(stajyer.id)}
                              onMouseEnter={(e) => {
                                e.currentTarget.textContent = "Gizle";
                                e.currentTarget.style.backgroundColor = "red";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.textContent = "Tamamlandı";
                                e.currentTarget.style.backgroundColor = "green";
                              }}
                            >
                              Tamamlandı
                            </Button>
                          ) : stajyer.durum === "Aktif" ? (
                            <Button
                              onClick={() =>
                                navigate(`/kurum-staj-detay/${stajyer.id}`)
                              }
                            >
                              Detay
                            </Button>
                          ) : stajyer.durum === "Reddedildi" ? (
                            <Button
                              bg={"red"}
                              color={"white"}
                              width={"100px"}
                              onClick={() => handleGizle(stajyer.id)}
                              onMouseEnter={(e) => {
                                e.currentTarget.textContent = "Gizle";
                                e.currentTarget.style.backgroundColor = "red";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.textContent = "Reddedildi";
                                e.currentTarget.style.backgroundColor = "red";
                              }}
                            >
                              Reddedildi
                            </Button>
                          ) : (
                            <>
                              <Button
                                colorScheme="blue"
                                onClick={() => handleApproveClick(stajyer)}
                                isLoading={isApproving}
                                isDisabled={stajyer.kurum_onaylandi}
                              >
                                Onayla
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() => handleRejectClick(stajyer)}
                                isLoading={isRejecting}
                                ml={2}
                              >
                                Reddet
                              </Button>
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
      <Modal isOpen={isApproveOpen} onClose={onApproveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Staj Başvurusunu Onayla</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {selectedStaj?.ogrenci?.isim} {selectedStaj?.ogrenci?.soyisim}{" "}
              adlı öğrencinin başvurusunu onaylamak istiyor musunuz?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onApproveClose}>
              İptal
            </Button>
            <Button
              colorScheme="blue"
              onClick={confirmApprove}
              isLoading={isApproving}
            >
              Onayla
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Kurum;
