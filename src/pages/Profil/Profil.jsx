import React from "react";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header"; // ✅ Header componenti import edildi
import "./app.css";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";
function Profil() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      {isSidebarOpen && <Sidebar />}
      <div className="content">
        <Header toggleSidebar={toggleSidebar} />

        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={"0px"}
        >
          <Card
            boxShadow="lg"
            borderRadius="xl"
            bg="white"
            width={"434px"}
            height={"304px"}
          >
            <CardHeader>
              <Heading size="md" textAlign="center">
                Profil
              </Heading>
            </CardHeader>

            <CardBody>
              <Stack spacing={4} textAlign="center">
                <Box>
                  <Heading size="md">Adem Kaya</Heading>
                  <Text color="gray.600">Bilgisayar Mühendisliği Stajyeri</Text>
                </Box>

                <Stack spacing={1} textAlign="left" mt={"30px"}>
                  <Text>
                    <b>Email:</b> adem.kaya@example.com
                  </Text>
                  <Text>
                    <b>Telefon:</b> +90 555 123 4567
                  </Text>
                  <Text>
                    <b>Okul:</b> Ankara Üniversitesi
                  </Text>
                  <Text>
                    <b>Bölüm:</b> Bilgisayar Mühendisliği
                  </Text>
                </Stack>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </div>
    </>
  );
}

export default Profil;
