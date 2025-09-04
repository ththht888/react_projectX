import React, { useState } from "react";
import { Button } from "antd";
import {
  LoginOutlined,
  ProductOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SearchBox from "./SearchBox";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import "./Header.scss";

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

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

  return (
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
            <Button
              className="login-btn"
              type="default"
              icon={<UserOutlined />}
            >
              <span className="btn__text">{userName}</span>
            </Button>
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

      <LoginModal
        open={isLoginOpen}
        onClose={closeLogin}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegOpen(true);
        }}
        onLoggedIn={(name) => {
          setUserName(name);
          setIsLoginOpen(false);
        }}
      />

      <RegisterModal
        open={isRegOpen}
        onCancelBackToLogin={backToLogin}
        onCloseAll={closeAll}
        onAutoLoggedIn={(name) => {
          setUserName(name);
          closeAll();
        }}
      />
    </header>
  );
}

export default Header;
