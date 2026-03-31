import React, { useState } from "react";
import { AutoComplete, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./SearchBox.scss";

const SearchBox: React.FC = () => {
  const [search, setSearch] = useState("");
  const options = [
      { value: "iPhone 15" },
      { value: "Samsung Galaxy" },
      { value: "Футболка" },
  ];
  const filtered = options.filter((o) =>
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="search-box">
      <AutoComplete
        className="search-input"
        placeholder="Поиск"
        value={search}
        options={filtered}
        onChange={setSearch}
        filterOption={false}
      />
      <Button className="search-btn" type="primary" icon={<SearchOutlined />} />
    </div>
  );
};

export default SearchBox;
