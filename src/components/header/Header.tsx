import React, { useState } from "react";
import { Button, AutoComplete, Select } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  ProductOutlined,
} from "@ant-design/icons";
const { Option } = Select;
import "./Header.scss";

function Header() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

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
            <span className="logo__text">{isMobile ? "GB" : "GrooveBay"}</span>
          </h1>
          <Button className="catalog-btn" type="primary">
            {isMobile ? <ProductOutlined /> : "Каталог"}
          </Button>
          <div className="search-box">
            <Select
              className="select-category"
              value={category}
              onChange={(value) => setCategory(value)}
              suffixIcon={isMobile ? null : undefined}
            >
              <Option value="all">{isMobile ? "" : "Все"}</Option>
              <Option value="clothes">{isMobile ? "" : "Одежда"}</Option>
              <Option value="shoes">{isMobile ? "" : "Обувь"}</Option>
            </Select>

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
            {isMobile ? <LoginOutlined /> : "Войти"}
          </Button>
          <Button className="cart-btn" type="default">
            {isMobile ? <ShoppingCartOutlined /> : "Корзина"}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
