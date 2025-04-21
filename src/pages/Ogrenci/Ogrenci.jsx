import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import "./app.css";
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
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Spacer,
  Input,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHourglassHalf,
  faBars,
  faClipboardCheck,
  faCalendarCheck,
  faBriefcase,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getProfile, YeniStaj } from "../../api";
import Header from "../../components/header";

function Ogrenci() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [yeniStajState, setYeniStaj] = useState({
    kurum_adi: "",
    baslangic_tarihi: "",
    bitis_tarihi: "",
    konu: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setYeniStaj((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fixed useMutation implementation
  const {
    mutate,
    isLoading: isSubmitting,
    isError,
    error,
  } = useMutation({
    mutationFn: (data) => YeniStaj(data),
    onSuccess: (data) => {
      console.log("Staj başarıyla eklendi:", data);
      refetch(); // Refresh the data after adding a new internship
    },
    onError: (err) => {
      console.error("Bir hata oluştu:", err);
    },
  });

  const handleSubmit = () => {
    mutate(yeniStajState);
    onClose();
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Removed unused state
  const {
    data,
    isLoading,
    error: profileError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const cards = [
    {
      title: "Mevcut Stajım",
      value: "Softalya",
      subtitle: "10.02.2025-23.05.2025",
      icon: faBriefcase,
    },
    {
      title: "Staj Günleri",
      value: "45",
      subtitle: "Toplam tamamlanan gün",
      icon: faCalendarCheck,
    },
    {
      title: "Staj Günleri",
      value: "67",
      subtitle: "Kalan gün",
      icon: faHourglassHalf,
    },
    {
      title: "Defterler",
      value: "28/30",
      subtitle: "Mart ayı doldurulmuş günlük",
      icon: faBook,
    },
    {
      title: "Puantaj çizelgesi",
      value: "20/30",
      subtitle: "Mart ayı doldurulmuş puantaj",
      icon: faClipboardCheck,
    },
  ];

  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToPrevious = () => {
    if (animating) return;
    setAnimating(true);
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);

    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };

  const goToNext = () => {
    if (animating) return;
    setAnimating(true);
    const newIndex = Math.min(currentIndex + 1, cards.length - visibleCards);
    setCurrentIndex(newIndex);

    setTimeout(() => {
      setAnimating(false);
    }, 500);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {isSidebarOpen && <Sidebar userType="ogrenci" />}
      <div className="content">
        <Header toggleSidebar={toggleSidebar} />

        <div className="rows">
          <div className="rows-border">
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
                  width="100%"
                  gap={4}
                  transition="transform 0.5s ease-in-out"
                  style={{
                    transform: `translateX(${
                      -currentIndex * (100 / visibleCards)
                    }%)`,
                  }}
                >
                  {cards.map((card, index) => (
                    <Box
                      key={index}
                      p={6}
                      rounded="2xl"
                      shadow="md"
                      className="box"
                      minWidth={{
                        base: "100%",
                        md: `calc(${100 / Math.min(2, visibleCards)}% - ${
                          5 * (Math.min(2, visibleCards) - 1)
                        }px)`,
                        lg: `calc(${100 / visibleCards}% - ${
                          5 * (visibleCards - 1)
                        }px)`,
                      }}
                      flexShrink={0}
                    >
                      <Text fontSize="lg" color="gray.600">
                        {card.title}
                        <FontAwesomeIcon
                          icon={card.icon}
                          size="xl"
                          style={{ marginLeft: "10px" }}
                        />
                      </Text>
                      <Text fontWeight="bold" fontSize="xl" mt={2}>
                        {card.value}
                      </Text>
                      <Text
                        mt={2}
                        color="gray.500"
                        fontSize={card.subtitle ? "sm" : "md"}
                      >
                        {card.subtitle}
                        {card.subtitle === "Toplam tamamlanan gün" && (
                          <div className="progress-container">
                            <div
                              className="progress-bar"
                              style={{ width: "40%" }}
                            ></div>
                          </div>
                        )}
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
          </div>
        </div>

        <Box
          bg="white"
          color="black"
          fontSize="18px"
          fontFamily="'Bebas Neue', sans-serif"
          p={5}
          borderRadius="lg"
        >
          <div style={{ position: "sticky", top: 0 }}>
            <Flex mb={4} align="center">
              <Text fontSize="2xl" fontWeight="semi-bold">
                Stajlarım
              </Text>
              <Spacer />
              <Button colorScheme="blue" onClick={onOpen}>
                + Yeni Staj Başvurusu
              </Button>
              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Yeni Staj Başvurusu</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <label>Kurum adı</label>
                    <Input
                      placeholder="Kurum adını giriniz.."
                      value={yeniStajState.kurum_adi}
                      onChange={handleInputChange}
                      name="kurum_adi"
                      mb={3}
                    />
                    <label>Başlangıç Tarihi</label>
                    <Input
                      placeholder="Başlangıç Tarihi giriniz.."
                      type="date"
                      value={yeniStajState.baslangic_tarihi}
                      onChange={handleInputChange}
                      name="baslangic_tarihi"
                      mb={3}
                    />
                    <label>Bitiş Tarihi</label>
                    <Input
                      placeholder="Bitiş Tarihi giriniz.."
                      type="date"
                      value={yeniStajState.bitis_tarihi}
                      onChange={handleInputChange}
                      name="bitis_tarihi"
                      mb={3}
                    />
                    <label>Konu</label>
                    <Input
                      placeholder="Konu"
                      value={yeniStajState.konu}
                      onChange={handleInputChange}
                      name="konu"
                      mb={3}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      İptal
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleSubmit}
                      isLoading={isSubmitting}
                    >
                      Kaydet
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </div>
          <Box maxHeight="270px" overflowY="auto" className="staj-tablosu">
            {isLoading ? (
              <Text>Yükleniyor...</Text>
            ) : profileError ? (
              <Text>Veri alınırken bir hata oluştu.</Text>
            ) : (
              <Table variant="simple">
                <Thead position="sticky" top={0} bg="white" zIndex={1}>
                  <Tr>
                    <Th>Kurum</Th>
                    <Th>Departman</Th>
                    <Th>Başlangıç</Th>
                    <Th>Bitiş</Th>
                    <Th>Durum</Th>
                    <Th>İşlem</Th>
                  </Tr>
                </Thead>
                <Tbody backgroundColor="white" color="black">
                  {data && data.length > 0 ? (
                    data.map((staj, index) => (
                      <Tr key={index}>
                        <Td>{staj.kurum_adi}</Td>
                        <Td>{staj.konu}</Td>
                        <Td>{staj.baslangic_tarihi}</Td>
                        <Td>{staj.bitis_tarihi}</Td>
                        <Td>
                          {staj.kurum_onaylandi ? (
                            <Badge colorScheme="green">Onaylandı</Badge>
                          ) : (
                            <Badge colorScheme="yellow">Beklemede</Badge>
                          )}
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() =>
                              navigate(`/staj-detay/${staj.id}`, {
                                state: { staj },
                              })
                            }
                          >
                            Görüntüle
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        Henüz staj kaydınız bulunmamaktadır.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Ogrenci;
