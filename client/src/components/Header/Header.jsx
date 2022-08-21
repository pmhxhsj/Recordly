import React, { useState } from "react";
import cn from "classnames";
import propTypes from "prop-types";
import imageUrl from "assets/images/logo.png";
import { useNavigate } from "react-router";

import Swal from "sweetalert2";

import styles from "./Header.module.scss";
import axios from "axios";

const Header = ({ imageUrl, isLogin }) => {
  const [selectNavi, setSelectNavi] = useState("intro");
  const navigate = useNavigate();

  const logout = () => {
    axios
      .get("/api/auth/logout")
      .then((res, req) => {
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          position: "center",
          title: "로그아웃에 실패했습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        console.log(err, "로그아웃 실패");
      });
  };

  return (
    <header
      className={cn(
        styles.Header,
        "d-flex",
        "justify-content-center",
        "align-items-center"
      )}
    >
      <div
        className={cn(
          styles.Header__container,
          "d-flex",
          "align-items-center",
          "justify-content-between",
          "ps-4",
          "pe-4"
        )}
      >
        <div
          className={cn(
            styles.Header__container__left,
            "d-flex",
            "align-items-center",
            "justify-content-center"
          )}
        >
          {/* Todo: 로고 생기면 넣기 */}
          {/* <img src={imageUrl} className={styles.Header__image} alt="logoImage" /> */}
          <span className={styles.Header__container__title}>Recordly</span>
        </div>
        <div
          className={cn(
            styles.Header__container__right,
            "d-flex",
            "align-items-center",
            "justify-content-center"
          )}
        >
          {isLogin ? (
            <button
              className={styles.Header__container__right__logout}
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className={cn(
                  styles.Header__container__right__intro,
                  selectNavi === "intro" &&
                    styles.Header__container__right__active
                )}
              >
                소개
              </button>
              <button
                className={cn(
                  styles.Header__container__right__notice,
                  selectNavi === "notice" &&
                    styles.Header__container__right__active
                )}
              >
                공지사항
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  imageUrl: propTypes.string,
};

Header.defaultProps = {
  imageUrl: imageUrl,
};

export default Header;
