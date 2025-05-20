import { useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { getStajyerler, StajPuanla } from "../../api";
import "./app.css";

const KurumStajDetay = () => {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [puan, setPuan] = useState("");
  const [aciklama, setAciklama] = useState("");

  const {
    data: stajyerler,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stajyerler"],
    queryFn: () => getStajyerler(),
  });
  const stajyer = stajyerler?.find((item) => String(item.id) === id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSavePuan = async () => {
    await StajPuanla(stajyer.id, puan, aciklama);
    onClose();
    window.location.reload();
  };

  if (isLoading) return <Text>Yükleniyor...</Text>;
  if (error) return console.log(error);
  console.log(stajyer);
  return (
    <>
      {isSidebarOpen && <Sidebar userType="kurum" />}
      <div className="content">
        <Header />
        <Box p={8} bg="white" rounded="lg" shadow="md" mx="150px">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Staj Detayları
          </Text>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>Öğrenci</Td>
                <Td>
                  {stajyer.ogrenci.isim} {stajyer.ogrenci.soyisim}{" "}
                </Td>
              </Tr>
              <Tr>
                <Td>Konu</Td>
                <Td>{stajyer.konu}</Td>
              </Tr>
              <Tr>
                <Td>Başlangıç Tarihi</Td>
                <Td>{stajyer.baslangic_tarihi}</Td>
              </Tr>
              <Tr>
                <Td>Bitiş Tarihi</Td>
                <Td>{stajyer.bitis_tarihi}</Td>
              </Tr>
              <Tr>
                <Td>Kurum Puanı</Td>
                <Td>{stajyer.kurum_puani || "Puanlanmamış"}</Td>
              </Tr>
            </Tbody>
          </Table>

          <Button mt={8} ml={"45%"} colorScheme="green" onClick={onOpen}>
            Puanla
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Puanla</ModalHeader>
              <ModalBody>
                <FormControl>
                  <FormLabel>Puan</FormLabel>
                  <Input
                    type="number"
                    value={puan}
                    onChange={(e) => setPuan(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Açıklama</FormLabel>
                  <Textarea
                    value={aciklama}
                    onChange={(e) => setAciklama(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSavePuan}>
                  Kaydet
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  İptal
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </div>
    </>
  );
};

export default KurumStajDetay;
