import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuItem, MenuList, MenuButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.clear("user");
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
        <MenuButton>
          <button className="pp">{`${
            user?.isim?.charAt(0).toUpperCase() || ""
          }${user?.soyisim?.charAt(0).toUpperCase() || ""}`}</button>
        </MenuButton>
        <MenuList
          position="relative"
          top="-8px"
          width="80px"
          transform="translateY(-10px)"
          transition="opacity 0.3s ease, transform 0.3s ease"
          minW="unset"
          paddingY="0"
          zIndex="3"
          margin="0px"
          padding="0px"
        >
          <MenuItem
            height="36px"
            backgroundColor="gray.700"
            fontSize="sm"
            _hover={{ bg: "gray.800" }}
          >
            <a href="/profil">Profil</a>
          </MenuItem>
          <MenuItem
            height="36px"
            backgroundColor="gray.700"
            fontSize="sm"
            _hover={{ bg: "gray.800" }}
          >
            <a href="/ayarlar">Ayarlar</a>
          </MenuItem>
          <MenuItem
            height="36px"
            backgroundColor="gray.700"
            fontSize="sm"
            _hover={{ bg: "gray.800" }}
          >
            <button onClick={logOut}>Çıkış Yap</button>
          </MenuItem>
        </MenuList>
      </Menu>
    </header>
  );
};

export default Header;
