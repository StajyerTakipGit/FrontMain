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
    // StajyerPuanla fonksiyonu içinde gerekli verileri kullan
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

      await refetch(); // ✅ Stajyer listesini güncelle
      onApproveClose(); // ✅ Modalı kapat
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
      await refetch(); // ✅ Listeyi güncelle
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
    if (stajyerler && Array.isArray(stajyerler)) {
      const count = stajyerler.filter(
        (stajyer) => stajyer.kurum_onaylandi === true
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
        stajyerler?.filter((stajyer) => !stajyer.kurum_onaylandi)?.length ?? 0,
      subtitle: "Onayınızı bekleyen staj başvuruları",
      icon: faUserClock,
    },
    {
      title: "Toplam Stajyer",
      value: stajyerler?.length ?? 0,
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
                  {stajyerler?.some((s) => s.kurum_onaylandi) ? (
                    <>
                      <Th>Stajyer Adı</Th>
                      <Th>Başlangıç Tarihi</Th>
                      <Th>Bitiş Tarihi</Th>
                      <Th>Konu</Th>
                      <Th>Kurum Puanı</Th>
                      <Th>İşlemler</Th>
                    </>
                  ) : (
                    <>
                      <Th>Stajyer Adı</Th>
                      <Th>Başvuru Durumu</Th>
                      <Th>Başvuru Tarihi</Th>
                      <Th>İşlemler</Th>
                    </>
                  )}
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
                  stajyerler?.map((stajyer) => (
                    <Tr key={stajyer.id}>
                      {stajyer.durum === "Tamamlandı" ? (
                        <>
                          <Td>{`${stajyer.ogrenci.isim} ${stajyer.ogrenci.soyisim}`}</Td>
                          <Td>{stajyer.baslangic_tarihi}</Td>
                          <Td>{stajyer.bitis_tarihi}</Td>
                          <Td>{stajyer.konu || "—"}</Td>
                          <Td>{stajyer.kurum_puani ?? "Henüz verilmedi"}</Td>
                          <Td>
                            <Button
                              colorScheme="teal"
                              onClick={() => {
                                setSelectedStaj(stajyer);
                                onPuanModalOpen();
                              }}
                            >
                              Puanla
                            </Button>
                          </Td>
                        </>
                      ) : (
                        <>
                          <Td>{`${stajyer.ogrenci.isim} ${stajyer.ogrenci.soyisim}`}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                stajyer.durum === "Tamamlandı"
                                  ? "green"
                                  : stajyer.durum === "Tamamlanmadı"
                                  ? "red "
                                  : "yellow"
                              }
                            >
                              {stajyer.durum}
                            </Badge>
                          </Td>

                          <Td>
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
                          </Td>
                        </>
                      )}
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
                {`${selectedStaj.ogrenci.isim} ${selectedStaj.ogrenci.soyisim}`}{" "}
                isimli öğrencinin staj başvurusunu onaylamak istediğinize emin
                misiniz?
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
      <Modal isOpen={isPuanModalOpen} onClose={onPuanModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stajyer Puanla</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <FormControl mb={4}>
              <FormLabel>Puan</FormLabel>
              <Input
                placeholder="Puan giriniz.."
                value={puan}
                onChange={(e) => setPuan(e.target.value)}
              ></Input>
            </FormControl>

            <FormControl>
              <FormLabel>Açıklama</FormLabel>
              <Textarea
                placeholder="Açıklama girin..."
                rows={5}
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSavePuan}>
              Kaydet
            </Button>
            <Button onClick={onPuanModalClose}>İptal</Button>
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
