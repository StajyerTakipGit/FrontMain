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
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser,
  faUserCheck,
  faUserClock,
  faUsers,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API URL sabit değerini tanımlayalım
const apiUrl = "http://127.0.0.1:8000";

// API fonksiyonlarını güncellenmiş endpointlerle yeniden tanımlama
const getKurumStajyerleri = async () => {
  console.log("API: getKurumStajyerleri çağrıldı.");

  try {
    const response = await axios.get(`${apiUrl}/api/kurum/stajyerler/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Hatası:", error.message);
    throw error;
  }
};

const onaylaStaj = async (stajId) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/api/kurum/stajyerler/${stajId}/`,
      {
        kurum_onay: true, // API dokümantasyonuna göre güncelledim
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Onaylama sırasında hata:", error);
    throw error;
  }
};

const reddetStaj = async (stajId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/kurum/stajyerler/${stajId}/reddet/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Reddetme sırasında hata:", error);
    throw error;
  }
};

function Kurum() {
  const navigate = useNavigate();
  const toast = useToast();
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
  const [selectedStaj, setSelectedStaj] = useState(null);

  const {
    data: stajyerler,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ["kurumStajyerleri"],
    queryFn: getKurumStajyerleri, // API'den veri çekme
  });

  const { mutate: approveMutate, isLoading: isApproving } = useMutation({
    mutationFn: (stajId) => onaylaStaj(stajId),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Staj başvurusu onaylandı.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
      onApproveClose();
      setSelectedStaj(null);
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

  const { mutate: rejectMutate, isLoading: isRejecting } = useMutation({
    mutationFn: (stajId) => reddetStaj(stajId),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Staj başvurusu reddedildi.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      refetch();
      onRejectClose();
      setSelectedStaj(null);
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

  const handleApproveClick = (staj) => {
    setSelectedStaj(staj);
    onApproveOpen();
  };

  const handleRejectClick = (staj) => {
    setSelectedStaj(staj);
    onRejectOpen();
  };

  const confirmApprove = () => {
    if (selectedStaj) {
      approveMutate(selectedStaj.id);
    }
  };

  const confirmReject = () => {
    if (selectedStaj) {
      rejectMutate(selectedStaj.id);
    }
  };

  const cards = [
    {
      title: "Aktif Stajyerler",
      value: stajyerler?.filter((s) => s.durum === "Onaylandı").length || 0,
      subtitle: "Şu anda staj yapan öğrenci sayısı",
      icon: faUserCheck,
    },
    {
      title: "Bekleyen Başvurular",
      value: stajyerler?.filter((s) => s.durum === "Beklemede").length || 0,
      subtitle: "Onayınızı bekleyen staj başvuruları",
      icon: faUserClock,
    },
    {
      title: "Toplam Stajyer",
      value: stajyerler?.length || 0,
      subtitle: "Bugüne kadar staj yapan/yapacak öğrenci",
      icon: faUsers,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

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

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/kurum-login");
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
          </div>

          <div className="kurum-stajyer">
            <Table variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th>Stajyer Adı</Th>
                  <Th>Başvuru Durumu</Th>
                  <Th>Başvuru Tarihi</Th>
                  <Th>İşlemler</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan="4" textAlign="center">
                      Yükleniyor...
                    </Td>
                  </Tr>
                ) : fetchError ? (
                  <Tr>
                    <Td colSpan="4" textAlign="center">
                      Hata oluştu. Lütfen tekrar deneyin.
                    </Td>
                  </Tr>
                ) : (
                  stajyerler?.map((stajyer) => (
                    <Tr key={stajyer.id}>
                      <Td>{stajyer.ad}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            stajyer.durum === "Onaylandı"
                              ? "green"
                              : stajyer.durum === "Beklemede"
                              ? "yellow"
                              : "red"
                          }
                        >
                          {stajyer.durum}
                        </Badge>
                      </Td>
                      <Td>{stajyer.tarih}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          onClick={() => handleApproveClick(stajyer)}
                          isLoading={isApproving}
                          isDisabled={stajyer.durum === "Onaylandı"}
                        >
                          Onayla
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleRejectClick(stajyer)}
                          isLoading={isRejecting}
                          ml={2}
                          isDisabled={stajyer.durum === "Reddedildi"}
                        >
                          Reddet
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Onaylama Modal */}
      <Modal isOpen={isApproveOpen} onClose={onApproveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Staj Başvurusu Onayı</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedStaj && (
              <Text>
                {selectedStaj.ad} isimli öğrencinin staj başvurusunu onaylamak
                istediğinize emin misiniz?
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmApprove}>
              Onayla
            </Button>
            <Button variant="ghost" onClick={onApproveClose}>
              İptal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reddetme Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Staj Başvurusu Reddi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedStaj && (
              <Text>
                {selectedStaj.ad} isimli öğrencinin staj başvurusunu reddetmek
                istediğinize emin misiniz?
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmReject}>
              Reddet
            </Button>
            <Button variant="ghost" onClick={onRejectClose}>
              İptal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Kurum;
