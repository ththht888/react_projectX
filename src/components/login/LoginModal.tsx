import React, { useEffect } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginApi } from "../../api/auth";
import "./LoginModal.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onLoggedIn: (userName: string) => void;
  onNotify: (
    type: "success" | "error" | "warning" | "info",
    text: string
  ) => void;
};

const LoginModal: React.FC<Props> = ({
  open,
  onClose,
  onOpenRegister,
  onLoggedIn,
  onNotify,
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
      const v = await form.validateFields();
      setLoading(true);
      const res = await loginApi(v.login, v.password);
      if (!res.ok) {
        const text = res.message || "Неверные данные";
        message.error(text);
        onNotify("error", text);
        return;
      }
      const name = (res.data as any)?.login || v.login;
      const okText = res.message || "Успешный вход";
      message.success(okText);
      onNotify("success", okText);
      onLoggedIn(name);
      form.resetFields();
    } catch (err: any) {
      if (!(err && Array.isArray(err.errorFields))) {
        message.error("Не удалось выполнить вход");
        onNotify("error", "Не удалось выполнить вход");
      }
    } finally {
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
      rootClassName="login-modal"
      footer={
        <div className="modal-footer">
          <Button type="link" onClick={onOpenRegister} disabled={loading}>
            Регистрация
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="primary" onClick={submit} loading={loading}>
            Войти
          </Button>
        </div>
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
