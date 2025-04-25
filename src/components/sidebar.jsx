import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faClipboardCheck,
  faBook,
  faUser,
  faBriefcase,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Sidebar({ userType = "ogrenci" }) {
  const menuItems =
    userType === "kurum" ? (
      <>
        <li className={styles.list_item}>
          <a href="/kurum">
            <span>
              <FontAwesomeIcon icon={faHouse} size="xl" />
            </span>
            <span style={{ marginLeft: "15px" }}>Anasayfa</span>
          </a>
        </li>
        <li className={styles.list_item} style={{ paddingLeft: "17px" }}>
          <a href="/kurum">
            <span>
              <FontAwesomeIcon icon={faUsers} size="xl" />
            </span>
            <span style={{ marginLeft: "15px" }}>Stajyerler</span>
          </a>
        </li>
      </>
    ) : (
      <>
        <li className={styles.list_item}>
          <a href="/ogrenci">
            <span>
              <FontAwesomeIcon icon={faHouse} size="xl" />
            </span>
            <span style={{ marginLeft: "15px" }}>Anasayfa</span>
          </a>
        </li>
      </>
    );

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logo_icon}>IFS</div>
        <div className={styles.logo_text}>Stajyer Takip Sistemi</div>
      </div>

      <div className={styles.sidebar_menu}>
        <ul>{menuItems}</ul>
        <div className={styles.crights}>© 2025 Stajyer Takip Sistemi</div>
      </div>
    </div>
  );
}

export default Sidebar;
