import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  LoginOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SearchBox from "../search/SearchBox";
import LoginModal from "../login/LoginModal";
import RegisterModal from "../register/RegisterModal";
import NoticeBar from "../notice/NoticeBar";
import { loadUser, saveUser, clearUser } from "../../utils/authStore";
import "./Header.scss";

type Notice = { type: "success" | "error" | "warning" | "info"; text: string };

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const u = loadUser();
    if (u?.login) setUserName(u.login);
  }, []);

  const showNotice = (
    type: Notice["type"],
    text: string,
    autoHideMs = 4000
  ) => {
    setNotice({ type, text });
    if (autoHideMs) {
      window.setTimeout(
        () => setNotice((n) => (n?.text === text ? null : n)),
        autoHideMs
      );
    }
  };

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const backToLogin = () => {
    setIsRegOpen(false);
    setIsLoginOpen(true);
  };

  const closeAll = () => {
    setIsRegOpen(false);
    setIsLoginOpen(false);
  };

  const onLogout = () => {
    clearUser();
    setUserName(null);
    showNotice("success", "Вы вышли из аккаунта");
  };

  const profileMenu: MenuProps["items"] = [
    { key: "profile", label: "Профиль" },
    { type: "divider" as const },
    { key: "logout", label: "Выйти", danger: true },
  ];

  const onProfileClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") onLogout();
  };

  return (
    <>
      <header className="header">
        <div className="header_inner">
          <div className="header_left">
            <h1 className="logo">
              <span className="logo__textDesktop">GrooveBay</span>
              <span className="logo__textMobile">GB</span>
            </h1>

            <Button className="catalog-btn" type="primary">
              <ProductOutlined className="btn__icon" />
              <span className="btn__text">Каталог</span>
            </Button>

            <SearchBox />
          </div>

          <div className="header__right">
            {userName ? (
              <Dropdown
                menu={{ items: profileMenu, onClick: onProfileClick }}
                trigger={["click"]}
              >
                <Button
                  className="login-btn"
                  type="default"
                  icon={<UserOutlined />}
                >
                  <span className="btn__text">{userName}</span>
                </Button>
              </Dropdown>
            ) : (
              <Button className="login-btn" type="default" onClick={openLogin}>
                <LoginOutlined className="btn__icon" />
                <span className="btn__text">Войти</span>
              </Button>
            )}

            <Button className="cart-btn" type="default">
              <ShoppingCartOutlined className="btn__icon" />
              <span className="btn__text">Корзина</span>
            </Button>
          </div>
        </div>
      </header>

      <NoticeBar
        type={notice?.type || "info"}
        text={notice?.text || ""}
        onClose={() => setNotice(null)}
      />

      <LoginModal
        open={isLoginOpen}
        onClose={closeLogin}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegOpen(true);
        }}
        onLoggedIn={(name) => {
          setUserName(name);
          saveUser({ login: name });
          setIsLoginOpen(false);
          showNotice("success", "Вы успешно вошли");
        }}
        onNotify={(
          type: "success" | "error" | "warning" | "info",
          text: string
        ) => showNotice(type, text)}
      />

      <RegisterModal
        open={isRegOpen}
        onCancelBackToLogin={backToLogin}
        onCloseAll={closeAll}
        onAutoLoggedIn={(name) => {
          setUserName(name);
          saveUser({ login: name });
          closeAll();
          showNotice("success", "Регистрация успешна. Вы вошли в систему");
        }}
        onNotify={(
          type: "success" | "error" | "warning" | "info",
          text: string
        ) => showNotice(type, text)}
      />
    </>
  );
}

export default Header;
