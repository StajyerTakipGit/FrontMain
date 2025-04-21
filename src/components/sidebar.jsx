import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faClipboardCheck,
  faBook,
  faUser,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logo_icon}>IFS</div>
        <div className={styles.logo_text}>Stajyer Takip Sistemi</div>
      </div>

      <div className={styles.sidebar_menu}>
        <ul>
          <li className={styles.list_item}>
            <a href="/ogrenci">
              <span>
                <FontAwesomeIcon icon={faHouse} size="xl" />
              </span>
              <span style={{ marginLeft: "15px" }}>Anasayfa</span>
            </a>
          </li>
          <li className={styles.list_item} style={{ paddingLeft: "17px" }}>
            <a href="/ogrenci">
              <span>
                <FontAwesomeIcon icon={faBriefcase} size="xl" />
              </span>

              <span style={{ marginLeft: "15px" }}>Stajlarım</span>
            </a>
          </li>
          <li className={styles.list_item} style={{ paddingLeft: "17px" }}>
            <a href="/ogrenci">
              <span>
                <FontAwesomeIcon icon={faBook} size="xl" />
              </span>

              <span style={{ marginLeft: "15px" }}>Staj Defterim</span>
            </a>
          </li>
          <li className={styles.list_item} style={{ paddingLeft: "17px" }}>
            <a href="/ogrenci">
              <span>
                <FontAwesomeIcon icon={faClipboardCheck} size="xl" />
              </span>
              <span style={{ marginLeft: "15px" }}>Puantaj Çizelgesi</span>
            </a>
          </li>
        </ul>
        <div className={styles.crights}>© 2025 Stajyer Takip Sistemi</div>
      </div>
    </div>
  );
}

export default Sidebar;
