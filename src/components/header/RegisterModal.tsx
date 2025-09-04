import React from "react";
import { Button, Form, Input, Modal, Space, message } from "antd";
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { registerApi, loginApi } from "../../api/auth";
import useLoginCheck from "./useLoginCheck";

type Props = {
  open: boolean;
  onCancelBackToLogin: () => void;
  onCloseAll: () => void;
  onAutoLoggedIn: (userName: string) => void;
};

const RegisterModal: React.FC<Props> = ({
  open,
  onCancelBackToLogin,
  onCloseAll,
  onAutoLoggedIn,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const { state, onChangeLogin, suffix, validateStatus, help } = useLoginCheck({
    min: 5,
    max: 15,
  });

  const submit = async () => {
    try {
      const values = await form.validateFields();

      if (state === "taken") {
        message.error("Логин занят");
        return;
      }

      setLoading(true);

      const reg = await registerApi({
        login: values.login,
        password: values.password,
        email: values.email || undefined,
        phone: values.phone || undefined,
      });

      if (!reg.ok) {
        setLoading(false);
        message.error(reg.message || "Не удалось зарегистрироваться");
        return;
      }

      message.success(reg.message || "Регистрация успешна");

      const sig = await loginApi(values.login, values.password);
      if (!sig.ok) {
        setLoading(false);
        onCancelBackToLogin();
        window.dispatchEvent(
          new CustomEvent("prefill-login", { detail: values.login })
        );
        return;
      }

      const name = (sig.data as any)?.login || values.login;
      message.success("Вы вошли в систему");
      form.resetFields();
      setLoading(false);
      onAutoLoggedIn(name);
    } catch (err: any) {
      if (err && Array.isArray(err.errorFields)) {
        return;
      }
      console.error(err);
      setLoading(false);
      message.error("Что-то пошло не так. Проверьте подключение к серверу.");
    }
  };

  const confirmSuffix =
    form.getFieldValue("password") &&
    form.getFieldValue("confirm") &&
    form.getFieldValue("password") === form.getFieldValue("confirm") ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : null;

  return (
    <Modal
      title="Регистрация"
      open={open}
      onCancel={onCloseAll}
      maskClosable
      destroyOnHidden
      footer={
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancelBackToLogin} disabled={loading}>
            Отмена
          </Button>
          <Button type="primary" onClick={submit} loading={loading}>
            Зарегистрировать
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} name="regForm" autoComplete="off">
        <Form.Item
          label="Логин"
          name="login"
          validateStatus={validateStatus as any}
          help={help}
          rules={[
            { required: true, message: "Введите логин" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
          ]}
        >
          <Input
            placeholder="от 5 до 15 символов"
            prefix={<UserOutlined />}
            maxLength={15}
            onChange={(e) => onChangeLogin(e.target.value)}
            suffix={suffix}
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
            placeholder="от 5 до 15 символов"
            prefix={<LockOutlined />}
            maxLength={15}
          />
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Повторите пароль" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="повторите пароль"
            prefix={<LockOutlined />}
            maxLength={15}
            suffix={confirmSuffix}
          />
        </Form.Item>

        <Form.Item
          label="Email (необязательно)"
          name="email"
          rules={[
            { max: 50, message: "Не более 50 символов" },
            {
              validator: (_, value?: string) => {
                if (!value) return Promise.resolve();
                const okLen = value.length <= 50;
                const okDomain =
                  value.endsWith("@yandex.ru") || value.endsWith("@mail.com");
                if (okLen && okDomain) return Promise.resolve();
                return Promise.reject(
                  new Error("Только @yandex.ru или @mail.com, до 50 символов")
                );
              },
            },
          ]}
        >
          <Input
            placeholder="user@yandex.ru"
            prefix={<MailOutlined />}
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[
            { required: true, message: "Введите телефон" },
            { pattern: /^\d{11}$/, message: "Ровно 11 цифр" },
          ]}
        >
          <Input
            placeholder="только цифры, 11 символов"
            prefix={<PhoneOutlined />}
            inputMode="numeric"
            maxLength={11}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ phone: digits });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
