import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Avatar,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {
    isim: "Admin",
    soyisim: "Kullanıcı",
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="header">
      <FontAwesomeIcon
        icon={faBars}
        className="toggle-btn"
        onClick={toggleSidebar}
      />
      <Menu>
        <MenuButton mr={"20px"} mt={"10px"}>
          <Flex cursor="pointer">
            <Avatar
              name={`${user?.isim} ${user?.soyisim}`}
              bg="blue.600"
              color="white"
            />
          </Flex>
        </MenuButton>
        <MenuList minW="150px" bg="white" shadow="md">
          <MenuItem
            onClick={logOut}
            icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
            fontSize="sm"
            color={"black"}
          >
            Çıkış Yap
          </MenuItem>
        </MenuList>
      </Menu>
    </header>
  );
};

export default Header;
