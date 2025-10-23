import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginApi } from "../../api/auth";
import { saveUser } from "../../utils/authStore";
import "./LoginModal.scss";
import { Props } from "../../interfaces/interfaces";

const LoginModal: React.FC<Props> = ({
  open,
  onCancel,
  onRegisterClick,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      const res = await loginApi(values.login, values.password);
      if (res && res.ok) {
        saveUser({ login: values.login });
        onLoginSuccess(values.login);
        onCancel();
      } else {
        console.log("Ошибка авторизации");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered>
      <h3>Вход</h3>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="login"
          label="Логин"
          rules={[{ required: true, message: "Введите логин" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Введите логин" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Введите пароль"
          />
        </Form.Item>
        <div className="login-actions">
          <Button onClick={onRegisterClick} type="link">
            Регистрация
          </Button>
          <div className="login-btns">
            <Button onClick={onCancel}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Войти
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal;
