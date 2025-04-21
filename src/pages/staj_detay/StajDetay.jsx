import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header"; // ✅ Header componenti import edildi
import "./app.css";

const StajDetay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { staj } = location.state || {};
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (!staj) {
    return <Text>Staj bilgisi bulunamadı.</Text>;
  }

  return (
    <>
      {isSidebarOpen && <Sidebar />}
      <div className="content">
        <Header toggleSidebar={toggleSidebar} />

        <Box
          p={8}
          bg="white"
          rounded="lg"
          shadow="md"
          maxWidth="100%"
          mx="150px"
          mt={"97px"}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Staj Detayları
          </Text>

          {/* Tablo */}
          <Table variant="simple" size="lg" width="100%">
            <Thead>
              <Tr>
                <Th>Bilgi</Th>
                <Th>Değer</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Kurum</Td>
                <Td>{staj.kurum_adi}</Td>
              </Tr>
              <Tr>
                <Td>Departman/Konu</Td>
                <Td>{staj.konu}</Td>
              </Tr>
              <Tr>
                <Td>Başlangıç Tarihi</Td>
                <Td>{staj.baslangic_tarihi}</Td>
              </Tr>
              <Tr>
                <Td>Bitiş Tarihi</Td>
                <Td>{staj.bitis_tarihi}</Td>
              </Tr>
              <Tr>
                <Td>Durum</Td>
                <Td>
                  {staj.kurum_onaylandi ? (
                    <Badge colorScheme="green">Onaylandı</Badge>
                  ) : (
                    <Badge colorScheme="yellow">Beklemede</Badge>
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>

          {/* Butonlar */}
          <Box mt={6} display="flex" justifyContent="space-between">
            <Button onClick={() => navigate(-1)} colorScheme="blue">
              Geri Dön
            </Button>
            <Button
              onClick={() =>
                navigate(`/staj-defteri/${staj.id}`, { state: { staj } })
              }
              colorScheme="green"
            >
              Staj Defterim
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default StajDetay;
