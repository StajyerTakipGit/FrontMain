import React, { useState, useEffect } from "react";
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

const statusOptions = ["İzinli", "Raporlu", "Geldi"];

export const StajGunuEditor = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryContent, setDiaryContent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const toast = useToast();
  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const formattedDate = getLocalDateString(selectedDate);

  // 📌 Tarih değiştikçe localStorage'dan veri çek
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      const dataList = JSON.parse(storedData);
      const matched = dataList.find((item) => item.date === formattedDate);

      if (matched) {
        setDiaryContent(matched.diary || "");
        setSelectedStatus(matched.status || "");
      } else {
        setDiaryContent("");
        setSelectedStatus("");
      }
    } else {
      setDiaryContent("");
      setSelectedStatus("");
    }
  }, [formattedDate]);

  const handleStatusClick = (status) => {
    setSelectedStatus((prev) => (prev === status ? "" : status));
  };

  const handleSave = () => {
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

    const newEntry = {
      date: formattedDate,
      diary: diaryContent,
      status: selectedStatus,
    };

    // 📥 Eski kayıtları çek
    const storedData = localStorage.getItem("data");
    let dataList = storedData ? JSON.parse(storedData) : [];

    // 🔁 Aynı tarihte kayıt varsa üzerine yaz (önce filtrele)
    dataList = dataList.filter((item) => item.date !== formattedDate);

    // ➕ Yeni kaydı ekle
    dataList.push(newEntry);

    // 💾 Güncellenmiş listeyi kaydet
    localStorage.setItem("data", JSON.stringify(dataList));

    toast({
      title: "Başarıyla Kaydedildi",
      description: `${formattedDate} günü için günlük kaydedildi.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // ✅ Inputları temizle
    setDiaryContent("");
    setSelectedStatus("");
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
            onChange={setSelectedDate}
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
          mt={"2%"}
          height={"82%"}
          borderRadius={"20px"}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={0}>
            Staj Günlük Rapor
          </Text>
          <Textarea
            color={"black"}
            bg={"white"}
            border={"3px solid black"}
            borderRadius={"20px"}
            height={"80%"}
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="Bugün neler yaptın?"
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
