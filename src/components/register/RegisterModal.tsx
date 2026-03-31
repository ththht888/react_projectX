import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { registerApi, checkLoginApi } from "../../api/auth";
import { saveUser } from "../../utils/authStore";
import "./RegisterModal.scss";
import { RegisterModalProps, RegisterInput } from "../../interfaces/interfaces";

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onCancel,
  onRegisterSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [loginExists, setLoginExists] = useState(false);

  const handleCheckLogin = async (login: string) => {
    try {
      const res = await checkLoginApi(login);

      if (res) {
        const data = await res.json();
        setLoginExists(data.result === true);
      }
    } catch (e) {
      console.log("Ошибка в handleCheckLogin:", e);
    }
  };

  const handleSubmit = async (
    values: RegisterInput & { confirmPassword: string }
  ) => {
    if (values.password !== values.confirmPassword) return;

    setLoading(true);

    try {
      const res = await registerApi({
        login: values.login,
        password: values.password,
        email: values.email,
        phone: values.phone,
      });

      if (res && res.ok) {
        saveUser({ login: values.login });
        onRegisterSuccess(values.login);
        onCancel();
      } else {
        console.log("Ошибка регистрации");
      }
    } catch (e) {
      console.log("Ошибка в handleSubmit RegisterModal:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered>
      <h3>Регистрация</h3>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="login"
          label="Логин"
          rules={[{ required: true, message: "Введите логин" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Введите логин"
            onBlur={(e) => handleCheckLogin(e.target.value)}
          />
        </Form.Item>

        {loginExists && (
          <p style={{ color: "red" }}>Такой логин уже существует</p>
        )}

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Повторите пароль"
          rules={[{ required: true, message: "Повторите пароль" }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Введите корректный email",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
          rules={[{ required: true, message: "Введите телефон" }]}
        >
          <Input prefix={<PhoneOutlined />} />
        </Form.Item>

        <div className="register-btns">
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Зарегистрировать
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
