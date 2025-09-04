import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Space, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginApi } from "../../api/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onLoggedIn: (userName: string) => void;
};

const LoginModal: React.FC<Props> = ({
  open,
  onClose,
  onOpenRegister,
  onLoggedIn,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const login = (e as CustomEvent<string>).detail;
      form.setFieldsValue({ login });
    };
    window.addEventListener("prefill-login", handler as EventListener);
    return () =>
      window.removeEventListener("prefill-login", handler as EventListener);
  }, [form]);

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await loginApi(values.login, values.password);
      if (res.ok) {
        const name = (res.data as any)?.login || values.login;
        message.success(res.message || "Успешный вход");
        onLoggedIn(name);
        form.resetFields();
        setLoading(false);
      } else {
        message.error(res.message || "Неверные данные");
        setLoading(false);
      }
    } catch (err: any) {
      if (!(err && Array.isArray(err.errorFields))) {
        console.error(err);
        message.error("Не удалось выполнить вход");
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Вход"
      open={open}
      onCancel={onClose}
      maskClosable
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <div>
            <Button type="link" onClick={onOpenRegister} disabled={loading}>
              Регистрация
            </Button>
          </div>
          <div>
            <Button onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="primary" onClick={submit} loading={loading}>
              Войти
            </Button>
          </div>
        </Space>
      }
    >
      <Form form={form} layout="vertical" name="loginForm">
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: "Введите логин" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
          ]}
        >
          <Input
            placeholder="Логин"
            prefix={<UserOutlined />}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
          ]}
        >
          <Input.Password
            placeholder="Пароль"
            prefix={<LockOutlined />}
            autoComplete="current-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
