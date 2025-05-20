import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Textarea,
  Text,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles.module.css";
import { useLocation } from "react-router-dom";
import { getDefter, DefteriYukle, patchDefter } from "../api";
import Ogrenci from "../pages/Ogrenci/Ogrenci";

const statusOptions = ["İzinli", "Raporlu", "Geldi"];

export const StajGunuEditor = () => {
  const location = useLocation();
  const staj = location.state?.staj;
  const id = staj.id;
  const ogrenci = staj.ogrenci;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryContent, setDiaryContent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [backendEntries, setBackendEntries] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Get entries from backend
    getDefter(id)
      .then((res) => {
        setBackendEntries(res); // Set backend entries
      })
      .catch((error) => {
        console.error("Error:", error.message); // Handle errors
      });
  }, [id]);

  // Get local date in string format (YYYY-MM-DD)
  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0]; // Ensure the format is YYYY-MM-DD
  };

  const formattedDate = getLocalDateString(selectedDate);

  // Handle date change and find the corresponding diary entry
  useEffect(() => {
    const sameDayEntries = backendEntries.filter(
      (entry) =>
        new Date(entry.gun_no).toISOString().split("T")[0] === formattedDate
    );
    const latestEntry = sameDayEntries.at(-1); // sonuncuyu al

    if (latestEntry) {
      setDiaryContent(latestEntry.icerik);
    } else {
      setDiaryContent("");
    }
  }, [formattedDate, backendEntries]);

  // Bu ay yapılan giriş sayısını hesapla
  const buAyGirisSayisi = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear(); // Örn: 2025
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Örn: "05"

    const currentMonthPrefix = `${year}-${month}`; // "2025-05"

    return backendEntries.filter((entry) =>
      entry.gun_no.startsWith(currentMonthPrefix)
    ).length;
  }, [backendEntries]);

  const handleStatusClick = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus(""); // aynı seçiliyse kaldır
    } else {
      setSelectedStatus(status);
    }
  };

  const handleSave = async () => {
    if (!diaryContent.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen günlüğü doldurunuz.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const gun_no = formattedDate;
    const content = diaryContent;

    try {
      // backendEntries içinde mevcut kayıtları kontrol et
      const matchingEntry = backendEntries.find(
        (entry) => entry.gun_no === gun_no
      );

      if (matchingEntry) {
        // Kayıt varsa patch işlemi
        await patchDefter({
          staj, // staj bilgisi
          gun_no, // tarih
          content, // günlük içeriği
          toast, // toast bildirimi
          backendEntries, // mevcut backendEntries
        });

        toast({
          title: "Güncellendi",
          description: `${gun_no} günü için günlük güncellendi.`,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Kayıt yoksa ekleme işlemi
        await DefteriYukle(staj, gun_no, content, toast, backendEntries);

        toast({
          title: "Başarıyla Kaydedildi",
          description: `${gun_no} günü için günlük kaydedildi.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Formu sıfırla
      setDiaryContent("");
      setSelectedStatus("");
    } catch (error) {
      console.error("Günlük kaydında hata:", error);
      toast({
        title: "Hata",
        description: "Günlük kaydedilirken bir hata oluştu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={4} color={"white"} display={"flex"}>
        <Box
          mb={1}
          color={"black"}
          ml={"2%"}
          mt={"5%"}
          display={"flex"}
          flexDirection={"column"}
          float={"left"}
          mr={"2%"}
        >
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate} // Update selected date
            className={styles.takvim}
          />
          <Box
            mb={0}
            mt={"20px"}
            display={"flex"}
            flexDirection={"column"}
            width={"160px"}
            color={"white"}
          >
            <Text fontSize="2xl" fontWeight="bold" display={"flex"} mb={2}>
              Devam bilgisi
            </Text>
            <Flex gap={4} display={"flex"}>
              {statusOptions.map((status) => (
                <Checkbox
                  key={status}
                  isChecked={selectedStatus === status}
                  onChange={() => handleStatusClick(status)}
                >
                  {status}
                </Checkbox>
              ))}
            </Flex>
          </Box>
        </Box>
        <Box
          mb={4}
          width={"75%"}
          mr={"5%"}
          ml={"5%"}
          mt={"0%"}
          height={"82%"}
          borderRadius={"20px"}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={0} ml={"30%"}>
            Staj Günlük Rapor
          </Text>
          <Text mb={0} fontWeight="bold" fontSize="xl" color="white">
            {formattedDate}
          </Text>
          <Textarea
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="Bugün neler yaptın?"
            color="black"
            bg="white"
            border={"1px solid black"}
            resize="none"
            boxShadow="0 4px 10px rgba(0,0,0,0.1)"
            height="100%"
            sx={{
              backgroundImage: `
      linear-gradient(to bottom,
        white 10px,
        transparent 10px
      ),
      repeating-linear-gradient(
        to bottom, 
        transparent 0px,
        transparent 27px, 
rgb(106, 159, 215) 28px
      )`,
              backgroundPosition: "0 0",
              backgroundSize: "100% 100%, 100% 28px",
              backgroundAttachment: "local",
              fontFamily: "monospace",
              lineHeight: "28px",
              padding: "30px",
              paddingLeft: "15px",
            }}
          />
        </Box>
      </Box>
      <Box>
        <Button ml={"40%"} onClick={handleSave}>
          Kaydet
        </Button>
      </Box>
    </>
  );
};
