import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  LoginOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { loadUser, clearUser } from "../../utils/authStore";
import RegisterModal from "../register/RegisterModal";
import LoginModal from "../login/LoginModal";
import SearchBox from "../search/SearchBox";
import "./Header.scss";

function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = loadUser();
    if (storedUser?.login) setUserName(storedUser.login);
  }, []);

  const handleLogout = () => {
    clearUser();
    setUserName(null);
  };

  const profileMenu = (
    <Menu
      items={[
        { key: "profile", label: "Профиль" },
        { key: "logout", label: "Выйти", onClick: handleLogout },
      ]}
    />
  );

  return (
    <header className="header">
      <div className="header_inner">
        <div className="header_left">
          <h1 className="logo">
            <span className="logo__textDesktop">GrooveBay</span>
            <span className="logo__textMobile">GB</span>
          </h1>

          <Button
            className="catalog-btn"
            type="primary"
            icon={<AppstoreOutlined />}
          >
            <span className="btn__text">Каталог</span>
          </Button>

          <SearchBox />
        </div>

        <div className="header__right">
          {userName ? (
            <Dropdown overlay={profileMenu} placement="bottomRight">
              <Button className="login-btn" icon={<UserOutlined />}>
                {userName}
              </Button>
            </Dropdown>
          ) : (
            <Button
              className="login-btn"
              type="default"
              onClick={() => setIsLoginOpen(true)}
            >
              <LoginOutlined className="btn__icon" />
              <span className="btn__text">Войти</span>
            </Button>
          )}

          <Button className="cart-btn" icon={<ShoppingCartOutlined />}>
            <span className="btn__text">Корзина</span>
          </Button>
        </div>
      </div>

      <LoginModal
        open={isLoginOpen}
        onCancel={() => setIsLoginOpen(false)}
        onRegisterClick={() => setIsRegisterOpen(true)}
        onLoginSuccess={(name) => setUserName(name)}
      />

      <RegisterModal
        open={isRegisterOpen}
        onCancel={() => setIsRegisterOpen(false)}
        onRegisterSuccess={(name) => setUserName(name)}
      />
    </header>
  );
}

export default Header;
