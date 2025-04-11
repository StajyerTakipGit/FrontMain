import React from "react";
import styles from "./styles.module.css";
import logo from "../../assets/Akdeniz_Universitesi.png";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { fetchlogin } from "../../api";

function Login() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: fetchlogin,
    onSuccess: (data) => {
      console.log("Login başarılı", data);

      navigate("/ogrenci");
    },
    onError: (error) => {
      console.error("Login hatası:", error);
    },
  });

  return (
    <div className={styles.content}>
      <div className={styles.bluecard}>
        <div className={styles.logo}>
          <img src={logo} className={styles.akdenizlogo} alt="logo" />
        </div>
        <h1 className={styles.header1}>Stajyer Takip Sistemi</h1>
        <p className={styles.p1}>
          Öğrenciler, kurumlar ve üniversiteler için kullanışlı ve modern bir
          staj takip platformu
        </p>
      </div>
      <div className={styles.whitecard}>
        <div className={styles.logo2}>
          <div className={styles.logo_icon}>IFS</div>
          <div className={styles.logo_text}>Stajyer Takip</div>
        </div>
        <h1 className={styles.header2}>Hoş Geldiniz</h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Kullanıcı adı gerekli";
            }
            if (!values.password) {
              errors.password = "Şifre gerekli";
            }
            return errors;
          }}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          <Form>
            <label htmlFor="email" className={styles.label}>
              Kullanıcı Adı
            </label>
            <Field
              type="text"
              name="email"
              id="email"
              placeholder="Kullanıcı adınızı giriniz"
              className={styles.input}
            />
            <ErrorMessage name="email">
              {(msg) => <div className={styles.error}>{msg || "\u00A0"}</div>}
            </ErrorMessage>

            <label htmlFor="password" className={styles.label}>
              Şifre
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Şifrenizi giriniz"
              className={styles.input}
            />
            <ErrorMessage name="password">
              {(msg) => <div className={styles.error}>{msg || "\u00A0"}</div>}
            </ErrorMessage>

            <button type="submit" className={styles.btn1}>
              Giriş yap
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;
