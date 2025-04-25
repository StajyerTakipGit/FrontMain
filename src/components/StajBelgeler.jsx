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
import { useLocation } from "react-router-dom";
import { getDefter, DefteriYukle } from "../api";

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
    const selectedEntry = backendEntries.find(
      (entry) => entry.gun_no === formattedDate
    );
    if (selectedEntry) {
      setDiaryContent(selectedEntry.icerik); // Set content if entry found
    } else {
      setDiaryContent(""); // Clear if no entry found for the selected date
    }
  }, [formattedDate, backendEntries]);

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

    const gun_no = formattedDate; // Ensure gun_no is correctly formatted
    const content = diaryContent;

    // Ensure newEntry is correctly sent to API
    DefteriYukle(staj, gun_no, content, toast); // Send data using DefteriYukle

    toast({
      title: "Başarıyla Kaydedildi",
      description: `${formattedDate} günü için günlük kaydedildi.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setDiaryContent(""); // Clear diary content after save
    setSelectedStatus(""); // Reset status
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
          mt={"2%"}
          height={"82%"}
          borderRadius={"20px"}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={0}>
            Staj Günlük Rapor
          </Text>
          <Textarea
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)} // Update diary content
            placeholder="Bugün neler yaptın?"
            color="black"
            lineHeight={"108px"}
            bg="white"
            border="3px solid #2c3e50"
            resize="none"
            boxShadow="0 4px 10px rgba(0,0,0,0.1)"
            borderRadius="20px"
            height="80%"
            sx={{
              backgroundImage: `repeating-linear-gradient(
                to bottom, 
                #ffffff 16px, 
                #ffffff 30px, 
                #cce5ff 32px
              ),
              linear-gradient(to right, #ff9999 40px, transparent 40px)`,

              backgroundSize: "100% 28px",
              backgroundAttachment: "local",
              fontFamily: "monospace",
              lineHeight: "28px",
              padding: "20px",
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
