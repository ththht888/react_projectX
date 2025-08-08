import React, { useState } from "react";
import { Button, Input, Select } from "antd";
const { Option } = Select;
import "./Header.css";

function Header() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <header className="header">
      <div className="header_inner">
        <div className="header_left">
          <h1 className="logo">GrooveBay</h1>
          <Button className="catalog-btn" type="primary">
            Каталог
          </Button>
          <div className="search-box">
            <Select
              className="select-category"
              value={category}
              onChange={(value) => setCategory(value)}
            >
              <Option value="all">Все</Option>
              <Option value="clothes">Одежда</Option>
              <Option value="shoes">Обувь</Option>
            </Select>

            <Input
              className="search-input"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button className="search-btn" type="primary" onClick={() => {}}>
              Поиск
            </Button>
          </div>
        </div>
        <div className="header_right">
          <Button className="login-btn" type="default">
            Войти
          </Button>
          <Button className="cart-btn" type="default">
            Корзина
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
