import React, { useState } from "react";
import {
  Box,
  Textarea,
  Button,
  Text,
  useToast,
  VStack,
  Input,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { DefteriYukle } from "../../api";
import { StajGunuEditor } from "../../components/StajBelgeler";
export default function StajDefteri() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      {isSidebarOpen && <Sidebar />}
      <div className="content">
        <Header toggleSidebar={toggleSidebar} />
        <StajGunuEditor />
      </div>
    </>
  );
}
