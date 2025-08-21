import React, { useState } from "react";
import { Button, AutoComplete } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import "./Header.scss";

function Header() {
  const [search, setSearch] = useState("");

  const searchSuggestions = [
    { value: "iPhone 15" },
    { value: "Samsung Galaxy" },
    { value: "Nike Air Max" },
    { value: "Футболка" },
    { value: "Джинсы" },
    { value: "Кроссовки" },
    { value: "Платье" },
    { value: "Куртка" },
    { value: "Рубашка" },
  ];

  const filteredSuggestions = searchSuggestions.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="search-box">
            <AutoComplete
              className="search-input"
              placeholder="Поиск"
              value={search}
              options={filteredSuggestions}
              onChange={(value) => setSearch(value)}
              filterOption={false}
            />
            <Button
              className="search-btn"
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {}}
            />
          </div>
        </div>

        <div className="header__right">
          <Button className="login-btn" type="default">
            <LoginOutlined className="btn__icon" />
            <span className="btn__text">Войти</span>
          </Button>
          <Button className="cart-btn" type="default">
            <ShoppingCartOutlined className="btn__icon" />
            <span className="btn__text">Корзина</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
