import React from "react";
import { Alert } from "antd";
import "./NoticeBar.scss";

type Props = {
  type: "success" | "error" | "warning" | "info";
  text: string;
  onClose: () => void;
};

const NoticeBar: React.FC<Props> = ({ type, text, onClose }) => {
  if (!text) return null;
  return (
    <div className="notice-bar">
      <Alert type={type} message={text} showIcon closable onClose={onClose} />
    </div>
  );
};

export default NoticeBar;
