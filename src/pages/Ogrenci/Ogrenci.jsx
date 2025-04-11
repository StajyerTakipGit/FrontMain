import React from "react";
import Sidebar from "../../components/sidebar";
import "./app.css";
import { Box, Text, Heading, Grid } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHourglassHalf,
  faClipboardCheck,
  faCalendarCheck,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
function Ogrenci() {
  return (
    <>
      <Sidebar />
      <div className="content">
        <header className="header">
          <h1 style={{ paddingTop: "5px", paddingLeft: "10px" }}>Anasayfa</h1>{" "}
          <a href="/profil" className="pp">
            AY
          </a>
        </header>

        <div className="rows">
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={12}
          >
            <Box p={6} bg="white" rounded="2xl" shadow="md" className="box">
              <Text fontSize="lg" color="gray.600">
                Devam eden stajım
                <FontAwesomeIcon
                  icon={faBriefcase}
                  size="xl"
                  style={{ marginLeft: "10px" }}
                />
              </Text>
              <Text fontWeight="bold" fontSize="xl" mt={2}>
                Softalya
              </Text>
              <Text mt={2} color="gray.500">
                10.02.2025 - 23.05.2025
              </Text>
            </Box>

            <Box p={6} bg="white" rounded="2xl" shadow="md" className="box">
              <Text fontSize="lg" color="gray.600">
                Staj Günleri
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  size="xl"
                  style={{ marginLeft: "10px" }}
                />
              </Text>
              <Text fontWeight="bold" fontSize="xl" mt={2}>
                45
              </Text>
              <Text mt={2} color="gray.500">
                Toplam tamamlanan gün
              </Text>
            </Box>
            <Box p={6} bg="white" rounded="2xl" shadow="md" className="box">
              <Text fontSize="lg" color="gray.600">
                Staj Günleri
                <FontAwesomeIcon
                  icon={faHourglassHalf}
                  size="xl"
                  style={{ marginLeft: "10px" }}
                />
              </Text>
              <Text fontWeight="bold" fontSize="xl" mt={2}>
                67
              </Text>
              <Text mt={2} color="gray.500">
                Kalan gün
              </Text>
            </Box>

            <Box p={6} bg="white" rounded="2xl" shadow="md" className="box">
              <Text fontSize="lg" color="gray.600">
                Defterler
                <FontAwesomeIcon
                  icon={faBook}
                  size="xl"
                  style={{ marginLeft: "10px" }}
                />
              </Text>
              <Text fontWeight="bold" fontSize="xl" mt={2}>
                28/30
              </Text>
              <Text mt={2} color="gray.500">
                Mart ayı doldurulmuş günlük
              </Text>
            </Box>
            <Box p={6} bg="white" rounded="2xl" shadow="md" className="box">
              <Text fontSize="lg" color="gray.600">
                Puantaj çizelgesi
                <FontAwesomeIcon
                  icon={faClipboardCheck}
                  size="xl"
                  style={{ marginLeft: "10px" }}
                />
              </Text>
              <Text fontWeight="bold" fontSize="xl" mt={2}>
                20/30
              </Text>
              <Text mt={2} color="gray.500">
                Mart ayı doldurulmuş puantaj
              </Text>
            </Box>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default Ogrenci;
